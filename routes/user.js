const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const { JWT_SECRET } = require("../config");
const jwt = require('jsonwebtoken')
// User Routes
router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    await User.create({
        username, password
    })
    res.json({
        msg: "User Created Successfully"
    })
});

router.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = User.find({ username, password })
    if (user) {
        const token = jwt.sign({ username }, JWT_SECRET)
        res.json({ token })
    }
    else {
        res.status(411).json({ msg: 'Invalid Credentials' })
    }
});

router.get('/courses', async (req, res) => {
    const courses = await Course.find({})
    res.json({ courses })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const username = req.username;
    const courseId = req.params.courseId;
    try {
        await User.updateOne({
            username
        }, {
            "$push": {
                purchasedCourses: courseId
            }
        })
    } catch (error) {
        console.log(error);
    }
    res.json({ msg: 'Purchase Successful' })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const user = await User.findOne({ username: req.username })
    console.log(user, 'user');
    const courses = await Course.find({
        _id: {
            '$in': user.purchasedCourses
        }
    })
    res.json({ courses })
});

module.exports = router