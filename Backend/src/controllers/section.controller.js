import pool from '../lib/db.js'

export const sections=async (req,res)=>{
    const userId = req.user.id;
    const role = req.user.role;
    try{
        if(role=='admin'){
            const [result]=await pool.query(`select * from sections`);
            return res.status(200).json(result)
        }
        else{
            const [result]=await pool.query('SELECT s.* FROM sections s JOIN section_members sm ON s.id = sm.section_id WHERE sm.user_id = ?',[userId])
            return res.status(200).json(result)
        }
    }
    catch (error) {
    console.error("Error fetching sections:", error.message);

    return res.status(500).json({
      message: "Failed to fetch sections",
    });
  }
}


export const getSectionById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    // ADMIN
    if (role === "admin") {
      const [result] = await pool.query(
        "SELECT * FROM sections WHERE id = ?",
        [id]
      );

      if (result.length === 0) {
        return res.status(404).json({
          message: "Section not found",
        });
      }

      return res.status(200).json(result[0]);
    }

    // STUDENT
    if (role === "student") {
      const [membership] = await pool.query(
        `SELECT *
         FROM section_members
         WHERE section_id = ? AND user_id = ?`,
        [id, userId]
      );

      if (membership.length === 0) {
        return res.status(403).json({
          message: "You do not have access to this section",
        });
      }

      const [result] = await pool.query(
        "SELECT * FROM sections WHERE id = ?",
        [id]
      );

      if (result.length === 0) {
        return res.status(404).json({
          message: "Section not found",
        });
      }

      return res.status(200).json(result[0]);
    }
  } catch (error) {
    console.error("Error fetching section:", error.message);

    return res.status(500).json({
      message: "Failed to fetch section",
    });
  }
};






export const renameSection = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to rename sections",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Section name is required",
      });
    }

    const [result] = await pool.query(
      "UPDATE sections SET name = ? WHERE id = ?",
      [name.trim(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    const [updatedSection] = await pool.query(
      "SELECT * FROM sections WHERE id = ?",
      [id]
    );

    return res.status(200).json(updatedSection[0]);

  } catch (error) {
    console.error("Error renaming section:", error.message);

    return res.status(500).json({
      message: "Failed to rename section",
    });
  }
};


export const addStudent = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const role = req.user.role;

  try {
    // Only admin can add students
    if (role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to add students",
      });
    }

    // Check section
    const [section] = await pool.query(
      "SELECT * FROM sections WHERE id = ?",
      [id]
    );

    if (section.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // Check student
    const [student] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (student.length === 0 || student[0].role !== "student") {
      return res.status(400).json({
        message: "Valid student not found",
      });
    }

    // Check existing membership
    const [existingMember] = await pool.query(
      "SELECT * FROM section_members WHERE section_id = ? AND user_id = ?",
      [id, userId]
    );

    if (existingMember.length > 0) {
      return res.status(400).json({
        message: "Student is already in this section",
      });
    }

    // Add student
    await pool.query(
      "INSERT INTO section_members (section_id, user_id) VALUES (?, ?)",
      [id, userId]
    );

    return res.status(201).json({
      message: "Student added successfully",
    });

  } catch (error) {
    console.error("Error adding student:", error.message);

    return res.status(500).json({
      message: "Failed to add student",
    });
  }
};

export const removeStudent = async (req, res) => {
  const { id, userId } = req.params;
  const role = req.user.role;

  try {
    if (role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to remove students",
      });
    }

    const [member] = await pool.query(
      `SELECT * FROM section_members 
       WHERE section_id = ? AND user_id = ?`,
      [id, userId]
    );

    if (member.length === 0) {
      return res.status(404).json({
        message: "Student is not in this section",
      });
    }

    await pool.query(
      `DELETE FROM section_members 
       WHERE section_id = ? AND user_id = ?`,
      [id, userId]
    );

    return res.status(200).json({
      message: "Student removed from section successfully",
    });

  } catch (error) {
    console.error("Error removing student:", error.message);

    return res.status(500).json({
      message: "Failed to remove student from section",
    });
  }
};


export const sectionMembers = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    // Check whether section exists
    const [sectionDetails] = await pool.query(
      "SELECT * FROM sections WHERE id = ?",
      [id]
    );

    if (sectionDetails.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // If student, check membership
    if (role === "student") {
      const [membership] = await pool.query(
        `SELECT * FROM section_members
         WHERE section_id = ? AND user_id = ?`,
        [id, userId]
      );

      if (membership.length === 0) {
        return res.status(403).json({
          message: "You do not have access to this section",
        });
      }
    }

    // Get all members
    const [members] = await pool.query(
      `SELECT
        u.id,
        u.full_name,
        u.email,
        u.profile_pic,
        u.role
      FROM section_members sm
      JOIN users u ON sm.user_id = u.id
      WHERE sm.section_id = ?`,
      [id]
    );

    return res.status(200).json({
      section: sectionDetails[0],
      members,
    });

  } catch (error) {
    console.error("Error fetching section members:", error.message);

    return res.status(500).json({
      message: "Failed to fetch section members",
    });
  }
};



export const getAvailableStudents = async (req, res) => {
  const { id } = req.params;

  try {
    // Only admin can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not allowed to access this resource",
      });
    }

    // Check whether section exists
    const [section] = await pool.query(
      "SELECT id FROM sections WHERE id = ?",
      [id]
    );

    if (section.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // Get students who are NOT already members
    const [students] = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        profile_pic,
        role
      FROM users
      WHERE role = "student"
        AND id NOT IN (
          SELECT user_id
          FROM section_members
          WHERE section_id = ?
        )
      ORDER BY full_name ASC
      `,
      [id]
    );

    return res.status(200).json(students);

  } catch (error) {
    console.error(
      "Error fetching available students:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to fetch available students",
    });
  }
};









export const createSection = async (req, res) => {
  const { name } = req.body;
  const {id}=req.user;

  try {
    // Only admin can create sections
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can create sections",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Section name is required",
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO sections (name,created_by)
      VALUES (?,?)
      `,
      [name.trim(),id]
    );

    const [sections] = await pool.query(
      `
      SELECT *
      FROM sections
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      message: "Section created successfully",
      section: sections[0],
    });

  } catch (error) {
    console.error(
      "Error creating section:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to create section",
    });
  }
};








export const deleteSection = async (req, res) => {
  const { id } = req.params;

  try {
    // Only admin can delete a section
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can delete sections",
      });
    }

    // Check whether section exists
    const [section] = await pool.query(
      "SELECT id FROM sections WHERE id = ?",
      [id]
    );

    if (section.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    /*
      Delete related members first.

      Whether you also need to explicitly delete messages
      depends on whether your database foreign keys use
      ON DELETE CASCADE.
    */

    await pool.query(
      "DELETE FROM section_members WHERE section_id = ?",
      [id]
    );

    // Delete messages belonging to this section
    await pool.query(
      "DELETE FROM messages WHERE section_id = ?",
      [id]
    );

    // Finally delete the section
    await pool.query(
      "DELETE FROM sections WHERE id = ?",
      [id]
    );

    return res.status(200).json({
      message: "Section deleted successfully",
    });

  } catch (error) {
    console.error(
      "Error deleting section:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to delete section",
    });
  }
};