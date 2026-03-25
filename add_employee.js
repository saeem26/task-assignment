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

// Display current employees list
function loadCurrentEmployees() {
    let employees = loadEmployeesFromStorage();
    let list = document.getElementById('currentEmployeeList');
    list.innerHTML = '';

    if (employees.length === 0) {
        list.innerHTML = '<li style="color: #666; font-style: italic;">No employees added yet</li>';
        return;
    }

    employees.forEach((emp) => {
        let li = document.createElement('li');
        let statusClass = emp.status === 'Available' ? 'available' : 'busy';
        
        let employeeInfo = document.createElement('div');
        employeeInfo.className = 'employee-info';
        employeeInfo.innerHTML = `
            ${emp.name}
            <span class="status ${statusClass}">${emp.status}</span>
        `;
        
        li.appendChild(employeeInfo);
        
        if (emp.status === 'Available') {
            let assignButton = document.createElement('button');
            assignButton.textContent = 'Assign Task';
            assignButton.className = 'assign-btn';
            assignButton.onclick = () => selectEmployeeForTask(emp.name);
            li.appendChild(assignButton);
        }
        
        list.appendChild(li);
    });
}

document.getElementById('addEmployeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let employeeName = document.getElementById('employeeName').value.trim();
    let message = document.getElementById('message');
    
    if (employeeName === '') {
        showMessage('Please enter employee name', 'red');
        return;
    }
    
    let employees = loadEmployeesFromStorage();
    
    // Check if employee already exists
    if (employees.find(e => e.name.toLowerCase() === employeeName.toLowerCase())) {
        showMessage('Employee already exists', 'red');
        return;
    }
    
    // Add employee
    employees.push({ name: employeeName, status: 'Available' });
    saveEmployeesToStorage(employees);
    
    showMessage('Employee added successfully!', 'green');
    
    // Clear form
    document.getElementById('employeeName').value = '';
    
    // Refresh employee list
    loadCurrentEmployees();
});

// Function to select employee for task assignment
function selectEmployeeForTask(employeeName) {
    // Store selected employee in localStorage
    localStorage.setItem('selectedEmployee', employeeName);
    // Redirect to add task page
    window.location.href = 'add_task.html';
}

function showMessage(text, color) {
    let message = document.getElementById('message');
    message.textContent = text;
    message.style.color = color;
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

// Load current employees on page load
window.onload = loadCurrentEmployees;