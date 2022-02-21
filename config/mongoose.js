const mongoose = require('mongoose');
//Connect to Database
mongoose.connect('mongodb://localhost/todo_list_db');

//Verify Connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to Database!"));

//Once connection is open
db.once('open', function() {
    console.log('Connection to Database is successfull!');
});