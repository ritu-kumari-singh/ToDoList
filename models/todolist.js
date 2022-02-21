const mongoose = require('mongoose');

//Create the Schema
const todoListSchema = new mongoose.Schema({
    description : {
        type : String,
        required : true
    },
    category : {
        type : String
    },
    date : {
        type : String
    }
});

const Todolist = mongoose.model('Todo', todoListSchema);
module.exports = Todolist;