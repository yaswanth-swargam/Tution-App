import pool from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";
// ==========================================
// CREATE STUDY MATERIAL
// ==========================================

export const createStudyMaterial = async (req, res) => {
  const { sectionId } = req.params;

  const {
    title,
    description,
    material_type,
    file_url,
    file_public_id,
    file_name,
    file_type,
    file_size,
    external_url,
  } = req.body;

  const userId = req.user.id;
  const role = req.user.role;

  try {
    // ==========================================
    // ADMIN ONLY
    // ==========================================

    if (role !== "admin") {
      return res.status(403).json({
        message: "Only administrators can add study materials",
      });
    }

    // ==========================================
    // VALIDATE TITLE
    // ==========================================

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Material title is required",
      });
    }

    // ==========================================
    // VALIDATE MATERIAL TYPE
    // ==========================================

    if (!["file", "link"].includes(material_type)) {
      return res.status(400).json({
        message: "Material type must be file or link",
      });
    }

    // ==========================================
    // VALIDATE FILE / LINK
    // ==========================================

    if (material_type === "file" && !file_url) {
      return res.status(400).json({
        message: "File URL is required",
      });
    }

    if (material_type === "link" && !external_url) {
      return res.status(400).json({
        message: "External URL is required",
      });
    }

    // ==========================================
    // CHECK SECTION
    // ==========================================

    const [section] = await pool.query(
      `
      SELECT id
      FROM sections
      WHERE id = ?
      `,
      [sectionId]
    );

    if (section.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // ==========================================
    // INSERT MATERIAL
    // ==========================================

    const [result] = await pool.query(
      `
      INSERT INTO study_materials (
        section_id,
        title,
        description,
        material_type,
        file_url,
        file_public_id,
        file_name,
        file_type,
        file_size,
        external_url,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        sectionId,
        title.trim(),
        description?.trim() || null,
        material_type,

        material_type === "file"
          ? file_url || null
          : null,

        material_type === "file"
          ? file_public_id || null
          : null,

        material_type === "file"
          ? file_name || null
          : null,

        material_type === "file"
          ? file_type || null
          : null,

        material_type === "file"
          ? file_size || null
          : null,

        material_type === "link"
          ? external_url || null
          : null,

        userId,
      ]
    );

    // ==========================================
    // GET CREATED MATERIAL
    // ==========================================

    const [materials] = await pool.query(
      `
      SELECT
        sm.id,
        sm.section_id,
        sm.title,
        sm.description,
        sm.material_type,

        sm.file_url,
        sm.file_public_id,
        sm.file_name,
        sm.file_type,
        sm.file_size,

        sm.external_url,

        sm.created_by,
        sm.created_at,
        sm.updated_at,

        u.full_name AS created_by_name

      FROM study_materials sm

      JOIN users u
        ON sm.created_by = u.id

      WHERE sm.id = ?
      `,
      [result.insertId]
    );



    //
        // ==========================================
    // NOTIFY STUDENTS AND ADMIN
    // ==========================================

    const [students] = await pool.query(
      `
      SELECT DISTINCT
        u.id
      FROM users u
      INNER JOIN section_members sm
        ON u.id = sm.user_id
      WHERE sm.section_id = ?
        AND u.role = 'student'
      `,
      [sectionId]
    );

    // Get all admins
    const [admins] = await pool.query(
      `
      SELECT id
      FROM users
      WHERE role = 'admin'
      `
    );

    const recipients = [
      ...students,
      ...admins,
    ];

    if (recipients.length > 0) {
      const material = materials[0];

      const notificationValues = recipients.map(
        (recipient) => [
          recipient.id,
          "MATERIAL",
          "New Study Material",
          `${material.title} has been added to your section.`,
          material.id,
          "STUDY_MATERIAL",
        ]
      );

      const notificationPlaceholders = notificationValues
        .map(() => "(?, ?, ?, ?, ?, ?)")
        .join(",");

      await pool.query(
        `
        INSERT INTO notifications
        (
          user_id,
          type,
          title,
          message,
          reference_id,
          reference_type
        )
        VALUES ${notificationPlaceholders}
        `,
        notificationValues.flat()
      );

      console.log(
        `🔔 Material notification sent to ${recipients.length} users`
      );
    }


    return res.status(201).json(
      materials[0]
    );

  } catch (error) {
    console.error(
      "Error creating study material:",
      error
    );

    return res.status(500).json({
      message: "Failed to create study material",
    });
  }
};



// ==========================================
// GET SECTION MATERIALS
// ==========================================

export const getSectionMaterials = async (req, res) => {
  const { sectionId } = req.params;

  const userId = req.user.id;
  const role = req.user.role;

  try {
    // ==========================================
    // CHECK SECTION
    // ==========================================

    const [section] = await pool.query(
      `
      SELECT id
      FROM sections
      WHERE id = ?
      `,
      [sectionId]
    );

    if (section.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // ==========================================
    // STUDENT ACCESS CHECK
    // ==========================================

    if (role === "student") {
      const [membership] = await pool.query(
        `
        SELECT section_id
        FROM section_members
        WHERE section_id = ?
        AND user_id = ?
        `,
        [sectionId, userId]
      );

      if (membership.length === 0) {
        return res.status(403).json({
          message:
            "You do not have access to this section",
        });
      }
    }

    // ==========================================
    // FETCH MATERIALS
    // ==========================================

    const [materials] = await pool.query(
      `
      SELECT
        sm.id,
        sm.section_id,

        sm.title,
        sm.description,
        sm.material_type,

        sm.file_url,
        sm.file_public_id,
        sm.file_name,
        sm.file_type,
        sm.file_size,

        sm.external_url,

        sm.created_by,
        sm.created_at,
        sm.updated_at,

        u.full_name AS created_by_name

      FROM study_materials sm

      JOIN users u
        ON sm.created_by = u.id

      WHERE sm.section_id = ?

      ORDER BY sm.created_at DESC
      `,
      [sectionId]
    );

    return res.status(200).json(
      materials
    );

  } catch (error) {
    console.error(
      "Error fetching study materials:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch study materials",
    });
  }
};


// ==========================================
// UPDATE STUDY MATERIAL
// ==========================================

export const updateStudyMaterial = async (req, res) => {
  const { materialId } = req.params;

  const {
    title,
    description,
    external_url,
  } = req.body;

  const role = req.user.role;

  try {
    // ==========================================
    // ADMIN ONLY
    // ==========================================

    if (role !== "admin") {
      return res.status(403).json({
        message:
          "Only administrators can update study materials",
      });
    }

    // ==========================================
    // VALIDATE TITLE
    // ==========================================

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Material title is required",
      });
    }

    // ==========================================
    // CHECK MATERIAL
    // ==========================================

    const [materials] = await pool.query(
      `
      SELECT id, material_type
      FROM study_materials
      WHERE id = ?
      `,
      [materialId]
    );

    if (materials.length === 0) {
      return res.status(404).json({
        message: "Study material not found",
      });
    }

    const material = materials[0];

    // ==========================================
    // UPDATE
    // ==========================================

    await pool.query(
      `
      UPDATE study_materials
      SET
        title = ?,
        description = ?,
        external_url = ?
      WHERE id = ?
      `,
      [
        title.trim(),
        description?.trim() || null,

        material.material_type === "link"
          ? external_url || null
          : null,

        materialId,
      ]
    );

    // ==========================================
    // GET UPDATED MATERIAL
    // ==========================================

    const [updatedMaterials] = await pool.query(
      `
      SELECT
        sm.id,
        sm.section_id,
        sm.title,
        sm.description,
        sm.material_type,

        sm.file_url,
        sm.file_public_id,
        sm.file_name,
        sm.file_type,
        sm.file_size,

        sm.external_url,

        sm.created_by,
        sm.created_at,
        sm.updated_at,

        u.full_name AS created_by_name

      FROM study_materials sm

      JOIN users u
        ON sm.created_by = u.id

      WHERE sm.id = ?
      `,
      [materialId]
    );

    return res.status(200).json(
      updatedMaterials[0]
    );

  } catch (error) {
    console.error(
      "Error updating study material:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update study material",
    });
  }
};








// ==========================================
// DELETE STUDY MATERIAL
// ==========================================

export const deleteStudyMaterial = async (
  req,
  res
) => {
  const { materialId } = req.params;

  const role = req.user.role;

  try {
    // ==========================================
    // ADMIN ONLY
    // ==========================================

    if (role !== "admin") {
      return res.status(403).json({
        message:
          "Only administrators can delete study materials",
      });
    }

    // ==========================================
    // GET MATERIAL
    // ==========================================

    const [materials] = await pool.query(
      `
      SELECT
        id,
        file_public_id,
        file_type
      FROM study_materials
      WHERE id = ?
      `,
      [materialId]
    );

    if (materials.length === 0) {
      return res.status(404).json({
        message:
          "Study material not found",
      });
    }

    const material = materials[0];

    // ==========================================
    // DELETE CLOUDINARY FILE
    // ==========================================

    if (material.file_public_id) {
      try {
        await cloudinary.uploader.destroy(
          material.file_public_id,
          {
            resource_type: "raw",
          }
        );

        console.log(
          `☁️ Deleted Cloudinary file: ${material.file_public_id}`
        );

      } catch (cloudinaryError) {
        console.error(
          "Cloudinary delete failed:",
          cloudinaryError
        );

        // We don't stop the DB deletion here.
        // The material should still be removable
        // from the application.
      }
    }

    // ==========================================
    // DELETE DATABASE RECORD
    // ==========================================

    await pool.query(
      `
      DELETE FROM study_materials
      WHERE id = ?
      `,
      [materialId]
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      message:
        "Study material deleted successfully",
    });

  } catch (error) {
    console.error(
      "Error deleting study material:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete study material",
    });
  }
};


// ==========================================
// GET ALL ACCESSIBLE STUDY MATERIALS
// ==========================================

export const getAccessibleStudyMaterials = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    let materials;

    // ==========================================
    // ADMIN
    // Can see materials from ALL sections
    // ==========================================

    if (role === "admin") {
      const [rows] = await pool.query(
        `
        SELECT
          sm.id,
          sm.section_id,

          s.name AS section_name,

          sm.title,
          sm.description,
          sm.material_type,

          sm.file_url,
          sm.file_public_id,
          sm.file_name,
          sm.file_type,
          sm.file_size,

          sm.external_url,

          sm.created_by,
          sm.created_at,
          sm.updated_at,

          u.full_name AS created_by_name

        FROM study_materials sm

        JOIN sections s
          ON sm.section_id = s.id

        JOIN users u
          ON sm.created_by = u.id

        ORDER BY
          s.name ASC,
          sm.created_at DESC
        `
      );

      materials = rows;
    }

    // ==========================================
    // STUDENT
    // Can see ONLY their sections
    // ==========================================

    else {
      const [rows] = await pool.query(
        `
        SELECT
          sm.id,
          sm.section_id,

          s.name AS section_name,

          sm.title,
          sm.description,
          sm.material_type,

          sm.file_url,
          sm.file_public_id,
          sm.file_name,
          sm.file_type,
          sm.file_size,

          sm.external_url,

          sm.created_by,
          sm.created_at,
          sm.updated_at,

          u.full_name AS created_by_name

        FROM study_materials sm

        JOIN sections s
          ON sm.section_id = s.id

        JOIN section_members smem
          ON sm.section_id = smem.section_id

        JOIN users u
          ON sm.created_by = u.id

        WHERE smem.user_id = ?

        ORDER BY
          s.name ASC,
          sm.created_at DESC
        `,
        [userId]
      );

      materials = rows;
    }

    return res.status(200).json(materials);

  } catch (error) {
    console.error(
      "Error fetching accessible study materials:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch study materials",
    });
  }
};