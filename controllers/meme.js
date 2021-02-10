const meme = require("../models/meme");
const {check, validationResult} = require("express-validator")
const isImageUrl = require("is-image-url");


exports.getMemeById = (req, res, next, id) => {
    meme.findById(id).exec((err, meme) => {
        if(err || !meme) {
            return res.status(404).json({
                error: "No Meme Found with this ID"
            })
        }
        req.profile = meme;
        console.log(`meme found by id ${req.profile}`)
        next();
    })
}

exports.getMemes = (req, res) => {
    meme.find().sort({"_id": -1})
    .then((memes) => {
        let len = Math.min(100, memes.length);
        // console.log(len);
        var memeArray = []
        for(i=0; i < len; i++) {
            let memeObj = memes[i]
            let appendMe = {"id": memeObj.id, "name": memeObj.name, "caption": memeObj.caption, "url": memeObj.url}
            memeArray.push(appendMe);
        }
        // console.log(memes);
        res.statusCode = 200;
        res.type('json')
        res.json(memeArray);
        return res;
    }).catch(err => {
        res.json({
            err: err
        })
        return res;
    })
}

exports.postMeme = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if(!isImageUrl(req.body.url)) {
        req.body.url = "default";
    }

    meme.create(req.body)
    .then((response) => {
        console.log(response);
        res.statusCode = 201;
        res.type('json')
        res.json({
            "id": response.id
        });
        return res;
    }).catch(err => {
        res.statusCode = 409
        res.json({
            err: "Duplicate Values Combination"
        })
        return res;
    })
}

exports.getSingleMeme = (req, res) => {
    res.statusCode = 200;
    res.type('json')
    res.json({
        "id": req.profile.id,
        "name": req.profile.name,
        "url": req.profile.url,
        "caption": req.profile.caption
    });
    return res;
}

exports.updateMeme = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("no errors in validation")
      return res.status(400).json({ errors: errors.array() });
    }

    if( !!req.body.url && !isImageUrl(req.body.url)) {
        console.log("url is not image, setting it to default")
        req.body.url = "default";
    }
    
    if(!!req.body.name && req.body.name != req.profile.name) {
        console.log("Name change is not allowed");
        res.statusCode = 400;
        res.json({
            err: "Name change is not allowed"
        })
        return res;
    }

    meme.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, meme) => {
            console.log(".then fn in findByIdAndUpdate is running")
            if(err) {
                console.log("error found in updating the meme");
                return res.status(400).json({
                    error: "Cannot Update Meme due to DB error",
                    message: err
                })
            }
            res.status(200);
            res.json();
        }
    )
}