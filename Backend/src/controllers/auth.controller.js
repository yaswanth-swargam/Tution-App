import pool from '../lib/db.js'
import bcrypt from 'bcrypt'
import {mapUser} from '../utils/userMapper.js'
import generateToken from '../lib/utils.js'

export const signup=async (req,res)=>{
    const {fullName,email,password}=req.body
    console.log(req.body)
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                message: "Password must be ateast 6 characters"
            })
        }

        //checking if user already exists
        const [rows]=await pool.query('select id from users where email=?',[email])
        if(rows.length>0){
            return res.status(409).json({
                message: 'User already exists'
            })
        }

        //Hash password
        const hashedPass=await bcrypt.hash(password,10)

        //insert user
        const [result] = await pool.query(
            `INSERT INTO users (full_name, email, password, role)
                VALUES (?, ?, ?, ?)`,
            [fullName, email, hashedPass, "student"]
);
        generateToken(result.insertId,res)

        const [user]=await pool.query(`select id,full_name,email,profile_pic,role,created_at from users where id=?`,[result.insertId])

        return res.status(201).json({
            message: "User registered succesfully",
            user: mapUser(user[0])
        })
    }
    catch(e){
        console.error(e)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export const signin=async (req,res)=>{
    const {email,password}=req.body;
    console.log(req.body)
    if(!email || !password){
        return res.status(400).json({
            message: 'Email and Password are required'
        })
    }
    try{
        //finding the user
        const [users]=await pool.query('select id,full_name,password,profile_pic,email,role,created_at from users where email=?',[email])
        if(users.length===0){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const user=users[0]

        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({message: "Invalid email or password"})
        }

        generateToken(user.id,res)

        return res.status(200).json(mapUser(user),{message: "login successful"})
    }
    catch(e){
        console.log("ERROR in login",e.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}


export const logout=async (req,res)=>{
    try{
        res.cookie('jwt',"",{maxAge:0})
        res.status(200).json({message: "Logged out successfully"})
    }
    catch(e){
        console.log("Error in logout controller",e.message)
    }
}


export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(mapUser(req.user))
    }
    catch(e){
        console.log('error in checkAuth',e.message)
        res.status(500).json({message: 'internal Server error'})
    }
}


export const updateProfile=(req,res)=>{
    return res.json({
        message: "profile updated!"
    })
}