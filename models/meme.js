var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var memeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 32,
            trim: true
        },
        caption: {
            type: String,
            required: true,
            maxlength: 70,
            trim: true
        },
        url: {
            type: String,
            required: true,
            trim: true
        }
    }
);

memeSchema.index({name: 1, caption: 1, url: 1}, {unique: true});

module.exports = mongoose.model("meme", memeSchema);
