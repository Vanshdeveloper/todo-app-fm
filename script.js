document.addEventListener('DOMContentLoaded', () => {
    const taskInputVal = document.getElementById('taskInput');
    const ul = document.getElementById('taskBx');
    const num = document.getElementById('num');
    const clrBtn = document.getElementById('clr-btn');
    const filterAll = document.getElementById('all');
    const filterActive = document.getElementById('active');
    const filterCompleted = document.getElementById('completed');
    const filterButtons = document.querySelectorAll('.filterBtn');
    const themeSwitcher = document.getElementById('theme-switcher');
    const addCir = document.getElementById('add-cir');

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeSwitcher.addEventListener('click', toggleTheme);

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filter = 'all'; // Default filter

    function renderTasks() {
        ul.innerHTML = ''; // Clear the existing list before rendering

        let filteredTasks = tasks.filter(task => {
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        });

        tasks.forEach((task, index) => {
            if (filter === 'active' && task.completed) return;
            if (filter === 'completed' && !task.completed) return;

            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <div class="gr-fi">
                    <label class="cos-chkbx">
                        <input type="checkbox" class="checkbx" ${task.completed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                    <div class="tskTxt" style="text-decoration: ${task.completed ? 'line-through' : 'none'};">${task.text}</div>
                </div>
                <div class="delTskBtn">
                    <img src="images/icon-cross.svg" alt="close_img">
                </div>
            `;
            ul.appendChild(taskItem);

            taskItem.querySelector('.checkbx').addEventListener('change', () => {
                toggleCompleteTask(index);
            });

            taskItem.querySelector('.delTskBtn').addEventListener('click', () => {
                deleteTask(index);
            });
        });
        updateNum(filteredTasks.length);
    }

    function toggleCompleteTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function clearCompTask() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }

    function updateNum() {
        const remainTasks = tasks.filter(task => !task.completed).length;
        num.innerHTML = `${remainTasks} items left`;
    }

    function compNum() {
        const remainTasks = tasks.filter(task => task.completed).length;
        num.innerHTML = `${remainTasks} items left`;
    }

    function addTask() {
        const taskText = taskInputVal.value.trim();
        if (taskText !== '') {
            tasks.push({ text: taskText, completed: false });
            taskInputVal.value = '';
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function setActiveFilter(button) {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    addCir.addEventListener('click', addTask);

    taskInputVal.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    clrBtn.addEventListener('click', clearCompTask);

    filterAll.addEventListener('click', () => {
        filter = 'all';
        setActiveFilter(filterAll);
        renderTasks();
        updateNum() 
    });

    filterActive.addEventListener('click', () => {
        filter = 'active';
        setActiveFilter(filterActive);
        renderTasks();
        updateNum() 
    });

    filterCompleted.addEventListener('click', () => {
        filter = 'completed';
        setActiveFilter(filterCompleted);
        renderTasks();
        compNum()
    });

    renderTasks();

    function toggleTheme() {
        let theme = document.documentElement.getAttribute('data-theme');
        theme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    }

    function updateThemeIcon(theme) {
        const icon = theme === 'light' ? 'images/icon-moon.svg' : 'images/icon-sun.svg';
        themeSwitcher.querySelector('img').src = icon;
    }
});
