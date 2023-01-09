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

const loginUser = async (req, res) => {
    // Validate required fields
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Validate user credentials
    const users = await knex("users")
        .where({ email: req.body.email });
    
    if (users.length === 0) {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const user = users[0];

    //check that the password is correct
    if (!bcrypt.compareSync(req.body.password, user.password)) {
        // If invalid: Respond with Invalid Credentials (401)
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }
    
    const token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY);

    return res.status(200).json({
        message: "User logged in successfully",
        token: token
    })
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
    loginUser,
    checkUsername
}