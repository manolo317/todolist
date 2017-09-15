/*
 |--------------------------------------
 | TodoItem Model
 |--------------------------------------
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    listId: { type: String, required: true },
    done: { type: Boolean, required: true },
    comments: String
});

module.exports = mongoose.model('Todo', todoSchema);