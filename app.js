window.onload = function () {
    // Retrieving DOM elements
    let txtbox = document.getElementById("type_task"); // Input field for task text
    let addbtn = document.getElementById("add"); // Button to add a task
    let tasksDiv = document.getElementById("tasks"); // Container for tasks
    let deleteAll = document.querySelector(".delete_all"); // Button to delete all tasks
    let arrayOfTasks = []; // Array to store tasks

    // Loading tasks from local storage, if available
    if (window.localStorage.getItem("tasks")) {
        arrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
        addTaskToPage(arrayOfTasks);
    }

    // Function to enable or disable the Delete All button based on task count
    function updateDeleteAllButton() {
        if (arrayOfTasks.length >= 2) {
            deleteAll.disabled = false; // Enable the button if there are 2 or more tasks
        } else {
            deleteAll.disabled = true; // Disable the button if there are less than 2 tasks
        }
    }

    updateDeleteAllButton(); // Initial check to set the button state

    // Event listener for adding a new task
    addbtn.onclick = function () {
        if (txtbox.value !== "") {
            addTaskToArray(txtbox.value);
            txtbox.value = "";
            updateDeleteAllButton(); // Check after adding a task
        }
    };

    // Function to add a new task to the array
    function addTaskToArray(taskText) {
        const task = {
            id: Date.now(), // Assign a unique ID using Date.now()
            title: taskText,
            completed: false,
        };
        arrayOfTasks.push(task); // Add the new task to the array
        addTaskToPage(arrayOfTasks); // Update the displayed tasks
        addTaskToLocalStorage(arrayOfTasks); // Update tasks in local storage
    }

    // Function to render tasks to the UI
    function addTaskToPage(arrayOfTasks) {
        tasksDiv.innerHTML = ""; // Clear the existing tasks displayed
        arrayOfTasks.forEach((task, index) => {
            let div = document.createElement("div"); // Create a task container
            div.className = "task"; // Set the class for styling

            if (task.completed) {
                div.classList.add("done"); // Add 'done' class for completed tasks
            }

            div.setAttribute("data-id", task.id); // Set the task's ID as a data attribute
            div.appendChild(document.createTextNode(task.title)); // Add task title

            let span = document.createElement("button"); // Create a delete button
            span.className = "del"; // Assign the class for styling
            span.appendChild(document.createTextNode("🗑️")); // Add the delete icon
            div.appendChild(span); // Add the delete button to the task container

            tasksDiv.appendChild(div); // Add the task container to the tasks container
        });
        updateDeleteAllButton(); // Check after updating the tasks
    }

    // Function to update tasks in local storage
    function addTaskToLocalStorage(arrayOfTasks) {
        window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks)); // Update tasks in local storage
    }

    // Event delegation for handling task deletions and marking tasks as completed
    tasksDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains("del")) {
            let taskId = e.target.parentElement.getAttribute("data-id");
            arrayOfTasks = arrayOfTasks.filter(task => task.id != taskId); // Remove the task from the array
            addTaskToPage(arrayOfTasks); // Update the displayed tasks
            addTaskToLocalStorage(arrayOfTasks); // Update tasks in local storage
            updateDeleteAllButton(); // Check after removing a task
        } else if (e.target.classList.contains("task")) {
            let taskId = e.target.getAttribute("data-id");
            arrayOfTasks = arrayOfTasks.map(task => {
                if (task.id == taskId) {
                    task.completed = !task.completed; // Toggle the completion status of the task
                }
                return task;
            });
            addTaskToPage(arrayOfTasks); // Update the displayed tasks
            addTaskToLocalStorage(arrayOfTasks); // Update tasks in local storage
        }
    });

    // Event listener for deleting all tasks
    deleteAll.onclick = function (e) {
        tasksDiv.innerHTML = ""; // Clear the displayed tasks
        arrayOfTasks = []; // Clear the tasks array
        window.localStorage.removeItem("tasks"); // Remove tasks from local storage
        updateDeleteAllButton(); // Check after deleting all tasks
    };
};