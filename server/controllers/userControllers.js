import User from '../Models/userModel.js'
import generateToken from '../config/generateToken.js'

const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please enter all the necessary fields")
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("This email has been taken")
    }

    const newUser = await User.create({
        name,
        email,
        password,
        pic
    })

    if (newUser) {
        res.status(201).json({
            name: newUser.name,
            _id: newUser._id,
            email: newUser.email,
            pic: newUser.pic,
            token: generateToken(newUser._id)
        })
    } else {
        res.status(400)
        throw new Error("An error occurred whilest creating the user")
    }
}

const authUser = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            name: user.name,
            _id: user._id,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid email or password")
    }
}

const allUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {}
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
}

export { registerUser, authUser, allUsers }