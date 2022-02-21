// Set the minimum date that can be selected to today
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0
var yyyy = today.getFullYear();
if (dd < 10) {
   dd = '0' + dd;
}
if (mm < 10) {
   mm = '0' + mm;
}   
today = yyyy + '-' + mm + '-' + dd;
$('#due_date').attr("min", today);

//Handle click event to add a todo list item
$("#add_task").click(function() {
    //Fetch input values
    let description = $('#todo_content').val(); 
    let category = $('#category').find(":selected").text();
    let date = $('#due_date')[0].valueAsDate;
    if(description == '') {
        //Prompt user to enter a valid description
        alert("Description cannot be empty! Please enter a valid description.");    
    }
    else {
        if(date == null) {
            //If no due date is selected, display NO DEADLINE
            date = "NO DEADLINE";  
        } 
        else {
            //process date to the format : MONTH DATE, YEAR
            date = date.toString().toUpperCase().slice(4,15);   
        }
        let ajax_data = {
            'description' : description,
            'category' : category,
            'date' : date
        }
        //Perform ajax to send user input to server
        $.ajax({
			type : "POST",
			url : '/add_task',
			data : {
                "ajax_data" : ajax_data
            },
			success : function(data){
                //Reload the home page on successful addition of record to database
				location.reload();
			},
			error : function(e){
                //Display error if ajax fails
				console.log(e);
			}
		});
    }
});

//Handle click event to delete selected todo list items
$("#delete_tasks").click(function() {
    //array to store id for each todo list item as per database
    let task_to_delete = [];

    //Iterate through all checkbox list items
    $("input:checkbox").each(function(){
        var $this = $(this);
        //Push the todo list item id to array whose checkbox is checked
        if($this.is(":checked")){
            task_to_delete.push($this.attr("name"));
        }
    });
    let ajax_data = task_to_delete;

    //Perform ajax to send ids of selected todo list item to server to perform deletion 
    $.ajax({
        type : "POST",
        url : '/delete_tasks',
        data : {
            "ajax_data" : ajax_data
        },
        success : function(data){
            //Reload home page on successful deletion
            location.reload();
        },
        error : function(e){
            //Display error if ajax fails
            console.log(e);
        }
    });
});

//Handle check and uncheck events for checkboxes containing todo list items
$('input:checkbox').change(function() {
    //If a checkbox is checked, disable input fields, Add Task button and Edit Task button.
    if(this.checked) {
        //Enable Delete Task button
        $('#delete_tasks').prop('disabled',false);
        $(this).parent().css('text-decoration','line-through');
        $("#add_task, #todo_content, #category, #due_date").prop('disabled',true);
        $("#add_task").css('background-color','grey');
        $('li.flex_row i.fa-edit').hide();
    }
    else {
        //If none of the todo list item checkboxes are checked, disable Delete Task button. Enable remaining options
        //such as(Add Task, user input fields and Edit Task button)
        if($("input:checkbox:checked").length == 0) {
            $('#delete_tasks').prop('disabled',true);
            $("#add_task, #todo_content, #category, #due_date").prop('disabled',false);
            $("#add_task").css('background-color','#4a544a');
            $('li.flex_row i.fa-edit').show();
        }  
        //Remove strike-through for the todo list item that is unchecked
        $(this).parent().css('text-decoration','none');
    }        
});

//Handle click event to edit todo list item description
$("li.flex_row i.fa-edit").click(function() {
    //fetch id and current description for the todo list item to be edited
    let $this = $(this).attr("name");
    let title = $(this).parent().find('label').text();

    //Set the descritpion input field value to the current description and disable other inputs for user
    $("#todo_content").attr("value", title);  
    $("#category, #due_date, input:checkbox").prop('disabled', true);
    $(".custom_button").hide();

    //Set update button's attribute to id of todo list item, to be used while sending request to server
    $('#update').attr("name",$this);
    $("#update, #cancel").css("display","block");
});

//Handle click event to update todo list item's description
$("#update").click(function() { 
    let description = $('#todo_content').val();
    if(description == '') {
        alert("Description cannot be empty! Please enter a valid description.");
    }
    else {
        let ajax_data = {
            'id' :  $(this).attr("name"),
            'description' : description
        }
        //Perform ajax to send id and description of todo list item to server to perform updation
        $.ajax({
			type : "POST",
			url : '/update_task',
			data : {
                "ajax_data" : ajax_data
            },
			success : function(data){
                //Reload home page on successful update
				location.reload();
			},
			error : function(e){
                //Display error if ajax fails
				console.log(e);
			}
		});
    }
});
//If update is cancelled, reload home page to reset elements to their original state
$("#cancel").click(function() {
    location.reload()
});
