const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const router = express.Router();
const jwt = require('jsonwebtoken')
const { generateToken, verifyToken } = require('./authenticator')
require('../DATABASE/dbConnect')

const User = require('../DATABASE/Models/UserModel');
const Chat = require('../DATABASE/Models/ChatModel');
const Message = require('../DATABASE/Models/MessageModel');

router.post('/register', async (req, res) => {

    try {
        const { name, email, password, profImage } = req.body;
        const isPresent = await User.findOne({ email: email });
        if (isPresent) {
            res.status(201).send({ message: "user already present" })
        } else {
            const newUser = await User.create(req.body);
            res.status(200).send({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                profImage: newUser.profImage,
                token: newUser.token
            })
        }
    } catch (error) {
        console.log(error);
    }





})

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        console.log(email, password);
        if (!email || !password) {
            return res.status(202).send({ message: "fill information" })
        }
        const isPresent = await User.findOne({ email: email });
        console.log('is present', isPresent);
        if (isPresent) {
            const verified = await bcrypt.compare(password, isPresent.password);
            console.log(verified);
            if (verified) {

                res.status(200).send({
                    _id: isPresent._id,
                    name: isPresent.name,
                    email: isPresent.email,
                    profImage: isPresent.profImage,
                    token: await isPresent.generateToken(),
                })

            } else {
                res.status(203).send({ message: "wrong credentials" })
            }
        } else {
            res.status(203).send({ message: "user is not present" })
        }

    } catch (error) {
        console.log(error);
        // res.status(404).send(error)
    }



})

router.get('/chatPage', verifyToken, (req, res) => {

    console.log('chat server is running');
    // res.send(req.user)
})



//chat routes

router.post('/startChat', async (req, res) => {
    const { userId, receiverId } = req.body;
    try {
        const isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: receiverId } } }
            ]
        })
            .populate("users", '-password')
            .populate("latestMsg")
        // console.log(isChat);

        // isChat = await User.populate(isChat,{
        //     path:"latestMsg.sender",
        //     select:"name email profImage"
        // })
        if (isChat.length !== 0) {
            console.log('inside is chat');
            res.send(isChat[0]);
        }
        else {
            var newChat = {
                chatName: 'sender',
                isGroupChat: false,
                users: [userId, receiverId]
            }
            const createChat = await Chat.create(newChat)
            const getNewChat = await Chat.findById(createChat._id).populate('users', '-password')
            res.send(getNewChat)
        }
    } catch (error) {
        res.send(error);
    }



})



router.post('/fetchChats', async (req, res) => {
    const { userId } = req.body;
    // console.log(req.body);
    try {
        const allchats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
            .populate('users', '-password')
            .populate('latestMsg')
            .populate('groupAdmin', '-password')
            .sort({ updatedAt: -1 })
        res.send(allchats)
    } catch (error) {
        res.send(error.message)
    }
})

router.post('/createGroupChat', async (req, res) => {
    const { userId, grpName, grpUsers } = req.body;

    if (!userId || !grpUsers || !grpName)
        return res.status(202).send({ message: "please fill all fields" })

    const users = JSON.parse(grpUsers);
    if (users.length < 2) {
        return res.status(202).send({ message: "Atleast two users are required for group chat" })
    }

    users.push(userId)
    try {
        const Grp = {
            chatName: grpName,
            users: users,
            isGroupChat: true,
            groupAdmin: userId
        }

        const newGrp = await Chat.create(Grp);

        const findNewGrp = await Chat.findOne({ _id: newGrp._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

        res.send(findNewGrp)
    } catch (error) {
        res.status(300).send({ message: error.message })
    }
})


router.put('/renameGroup', async (req, res) => {
    const { grpId, newname } = req.body;
    try {
        const updatedGrp = await Chat.findByIdAndUpdate(grpId, {
            chatName: newname
        }, {
            returnOriginal: false
        })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
        res.send(updatedGrp)
    } catch (error) {
        console.log("error in rename group");
        res.send(error.message)
    }
})

router.post('/deleteGroup', async (req, res) => {
    try {
        const { grpId } = req.body;

        const del = await Chat.deleteOne({ _id: grpId })

        res.send(del);
    } catch (error) {
        console.log(error.message);
    }
})

router.put('/removeFromGrp', async (req, res) => {
    const { rId, grpId } = req.body;

    try {

        const check = await Chat.findById(grpId);
        console.log(check);
        if (check.users.length <= 2) {
            return res.status(201).send({ message: "atleast two user must be present in group" })
        }
        const grp = await Chat.findByIdAndUpdate(grpId, {
            $pull: { users: { $eq: rId } }
        }, {
            returnOriginal: false
        })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
        console.log(grp);
        res.send(grp);
    } catch (error) {
        console.log("error in removefrom group");
        res.send(error.message)
    }

})
router.put('/addToGrp', async (req, res) => {
    const { grpId, AddId } = req.body;

    try {
        const grp = await Chat.findByIdAndUpdate(grpId, {
            $push: { users: AddId }
        }, {
            returnOriginal: false
        })

        res.send(grp);
    } catch (error) {
        console.log("error in addtogrp");
        res.send(error.message);
    }
})



router.get('/searchUsers', async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.query.user._id } });
    res.send(users);
})

router.post('/sendMessage', async (req, res) => {


    const { chatID, userId, content } = req.body;

    if (!chatID || !content || !userId) {
        console.log('data is not given for messages');
    }


    let NewMsg = {
        sender: userId,
        content: content,
        chat: chatID
    }


    try {
        const message = await Message.create(NewMsg);
        console.log('created', message);


        const msg = await Message.findOne({ _id: message._id }).populate('sender').populate('chat').populate({
            path: 'chat',
            populate: {
              path: 'users',
              select: '_id name email profImage'
            }
          }).populate({
            path: 'chat',
            populate: {
              path: 'latestMsg',
            }
          });
        

        

        
         console.log('finded msg',msg);
        // console.log(up);

        // const yes=await Message.findById(message._id)
        // console.log(yes);
        //  message.populate('chat');
        //  console.log(message);
        res.send(msg)
    } catch (error) {
        console.log(error);
    }
})


router.get('/allMessages', async (req, res) => {
    const chatID = req.query.chat;


    try {
        const messages = await Message.find({ chat: chatID }).populate('chat').populate('sender');

        // console.log(messages);
        res.send(messages)
    } catch (error) {
        console.log(error);
    }
})

router.get('/', (req, res) => {
    res.send("Welcome to backend server")
})

module.exports = router