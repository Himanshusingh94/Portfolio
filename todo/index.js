$(document).ready(function() {
    const todoList = $("#todo-list");
    const newTodoItemInput = $("#new-todo-item");
    const addTaskBtn = $("#add-task-btn");
    const emptyState = $(".empty-state");
    const clearCompletedBtn = $("#clear-completed-btn");
    const filterButtons = $(".filter-options button");

    let todos = []; // Array to store todo objects

    // --- Helper Functions ---

    // Generate a unique ID for each todo item
    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Save todos to local storage
    function saveTodos() {
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    // Load todos from local storage
    function loadTodos() {
        const storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
            todos = JSON.parse(storedTodos);
        }
        renderTodos();
    }

    // Toggle empty state message visibility
    function toggleEmptyState() {
        if (todos.length === 0) {
            emptyState.show();
        } else {
            emptyState.hide();
        }
    }

    // --- Render Todos ---

    function renderTodos(filter = "all") {
        todoList.empty(); // Clear existing list items

        let filteredTodos = todos;
        if (filter === "active") {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (filter === "completed") {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        if (filteredTodos.length === 0 && todos.length !== 0) {
            // If filtered list is empty but overall list isn't, hide empty state
            emptyState.hide();
        } else {
            toggleEmptyState(); // Otherwise, check based on overall list
        }


        filteredTodos.forEach(todo => {
            const listItem = $(`
                <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <span class="todo-item-text">${todo.text}</span>
                    <div class="todo-item-actions">
                        <button class="edit-btn">✏️</button>
                        <button class="delete-btn">🗑️</button>
                    </div>
                </li>
            `);

            todoList.append(listItem);
        });
        updateClearCompletedButtonVisibility();
    }

    // --- Event Handlers ---

    function addTodo() {
        const todoText = newTodoItemInput.val().trim();

        if (todoText === "") {
            alert("Task cannot be empty!");
            return;
        }

        const newTodo = {
            id: generateUniqueId(),
            text: todoText,
            completed: false
        };

        todos.push(newTodo);
        saveTodos();
        newTodoItemInput.val(""); // Clear input
        renderTodos($(".filter-options button.active").attr("id").replace("show-", "")); // Re-render with current filter
    }

    // Handle checkbox change
    todoList.on("change", ".todo-item input[type='checkbox']", function() {
        const listItem = $(this).closest(".todo-item");
        const todoId = listItem.data("id");
        const isCompleted = $(this).is(":checked");

        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex !== -1) {
            todos[todoIndex].completed = isCompleted;
            saveTodos();
            listItem.toggleClass("completed", isCompleted);
            renderTodos($(".filter-options button.active").attr("id").replace("show-", "")); // Re-render to update view if filter is active/completed
        }
    });

    // Handle edit button click
    todoList.on("click", ".edit-btn", function() {
        const listItem = $(this).closest(".todo-item");
        const todoId = listItem.data("id");
        const todoTextSpan = listItem.find(".todo-item-text");
        const currentText = todoTextSpan.text();

        listItem.addClass("edit-mode");
        listItem.empty(); // Clear content to replace with edit elements

        const editInput = $(`<input type="text" class="edit-input" value="${currentText}">`);
        const saveBtn = $(`<button class="edit-save-btn">Save</button>`);
        const cancelBtn = $(`<button class="edit-cancel-btn">Cancel</button>`);

        listItem.append(editInput, saveBtn, cancelBtn);
        editInput.focus(); // Focus on the input field

        // Save edit
        saveBtn.on("click", function() {
            const newText = editInput.val().trim();
            if (newText === "") {
                alert("Task cannot be empty!");
                return;
            }

            const todoIndex = todos.findIndex(todo => todo.id === todoId);
            if (todoIndex !== -1) {
                todos[todoIndex].text = newText;
                saveTodos();
                renderTodos($(".filter-options button.active").attr("id").replace("show-", "")); // Re-render to update
            }
        });

        // Cancel edit
        cancelBtn.on("click", function() {
            renderTodos($(".filter-options button.active").attr("id").replace("show-", "")); // Re-render to revert
        });

        // Save on Enter key in edit mode
        editInput.keypress(function(event) {
            if (event.key === "Enter") {
                saveBtn.click();
            }
        });
    });

    // Handle delete button click
    todoList.on("click", ".delete-btn", function() {
        const listItem = $(this).closest(".todo-item");
        const todoId = listItem.data("id");

        if (confirm("Are you sure you want to delete this task?")) {
            todos = todos.filter(todo => todo.id !== todoId);
            saveTodos();
            listItem.fadeOut(300, function() {
                $(this).remove();
                toggleEmptyState();
                updateClearCompletedButtonVisibility();
            });
        }
    });

    // Handle "Clear Completed" button click
    clearCompletedBtn.on("click", function() {
        if (confirm("Are you sure you want to clear all completed tasks?")) {
            todos = todos.filter(todo => !todo.completed);
            saveTodos();
            renderTodos($(".filter-options button.active").attr("id").replace("show-", ""));
        }
    });

    // Update visibility of the "Clear Completed" button
    function updateClearCompletedButtonVisibility() {
        const hasCompletedTasks = todos.some(todo => todo.completed);
        if (hasCompletedTasks) {
            clearCompletedBtn.show();
        } else {
            clearCompletedBtn.hide();
        }
    }


    // Handle filter button clicks
    filterButtons.on("click", function() {
        filterButtons.removeClass("active");
        $(this).addClass("active");
        const filterType = $(this).attr("id").replace("show-", "");
        renderTodos(filterType);
    });

    // Add task on button click
    addTaskBtn.on("click", addTodo);

    // Add task on Enter key press in input field
    newTodoItemInput.keypress(function(event) {
        if (event.key === "Enter") {
            addTodo();
        }
    });

    // Initial load
    loadTodos();
});