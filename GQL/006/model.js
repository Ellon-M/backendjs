const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    authorId: Number
})

module.exports = new mongoose.model("books", bookSchema);

