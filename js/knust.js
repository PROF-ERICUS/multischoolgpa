// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('popup').style.display = 'flex';

    // Close welcome popup
    window.closePopup = function () {
        document.getElementById('popup').style.display = 'none';
    };

    // Initialize dark mode based on local storage
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    document.getElementById('modeToggle').checked = darkModePreference;
    if (darkModePreference) toggleDarkMode();

    // Add event listener for dark mode toggle
    document.getElementById('modeToggle').addEventListener('change', toggleDarkMode);
});

// Toggle Dark Mode
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    const allInputs = document.querySelectorAll('input');
    const allButtons = document.querySelectorAll('button');
    const allSections = document.querySelectorAll('.semesterSection');

    allInputs.forEach(input => {
        input.classList.toggle('dark-input', isDarkMode);
    });

    allButtons.forEach(btn => {
        btn.classList.toggle('dark-button', isDarkMode);
    });

    allSections.forEach(section => {
        section.classList.toggle('dark-section', isDarkMode);
    });
}

// Grade and point mapping based on KNUST
function getGradeAndPoint(score) {
    if (score >= 70 && score <= 100) return { grade: 'A', point: 4.0 };
    if (score >= 60 && score <= 69) return { grade: 'B', point: 3.0 };
    if (score >= 50 && score <= 59) return { grade: 'C', point: 2.0 };
    if (score >= 40 && score <= 49) return { grade: 'D', point: 1.0 };
    if (score >= 0 && score <= 39) return { grade: 'F', point: 0.0 };
    return { grade: 'Invalid', point: 0.0 };
}

// Add a new course input field within the same semester
function addCourse(button) {
    const courseInputsDiv = button.parentNode;
    const courseRow = courseInputsDiv.querySelector('.courseRow');
    const newRow = courseRow.cloneNode(true);
    newRow.querySelectorAll('input').forEach(input => input.value = '');
    newRow.querySelector('.grade-box').innerText = '';
    courseInputsDiv.insertBefore(newRow, button);
}

// Calculate GPA for the current semester
function calculateSemesterGPA(button) {
    const semesterSection = button.closest('.semesterSection');
    const courseRows = semesterSection.querySelectorAll('.courseRow');
    let totalPoints = 0;
    let totalCredits = 0;

    courseRows.forEach(row => {
        const creditHours = Number(row.querySelector('input[type="number"]:nth-of-type(2)').value);
        const marks = Number(row.querySelector('input[type="number"]:nth-of-type(3)').value);

        const gradePoint = getGradePoint(marks);
        const gradeLetter = getGradeLetter(marks);
        row.querySelector('.grade-box').innerText = gradeLetter;

        totalPoints += gradePoint * creditHours;
        totalCredits += creditHours;
    });

    const semesterGPA = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
    semesterSection.querySelector('.semesterResult').innerHTML = `Semester GPA: ${semesterGPA}`;
}

// Add a new semester section with one course and buttons
function addSemester() {
    const semesterInputs = document.getElementById('semesterInputs');
    const count = semesterInputs.querySelectorAll('.semesterSection').length + 1;

    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semesterSection';
    semesterDiv.innerHTML = `
        <h4>Semester ${count}</h4>
        <div class="courseInputs">
            <div class="courseRow">
                <input type="text" placeholder="Course Name" required>
                <input type="number" placeholder="Credit Hours" min="1" required>
                <input type="number" placeholder="Marks (0–100)" min="0" max="100" required>
                <span class="grade-box"></span>
            </div>
            <button type="button" class="addCourseBtn" onclick="addCourse(this)">+ Add Course</button>
        </div>
        <button type="button" onclick="calculateSemesterGPA(this)">Calculate Semester GPA</button>
        <div class="semesterResult"></div>
    `;
    semesterInputs.appendChild(semesterDiv);
}

// Calculate CGPA across all semesters
function calculateCGPA() {
    const semesterSections = document.querySelectorAll('.semesterSection');
    let totalPoints = 0;
    let totalCredits = 0;

    semesterSections.forEach(section => {
        const courseRows = section.querySelectorAll('.courseRow');
        courseRows.forEach(row => {
            const creditHours = Number(row.querySelector('input[type="number"]:nth-of-type(2)').value);
            const marks = Number(row.querySelector('input[type="number"]:nth-of-type(3)').value);

            const gradePoint = getGradePoint(marks);
            totalPoints += gradePoint * creditHours;
            totalCredits += creditHours;
        });
    });

    const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;
    document.getElementById('cgpaResult').innerHTML = `CGPA: ${cgpa}`;
}

// Reset all form data
function resetForm() {
    document.getElementById('semesterInputs').innerHTML = '';
    document.getElementById('cgpaResult').innerText = '';
    addSemester(); // Start with the first semester
}
