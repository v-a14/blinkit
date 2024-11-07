const express = require("express")
const jwt = require("jsonwebtoken")

require("dotenv").config()
async function validateAdmin(req, res, next){
    try{
        const token = req.cookies.token
        if(!token) res.send("you need to the login first")
        const data = await jwt.verify(token, process.env.JWT_KEY)
        req.user = data
    }catch(err){
        res.send(err.message)
    }
    next()

}

module.exports = validateAdmin