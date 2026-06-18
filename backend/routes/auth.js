import express from "express";
import bcrypt from "bcrypt"
import User from "../models/User.js";
import jwt from "jsonwebtoken"

const router = express.Router();

router.post("/register", async(req, res) => {
    const {firstName, lastName, email, password, userName, avatar} = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            userName,
            password: hashedPassword,
            avatar
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

router.post("/login", async (req, res) => {
    try {
    const {identifier, password } = req.body;

    if (!identifier || !password) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
        $or: [
            {email: identifier},
            {userName : identifier}
        ]
    });

    if (!user) return res.status(400).json({message: "Wrong Email or Username"});

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({message: "Wrong email/username or password"});

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.userName, email: user.email, role: user.role },
    });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;