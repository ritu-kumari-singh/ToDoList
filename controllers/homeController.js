const todolist = require('../models/todolist');

module.exports.home = function(req, res) {
    //Fetch all entries from database
    todolist.find({}, function(err, todo_list) {
        if(err) {
            console.log('Error in fetching todo list items');
            return;
        }
        //Send title and todo_list items to be displayed on the page
        return res.render('home', {
            title : "ToDo App",
            todo_list : todo_list
        });
    });
};