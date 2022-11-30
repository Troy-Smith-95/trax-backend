const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

//Middleware
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
});