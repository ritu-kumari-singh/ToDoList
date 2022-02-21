const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./config/mongoose');
const todolist = require('./models/todolist');
const port = 8000;

const app = express();

//Access static files
app.use(express.static('assets'));

//Setting up the view engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

//Setting up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Use express router
app.use('/', require('./routes'));

//Handle post request to add a todo list item to database
app.post('/add_task', function(req, res) {
    todolist.create({
        description : req.body.ajax_data.description,
        category : req.body.ajax_data.category,
        date : req.body.ajax_data.date
    }, function(err, newTodo) {
        if(err) {
            console.log("Error in creating a todo list item");
            return;
        }
        return res.redirect(req.get('referer'));
    });    
});

//Handle post request to delete todo list items from database
app.post('/delete_tasks', function(req, res) {
    let task_ids = req.body.ajax_data;
    //If none of the todo list item is checked task_ids array will be undefined
    if(task_ids != undefined) {
        for(let i = 0; i < task_ids.length; i++) {
            todolist.findByIdAndDelete(task_ids[i], function(err) {
                if(err) {
                    console.log("Error deleting task items.");
                    return;
                }
            })
        }
    }
    return res.redirect(req.get('referer'));
});

//Handle post request to update description of a todo list item using it's id
app.post('/update_task', function(req, res) {
    let task_data = req.body.ajax_data;
    todolist.findByIdAndUpdate(task_data.id, { description: task_data.description }, function(err) {
        if(err) {
            console.log("Error updating the list item");
            return;
        }
    })
    return res.redirect(req.get('referer'));
});

app.listen(port, function(err) {
    if(err) {
        console.log(`Error in establishing connection ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
})
