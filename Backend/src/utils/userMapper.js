export const mapUser=(row)=>(
    {id: row.id,
    fullName: row.full_name,
    email: row.email,
    profilePic: row.profile_pic,
    createdAt:row.created_at,
    updatedAt: row.updated_at,
    role: row.role
}
)