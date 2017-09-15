/*
 |--------------------------------------
 | List Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
    title: { type: String, required: true },
    Datetime: { type: Date, required: true },
    viewPublic: { type: Boolean, required: true },
    description: String,
});

module.exports = mongoose.model('List', listSchema);