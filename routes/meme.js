const express = require('express');
var router = express.Router();
const {getMemes, postMeme, getMemeById, updateMeme, getSingleMeme} = require("../controllers/meme");
const {check, validationResult} = require("express-validator");


router.param("memeId", getMemeById);

router.get("/memes/:memeId", getSingleMeme);

router.patch("/memes/:memeId", 
[
    check("name", "Max length for name is 32 characters and min is 1").optional().isLength({max: 32, min: 1}),
    check("caption", "Max Length for caption is 70 characters and min is 1").optional().isLength({max: 70, min: 1}),
    check("url", "URL is invalid").optional().isURL()
]
,updateMeme);


router.get("/memes", getMemes);

router.post("/memes", 
[
    check("name", "Max length for name is 32 characters").isLength({max: 32}),
    check("caption", "Max Length for caption is 70 characters").isLength({max: 70}),
    check("url", "URL is invalid").isURL()
],
postMeme);

module.exports = router;