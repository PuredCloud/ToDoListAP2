let taskDatabase = [
    {
        id: 1,
        title: "Running",
        description: "Morning jog around the neighborhood",
        status: "todo"
    },
    {
        id: 2,
        title: "Making ERD",
        description: "Create entity relationship diagram for database project",
        status: "todo"
    },
    {
        id: 3,
        title: "Cooking for lunch",
        description: "Prepare pasta with vegetables",
        status: "inprogress"
    },
    {
        id: 4,
        title: "Going grocery",
        description: "Buy milk, bread, and fruits from the supermarket",
        status: "done"
    }
];

let taskIdCounter = 5;

function displayTasks() {
    const todoContainer = document.getElementById('todoList');
    const progressContainer = document.getElementById('progressList');
    const completeContainer = document.getElementById('completeList');

    todoContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    completeContainer.innerHTML = '';

    const todoItems = taskDatabase.filter(task => task.status === 'todo');
    const progressItems = taskDatabase.filter(task => task.status === 'inprogress');
    const completeItems = taskDatabase.filter(task => task.status === 'done');

    if (todoItems.length === 0) {
        todoContainer.innerHTML = '<div class="empty-message">No pending tasks</div>';
    } else {
        todoItems.forEach(task => {
            todoContainer.appendChild(buildTaskElement(task));
        });
    }

    if (progressItems.length === 0) {
        progressContainer.innerHTML = '<div class="empty-message">Ready to start working?</div>';
    } else {
        progressItems.forEach(task => {
            progressContainer.appendChild(buildTaskElement(task));
        });
    }

    if (completeItems.length === 0) {
        completeContainer.innerHTML = '<div class="empty-message">Complete some tasks to see them here</div>';
    } else {
        completeItems.forEach(task => {
            completeContainer.appendChild(buildTaskElement(task));
        });
    }

    refreshCounters();
}

function buildTaskElement(task) {
    const taskElement = document.createElement('div');
    let statusClass = '';
    
    switch(task.status) {
        case 'todo': statusClass = 'todo-task'; break;
        case 'inprogress': statusClass = 'progress-task'; break;
        case 'done': statusClass = 'complete-task'; break;
    }
    
    taskElement.className = `task-item ${statusClass}`;
    
    let controlsHTML = `<button class="control-btn edit-control" onclick="modifyTask(${task.id})" title="Edit task">Edit</button>`;
    
    if (task.status === 'todo') {
        controlsHTML += `<button class="control-btn move-control" onclick="progressTask(${task.id})" title="Move to in progress">Start</button>`;
    } else if (task.status === 'inprogress') {
        controlsHTML += `<button class="control-btn move-control" onclick="progressTask(${task.id})" title="Mark as complete">Done</button>`;
    }
    
    controlsHTML += `<button class="control-btn remove-control" onclick="removeTask(${task.id})" title="Delete task">Delete</button>`;
    
    taskElement.innerHTML = `
        <div class="task-header">${task.title}</div>
        <div class="task-body">${task.description}</div>
        <div class="task-controls">
            ${controlsHTML}
        </div>
    `;
    
    return taskElement;
}

function refreshCounters() {
    const todoCount = taskDatabase.filter(task => task.status === 'todo').length;
    const progressCount = taskDatabase.filter(task => task.status === 'inprogress').length;
    const completeCount = taskDatabase.filter(task => task.status === 'done').length;
    const totalTasks = taskDatabase.length;

    document.getElementById('todoCounter').textContent = todoCount;
    document.getElementById('progressCounter').textContent = progressCount;
    document.getElementById('completeCounter').textContent = completeCount;
    document.getElementById('progressIndicator').textContent = `${completeCount}/${totalTasks}`;
}

function createTask() {
    const titleInput = document.getElementById('newTaskTitle');
    const descriptionInput = document.getElementById('newTaskDescription');
    
    const taskTitle = titleInput.value.trim();
    const taskDescription = descriptionInput.value.trim();
    
    if (taskTitle === '') {
        alert('Please enter a task title!');
        return;
    }
    
    const newTask = {
        id: taskIdCounter++,
        title: taskTitle,
        description: taskDescription || 'No additional details provided',
        status: 'todo'
    };
    
    taskDatabase.push(newTask);
    titleInput.value = '';
    descriptionInput.value = '';
    displayTasks();
}

function removeTask(taskId) {
    if (confirm('Are you sure you want to delete this task permanently?')) {
        taskDatabase = taskDatabase.filter(task => task.id !== taskId);
        displayTasks();
    }
}

function progressTask(taskId) {
    const task = taskDatabase.find(task => task.id === taskId);
    if (task) {
        switch(task.status) {
            case 'todo':
                task.status = 'inprogress';
                break;
            case 'inprogress':
                task.status = 'done';
                break;
        }
        displayTasks();
    }
}

function modifyTask(taskId) {
    const task = taskDatabase.find(task => task.id === taskId);
    if (task) {
        const newTitle = prompt('Update task title:', task.title);
        if (newTitle !== null && newTitle.trim() !== '') {
            task.title = newTitle.trim();
            
            const newDescription = prompt('Update task description:', task.description);
            if (newDescription !== null) {
                task.description = newDescription.trim() || 'No additional details provided';
            }
            
            displayTasks();
        }
    }
}

function clearCompletedTasks() {
    const completedCount = taskDatabase.filter(task => task.status === 'done').length;
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    
    if (confirm(`Are you sure you want to clear all ${completedCount} completed tasks?`)) {
        taskDatabase = taskDatabase.filter(task => task.status !== 'done');
        displayTasks();
    }
}

document.getElementById('newTaskTitle').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        createTask();
    }
});

displayTasks();