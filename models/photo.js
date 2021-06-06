const mongoose = require("mongoose");
const Joi = require("joi");

const photoSchema = new mongoose.Schema({
    photoImage: {data: Buffer, contentType: String},
});

const Photo = mongoose.model("Photo", photoSchema);

exports.photoSchema = photoSchema;
exports.Photo = Photo;