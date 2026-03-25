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

// Populate datalist with employees
function populateEmployees() {
    let employees = loadEmployeesFromStorage();
    let datalist = document.getElementById('employees');
    datalist.innerHTML = '';

    employees.forEach(emp => {
        let option = document.createElement('option');
        option.value = emp.name;
        datalist.appendChild(option);
    });
}

// Display employee availability
function displayEmployeeAvailability() {
    let employees = loadEmployeesFromStorage();
    let list = document.getElementById('employeeAvailabilityList');
    list.innerHTML = '';

    if (employees.length === 0) {
        list.innerHTML = '<li style="color: #666; font-style: italic;">No employees added yet</li>';
        return;
    }

    employees.forEach((emp) => {
        let li = document.createElement('li');
        let statusClass = emp.status === 'Available' ? 'available' : 'busy';
        li.innerHTML = `
            ${emp.name}
            <span class="status ${statusClass}">${emp.status}</span>
        `;
        list.appendChild(li);
    });
}

document.getElementById('addTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let taskDescription = document.getElementById('taskDescription').value.trim();
    let employeeName = document.getElementById('employeeName').value.trim();
    
    if (taskDescription === '' || employeeName === '') {
        showMessage('Please fill all fields', 'red');
        return;
    }
    
    let employees = loadEmployeesFromStorage();
    let tasks = loadTasksFromStorage();
    
    let employee = employees.find(e => e.name.toLowerCase() === employeeName.toLowerCase());
    
    if (!employee) {
        showMessage('Employee not found', 'red');
        return;
    }
    
    if (employee.status === 'Busy') {
        showMessage('Employee is already busy', 'red');
        return;
    }
    
    // Add task
    tasks.push({ description: taskDescription, employee: employee.name, completed: false });
    
    // Update employee status
    employee.status = 'Busy';
    
    saveEmployeesToStorage(employees);
    saveTasksToStorage(tasks);
    
    showMessage('Task added successfully!', 'green');
    
    // Clear form
    document.getElementById('taskDescription').value = '';
    document.getElementById('employeeName').value = '';
    
    // Refresh employee availability display
    displayEmployeeAvailability();
});

function showMessage(text, color) {
    let message = document.getElementById('message');
    message.textContent = text;
    message.style.color = color;
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

// Load employees on page load
window.onload = function() {
    populateEmployees();
    displayEmployeeAvailability();
    
    // Check if there's a selected employee from add_employee page
    let selectedEmployee = localStorage.getItem('selectedEmployee');
    if (selectedEmployee) {
        document.getElementById('employeeName').value = selectedEmployee;
        // Clear the stored selection
        localStorage.removeItem('selectedEmployee');
    }
};