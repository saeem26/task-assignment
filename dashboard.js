let employees = loadEmployeesFromStorage();
let tasks = loadTasksFromStorage();

// Load employees from localStorage
function loadEmployeesFromStorage() {
    let stored = localStorage.getItem('employees');
    return stored ? JSON.parse(stored) : [];
}

// Save employees to localStorage
function saveEmployeesToStorage(employees) {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Load tasks from localStorage
function loadTasksFromStorage() {
    let stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
}

// Save tasks to localStorage
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Show employees
function loadEmployees() {
    let list = document.getElementById("employeeList");
    list.innerHTML = "";

    employees.forEach((emp, index) => {
        let li = document.createElement("li");

        let statusClass = emp.status === "Available" ? "available" : "busy";

        li.innerHTML = `
            ${emp.name}
            <div style="display: flex; gap: 5px;">
                <span class="status ${statusClass}">${emp.status}</span>
                <button onclick="removeEmployeeFromList(${index})" class="remove-btn">Remove</button>
            </div>
        `;

        list.appendChild(li);
    });
}

// Show tasks
function loadTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.className = "task-item";
        li.innerHTML = `
            ${task.description} (Assigned to: ${task.employee})
            <button onclick="completeTask(${index})" style="margin-left: 10px; background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Complete</button>
        `;
        list.appendChild(li);
    });
}

// Show task assignments
function loadAssignments() {
    let list = document.getElementById("assignmentList");
    list.innerHTML = "";

    if (tasks.length === 0) {
        list.innerHTML = '<li style="color: #666; font-style: italic;">No tasks assigned yet</li>';
        return;
    }

    // Group tasks by employee
    let assignments = {};
    tasks.forEach(task => {
        if (!assignments[task.employee]) {
            assignments[task.employee] = [];
        }
        assignments[task.employee].push(task.description);
    });

    // Display assignments
    Object.keys(assignments).forEach(employee => {
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>${employee}</strong>: ${assignments[employee].join(", ")}
        `;
        list.appendChild(li);
    });
}

function completeTask(index) {
    let task = tasks[index];
    let employee = employees.find(e => e.name === task.employee);

    if (employee) {
        employee.status = "Available";
    }

    tasks.splice(index, 1);

    saveEmployeesToStorage(employees);
    saveTasksToStorage(tasks);
    loadEmployees();
    loadTasks();
    loadAssignments();

    showEmployeeMessage("Task completed!", "green");
}

// Remove employee
function removeEmployee() {
    let select = document.getElementById("removeEmployeeSelect");
    let employeeName = select.value.trim();

    if (employeeName === "") {
        showEmployeeMessage("Please select an employee to remove", "red");
        return;
    }

    // Find employee to remove
    let empIndex = employees.findIndex(e => e.name.toLowerCase() === employeeName.toLowerCase());

    if (empIndex === -1) {
        showEmployeeMessage("Employee not found", "red");
        return;
    }

    // Check if employee has tasks
    if (tasks.find(t => t.employee === employees[empIndex].name)) {
        showEmployeeMessage("Cannot remove employee with pending tasks", "red");
        return;
    }

    // Remove employee
    employees.splice(empIndex, 1);
    saveEmployeesToStorage(employees);
    loadEmployees();
    loadAssignments();
    updateEmployeeDatalist();
    updateRemoveEmployeeSelect();
    select.value = "";
    showEmployeeMessage("Employee removed successfully!", "green");
}

// Remove employee from list
function removeEmployeeFromList(index) {
    let emp = employees[index];
    
    // Check if employee has tasks
    if (tasks.find(t => t.employee === emp.name)) {
        showEmployeeMessage("Cannot remove employee with pending tasks", "red");
        return;
    }

    employees.splice(index, 1);
    saveEmployeesToStorage(employees);
    loadEmployees();
    loadAssignments();
    updateRemoveEmployeeSelect();
    showEmployeeMessage("Employee removed successfully!", "green");
}

// Update select dropdown with current employees
function updateRemoveEmployeeSelect() {
    let select = document.getElementById("removeEmployeeSelect");
    let currentValue = select.value;
    select.innerHTML = '<option value="">Select employee to remove</option>';

    employees.forEach(emp => {
        let option = document.createElement("option");
        option.value = emp.name;
        option.textContent = emp.name;
        select.appendChild(option);
    });

    select.value = currentValue;
}

// Show employee management message
function showEmployeeMessage(text, color) {
    let message = document.getElementById("employeeMessage");
    message.textContent = text;
    message.style.color = color;
    message.style.display = "block";
    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}

// Load on page load
window.onload = function() {
    loadEmployees();
    loadTasks();
    loadAssignments();
    updateRemoveEmployeeSelect();
};
