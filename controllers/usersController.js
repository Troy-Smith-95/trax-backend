const express = require("express");
const router = express.Router();
const knex = require("../knexConfig.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {

}

module.exports = {
   registerUser
}