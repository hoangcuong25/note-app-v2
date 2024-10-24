require("dotenv").config()

const mongoose = require("mongoose")
const config = require("./config.json")
const bcrypt = require("bcrypt")
const express = require("express")
const cors = require("cors")

const jwt = require("jsonwebtoken")

const User = require("./models/user.model")
const Note = require("./models/note.model")
const { authenticateToken } = require("./utilities")

mongoose.connect(config.connectString)

const app = express()
app.use(express.json())
app.use(cors({ origin: "*" }))

// test api
app.get("/hello", async (req, res) => {
    return res.status(200).json({ message: "hello hihi" })
})

// login 
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: true, message: "All field are required" })
        }

        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ error: true, message: "User not found" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ error: true, message: "Wrong password!" })
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECERT, { expiresIn: "72h" })

        return res.status(200).json({
            error: false,
            user: user,
            accessToken
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error })
    }
})

// create account
app.post("/create-account", async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ error: true, message: "All field are required" })
        }

        const isUser = await User.findOne({ email: email })

        if (isUser) {
            return res.status(400).json({ error: true, message: "User already exist" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save()

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECERT, { expiresIn: "72h" })

        return res.status(200).json({
            error: false,
            user: user,
            accessToken,
            message: "Register Successfully"
        })
    } catch (error) {
        res.status(500).json({ message: "Server error", error })
    }
})

// get user info
app.get("/get-user", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user

        const user = await User.findOne({ _id: userId })

        if (!user) {
            return res.status(400).json({ error: true, message: "User not found" })
        }

        return res.status(200).json({ error: false, userName: user.name })

    } catch (error) {
        res.status(500).json({ message: "Server error", error })
    }
})

// add note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body
    const { userId } = req.user

    if (!title || !content) {
        return res.status(400).json({
            error: true,
            message: "All fields are required"
        })
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: userId
        })

        await note.save();

        return res.status(201).json({
            error: false,
            note: note,
            message: "Add Note Successfully"
        })

    } catch (error) {
        res.status(500).json({ message: "Server error", error })
    }
})

// update note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    try {
        const { noteId } = req.params
        const { title, content, tags } = req.body
        const { userId } = req.user

        const note = await Note.findOne({ _id: noteId, userId: userId })

        if (!title && !content) {
            return res.status(400).json({ error: true, message: "Nothing change" })
        }

        note.title = title
        note.content = content
        note.tags = tags

        await note.save()

        return res.status(200).json({ error: false, message: "Updated Successfully", note })

    } catch (error) {
        res.status(500).json({ message: "Server error", error })
    }
})

// delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    try {
        const { noteId } = req.params
        const { userId } = req.user;

        await Note.deleteOne({ userId: userId, _id: noteId });

        return res.status(200).json({ error: false, message: "Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user

        const notes = await Note.find({ userId: userId }).sort({ isPinned: -1 });

        return res.status(200).json({ error: false, message: "Get all notes Succsessfully", notes })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
})

// update isPinned
app.put("/edit-pinned/:noteId", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user
        const { noteId } = req.params
        const { isPinned } = req.body

        const note = await Note.findOne({ _id: noteId, userId: userId })

        if (!note) return res.status(400).json({ error: true })

        note.isPinned = isPinned

        await note.save()

        return res.status(200).json({ error: false, message: "update successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
})

app.get("/search-notes", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { query } = req.query;

        
        const searchCriteria = {
            userId: userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },  
                { content: { $regex: query, $options: 'i' } } 
            ]
        };

        const notes = await Note.find(query ? searchCriteria : { userId: userId }).sort({ isPinned: -1 });

        return res.status(200).json({ error: false, message: "Notes retrieved successfully", notes });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});



app.listen(8000)
module.exports = app