const express = require("express");
const knex = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { isEmail, isEmpty, isStrongPassword } = require("validator");


const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate form inputs
    if (
        isEmpty(username) ||
        !isEmail(email) ||
        !isStrongPassword(password)
    ) {
        return res.status(400).json({
            message: "All fields are required."
        })
    }

    try {
        //make sure email is unique
        const userEmail = await knex("users")
            .where({ email: email });

        if (userEmail.length !== 0) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        //make sure username is unique
        const userUsername = await knex("users")
            .where({ username: username });

        if (userUsername.length !== 0) {
            return res.status(400).json({
                message: "Username already exists"
            })
        }

        // Form is valid, save user info to Database
        const newUserIds = await knex("users")
            .insert({
                username: username,
                email: email,
                password: bcrypt.hashSync(password, 10) // hash password
            });

        // Responds with new user (201 Created) and JWT token
        const newUserId = newUserIds[0];

        console.log(process.env.SECRET_KEY);
        console.log(newUserId);
        const token = jwt.sign({ user_id: newUserId }, process.env.SECRET_KEY);

        res.status(201).json({
            message: "User created successfully",
            userId: newUserId,
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message: "Unable to create user",
            error
        })
    }
}

const checkUsername = async (req, res) => {
    const { username } = req.body;

    //make sure username is unique
    const userUsername = await knex("users")
        .where({ username: username });

    if (userUsername.length !== 0) {
        return res.status(400).json({
            message: "Username already exists"
        })
    } else {
        return res.status(200).json({
            message: "Username is unique"
        })
    }
}

module.exports = {
    registerUser,
    checkUsername
}