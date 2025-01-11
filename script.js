document.addEventListener('DOMContentLoaded', function() {
    const targetDate = new Date('2025-01-05T00:00:00');
    const timerElement = document.getElementById('timer');

    function updateTimer() {
        const currentDate = new Date();
        const timeDifference = targetDate - currentDate;

        const totalDaysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        const monthsLeft = Math.floor(totalDaysLeft / 30); // Approximate months
        const daysLeft = totalDaysLeft % 30;

        timerElement.innerHTML = `${monthsLeft} MONTHS ${daysLeft} DAYS LEFT FOR JEE MAINS 2025`;
    }

    setInterval(updateTimer, 1000); // Update the timer every second
    updateTimer(); // Initial call to display the timer immediately

    const smwButtons = document.getElementById('smwButtons');
    const chemistrySmwButtons = document.getElementById('chemistrySmwButtons');
    const physicsSmwContent = document.getElementById('physicsSmwContent');
    const mathsSmwContent = document.getElementById('mathsSmwContent');
    const pciocSmwContent = document.getElementById('pciocSmwContent');
    const ocSmwContent = document.getElementById('ocSmwContent');

    const physicsSmwButton = document.getElementById('physicsSmwButton');
    const chemistrySmwButton = document.getElementById('chemistrySmwButton');
    const mathsSmwButton = document.getElementById('mathsSmwButton');
    const pciocSmwButton = document.getElementById('pciocSmwButton');
    const ocSmwButton = document.getElementById('ocSmwButton');

    const backPhysicsButton = document.getElementById('backPhysicsButton');
    const backMathsButton = document.getElementById('backMathsButton');
    const backChemistryButton = document.getElementById('backChemistryButton');
    const backPciocButton = document.getElementById('backPciocButton');
    const backOcButton = document.getElementById('backOcButton');

    physicsSmwButton.addEventListener('click', () => {
        smwButtons.classList.add('hidden');
        physicsSmwContent.classList.remove('hidden');
        loadSavedChapters('physics');
    });

    chemistrySmwButton.addEventListener('click', () => {
        smwButtons.classList.add('hidden');
        chemistrySmwButtons.classList.remove('hidden');
    });

    mathsSmwButton.addEventListener('click', () => {
        smwButtons.classList.add('hidden');
        mathsSmwContent.classList.remove('hidden');
        loadSavedChapters('maths');
    });

    pciocSmwButton.addEventListener('click', () => {
        chemistrySmwButtons.classList.add('hidden');
        pciocSmwContent.classList.remove('hidden');
        loadSavedChapters('pcioc');
    });

    ocSmwButton.addEventListener('click', () => {
        chemistrySmwButtons.classList.add('hidden');
        ocSmwContent.classList.remove('hidden');
        loadSavedChapters('oc');
    });

    backPhysicsButton.addEventListener('click', () => {
        physicsSmwContent.classList.add('hidden');
        smwButtons.classList.remove('hidden');
    });

    backMathsButton.addEventListener('click', () => {
        mathsSmwContent.classList.add('hidden');
        smwButtons.classList.remove('hidden');
    });

    backChemistryButton.addEventListener('click', () => {
        chemistrySmwButtons.classList.add('hidden');
        smwButtons.classList.remove('hidden');
    });

    backPciocButton.addEventListener('click', () => {
        pciocSmwContent.classList.add('hidden');
        chemistrySmwButtons.classList.remove('hidden');
    });

    backOcButton.addEventListener('click', () => {
        ocSmwContent.classList.add('hidden');
        chemistrySmwButtons.classList.remove('hidden');
    });

    const chapterDropdownContainer = document.getElementById('chapterDropdownContainer');
    const chapterDropdown = document.getElementById('chapterDropdown');
    const addSelectedChaptersButton = document.getElementById('addSelectedChaptersButton');
    const closeDropdownButton = document.getElementById('closeDropdownButton');

    let currentSubject = '';
    let currentStrength = '';

    const addChapterButtons = {
        physics: {
            strong: document.getElementById('addStrongPhysics'),
            medium: document.getElementById('addMediumPhysics'),
            weak: document.getElementById('addWeakPhysics'),
        },
        maths: {
            strong: document.getElementById('addStrongMaths'),
            medium: document.getElementById('addMediumMaths'),
            weak: document.getElementById('addWeakMaths'),
        },
        pcioc: {
            strong: document.getElementById('addStrongPcioc'),
            medium: document.getElementById('addMediumPcioc'),
            weak: document.getElementById('addWeakPcioc'),
        },
        oc: {
            strong: document.getElementById('addStrongOc'),
            medium: document.getElementById('addMediumOc'),
            weak: document.getElementById('addWeakOc'),
        }
    };

    async function loadChapters(subject) {
        const response = await fetch(`jee${subject}.txt`);
        const data = await response.text();
        return data.split('\n').filter(line => line.trim());
    }

    async function showChapterDropdown(subject, strength) {
        currentSubject = subject;
        currentStrength = strength;
        const chapters = await loadChapters(subject);

        chapterDropdown.innerHTML = '';
        chapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter;
            option.text = chapter;
            chapterDropdown.appendChild(option);
        });

        chapterDropdownContainer.classList.remove('hidden');
    }

    Object.keys(addChapterButtons).forEach(subject => {
        Object.keys(addChapterButtons[subject]).forEach(strength => {
            addChapterButtons[subject][strength].addEventListener('click', () => showChapterDropdown(subject, strength));
        });
    });

    addSelectedChaptersButton.addEventListener('click', () => {
        const selectedChapters = Array.from(chapterDropdown.selectedOptions).map(option => option.value);
        const tableBody = document.getElementById(`${currentSubject}SmwTableBody`);

        // Prepare the column indices
        const columnIndices = {
            strong: 0,
            medium: 1,
            weak: 2
        };

        selectedChapters.forEach(chapter => {
            const columnIndex = columnIndices[currentStrength];

            let rowInserted = false;
            const rows = Array.from(tableBody.rows);

            // Find the first row where the target cell is empty
            for (let row of rows) {
                const cell = row.cells[columnIndex];
                if (cell && cell.innerHTML.trim() === '') {
                    cell.innerHTML = `${chapter.trim()} <button class="delete-cross">&times;</button>`;
                    rowInserted = true;
                    break;
                }
            }

            // If no empty cell was found, create a new row
            if (!rowInserted) {
                const newRow = document.createElement('tr');
                for (let i = 0; i < 3; i++) {
                    const cell = document.createElement('td');
                    if (i === columnIndex) {
                        cell.classList.add('chapter-cell');
                        cell.innerHTML = `${chapter.trim()} <button class="delete-cross">&times;</button>`;
                    } else {
                        cell.classList.add('chapter-cell');
                        cell.innerHTML = ''; // Empty cell
                    }
                    newRow.appendChild(cell);
                }
                tableBody.appendChild(newRow);
            }
        });

        chapterDropdownContainer.classList.add('hidden');
    });

    closeDropdownButton.addEventListener('click', () => {
        chapterDropdownContainer.classList.add('hidden');
    });

    function getColumnIndex(strength) {
        if (strength === 'strong') return 0;
        if (strength === 'medium') return 1;
        if (strength === 'weak') return 2;
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-cross')) {
            const cell = event.target.closest('td');
            cell.innerHTML = '';
        } else {
            document.querySelectorAll('.delete-cross').forEach(cross => cross.style.display = 'none');
        }
    });

    document.body.addEventListener('click', function(event) {
        if (event.target.closest('.chapter-cell')) {
            const deleteCross = event.target.closest('.chapter-cell').querySelector('.delete-cross');
            if (deleteCross) {
                deleteCross.style.display = 'inline';
            }
        }
    });

    function saveChapters(subject) {
        const tableBody = document.getElementById(`${subject}SmwTableBody`);
        const rows = tableBody.querySelectorAll('tr');
        const savedChapters = {
            strong: [],
            medium: [],
            weak: []
        };

        rows.forEach(row => {
            if (row.children[0].textContent.trim()) savedChapters.strong.push(row.children[0].textContent.trim().replace(' ×', ''));
            if (row.children[1].textContent.trim()) savedChapters.medium.push(row.children[1].textContent.trim().replace(' ×', ''));
            if (row.children[2].textContent.trim()) savedChapters.weak.push(row.children[2].textContent.trim().replace(' ×', ''));
        });

        localStorage.setItem(`${subject}SmwChapters`, JSON.stringify(savedChapters));
        alert('Chapters saved successfully!');
    }

    function loadSavedChapters(subject) {
        const savedChapters = JSON.parse(localStorage.getItem(`${subject}SmwChapters`)) || { strong: [], medium: [], weak: [] };
        const tableBody = document.getElementById(`${subject}SmwTableBody`);
        tableBody.innerHTML = '';

        const maxRows = Math.max(savedChapters.strong.length, savedChapters.medium.length, savedChapters.weak.length);
        for (let i = 0; i < maxRows; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="chapter-cell">${savedChapters.strong[i] ? savedChapters.strong[i] + ' <button class="delete-cross">&times;</button>' : ''}</td>
                <td class="chapter-cell">${savedChapters.medium[i] ? savedChapters.medium[i] + ' <button class="delete-cross">&times;</button>' : ''}</td>
                <td class="chapter-cell">${savedChapters.weak[i] ? savedChapters.weak[i] + ' <button class="delete-cross">&times;</button>' : ''}</td>
            `;
            tableBody.appendChild(row);
        }
    }

    document.getElementById('savePhysicsSmwButton').addEventListener('click', () => saveChapters('physics'));
    document.getElementById('saveMathsSmwButton').addEventListener('click', () => saveChapters('maths'));
    document.getElementById('savePciocSmwButton').addEventListener('click', () => saveChapters('pcioc'));
    document.getElementById('saveOcSmwButton').addEventListener('click', () => saveChapters('oc'));
});





//HAMBURGER
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-1');
    const navContainer = document.getElementById('navContainer');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('is-active');
        navContainer.classList.toggle('hidden');
        hamburger.title = hamburger.classList.contains('is-active') ? 'Close Menu' : 'Open Menu';
    });
});

document.addEventListener('click', function(event) {
    const navContainer = document.getElementById('navContainer');
    const hamburger = document.getElementById('hamburger-1');
    if (!navContainer.contains(event.target) && !hamburger.contains(event.target)) {
        navContainer.classList.add('hidden');
        hamburger.classList.remove('is-active');
    }
});

//CHAPTERS

document.addEventListener('DOMContentLoaded', function() {
    const fetchButton = document.getElementById('fetchButton');
    const subjectDropdown = document.getElementById('subjectDropdown');
    const syllabusContent = document.getElementById('syllabusContent');
    const progressContent = document.getElementById('progressContent');
    const subjectHeading = document.getElementById('subjectHeading');
    const syllabusTableBody = document.getElementById('syllabusTable').querySelector('tbody');
    const saveButton = document.getElementById('saveButton');
    const fetchingModal = document.getElementById('fetchingModal');

    fetchButton.addEventListener('click', async () => {
        const subject = subjectDropdown.value;
        if (!subject) return alert('Please choose a option');

        showFetchingModal();

        subjectHeading.textContent = `${subject.charAt(0).toUpperCase() + subject.slice(1)} Syllabus`;

        syllabusTableBody.innerHTML = '';
        syllabusContent.classList.add('hidden');
        progressContent.classList.add('hidden');

        if (subject === 'progress') {
            await loadProgress();
            progressContent.classList.remove('hidden');
        } else {
            await loadSyllabus(subject);
            syllabusContent.classList.remove('hidden');
        }

        hideFetchingModal();
    });

    function showFetchingModal() {
        fetchingModal.classList.remove('hidden');
    }

    function hideFetchingModal() {
        fetchingModal.classList.add('hidden');
    }

    async function loadSyllabus(subject) {
        const response = await fetch(`jee${subject}.txt`);
        const data = await response.text();
        const chapters = data.split('\n').filter(line => line.trim());

        chapters.forEach((chapter, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${chapter.trim()}</td>
                <td><input type="checkbox" data-chapter="${chapter.trim()}"></td>
            `;
            syllabusTableBody.appendChild(row);
        });

        loadSavedData(subject);
    }

    async function loadProgress() {
        const subjects = ['physics', 'chemistry', 'maths'];
        const progressTableBody = document.getElementById('progressTable').querySelector('tbody');
        progressTableBody.innerHTML = '';

        let totalChapters = 0;
        let totalDoneChapters = 0;

        for (const subject of subjects) {
            const response = await fetch(`jee${subject}.txt`);
            const data = await response.text();
            const chapters = data.split('\n').filter(line => line.trim());

            let doneChapters = 0;

            chapters.forEach(chapter => {
                const cleanedChapter = chapter.trim();
                const done = loadChapterDoneStatus(subject, cleanedChapter);
                if (done) doneChapters++;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${subject.charAt(0).toUpperCase() + subject.slice(1)}</td>
                    <td>${cleanedChapter}</td>
                    <td>${done ? '<span style="color: green;">Done</span>' : '<span style="color: red;">Not Done</span>'}</td>
                `;
                progressTableBody.appendChild(row);
            });

            const progress = (doneChapters / chapters.length) * 100;
            document.getElementById(`${subject}Progress`).querySelector('.progress-bar-fill').style.width = `${progress}%`;
            document.getElementById(`${subject}Progress`).querySelector('span').innerHTML = `${subject.charAt(0).toUpperCase() + subject.slice(1)}: ${Math.round(progress)}% [Done: ${doneChapters} ; Not Done: ${chapters.length - doneChapters}]`;

            totalChapters += chapters.length;
            totalDoneChapters += doneChapters;
        }

        const totalProgress = (totalDoneChapters / totalChapters) * 100;
        document.getElementById('totalProgress').querySelector('.progress-bar-fill').style.width = `${totalProgress}%`;
        document.getElementById('totalProgress').querySelector('span').textContent = `PCM: ${Math.round(totalProgress)}%`;
    }

    function loadSavedData(subject) {
        const savedData = JSON.parse(localStorage.getItem(`jee${subject}Data`)) || {};
        document.querySelectorAll(`#syllabusTable tbody tr`).forEach(row => {
            const chapter = row.querySelector('td:nth-child(2)').textContent.trim();
            if (savedData[chapter]) {
                row.querySelector('input[type="checkbox"]').checked = savedData[chapter];
            }
        });
    }

    function loadChapterDoneStatus(subject, chapter) {
        const savedData = JSON.parse(localStorage.getItem(`jee${subject}Data`)) || {};
        return !!savedData[chapter];
    }

    saveButton.addEventListener('click', () => {
        const subject = subjectDropdown.value;
        const rows = syllabusTableBody.querySelectorAll('tr');
        const data = Array.from(rows).reduce((acc, row) => {
            const chapter = row.querySelector('td:nth-child(2)').textContent.trim();
            const done = row.querySelector('input[type="checkbox"]').checked;
            acc[chapter] = done;
            return acc;
        }, {});
        localStorage.setItem(`jee${subject}Data`, JSON.stringify(data));
        console.log(`Saved data for ${subject}:`, data);  // Debugging log
        alert('Data saved successfully!');
    });
});








// Define constants for DOM elements
const praveenButton = document.getElementById('praveenButton');
const ontrakButton = document.getElementById('ontrakButton');
const praveenButtons = document.getElementById('praveenButtons');
const ontrakButtons = document.getElementById('ontrakButtons');
const backButton1 = document.getElementById('backButton1');
const backButton2 = document.getElementById('backButton2');
const backButton3 = document.getElementById('backButton3');
const backButton4 = document.getElementById('backButton4');
const backButton5 = document.getElementById('backButton5');
const mainButtons = document.getElementById('mainButtons');
const physicsNLButton = document.getElementById('physicsNLButton');
const chemistryNLButton = document.getElementById('chemistryNLButton');
const chemistryFLButton = document.getElementById('chemistryFLButton');
const chemistryNLButtons = document.getElementById('chemistryNLButtons');
const chemistryFLButtons = document.getElementById('chemistryFLButtons');
const physicsNLContent = document.getElementById('physicsNLContent');
const saveButton = document.getElementById('saveButton');
const topicTableBody = document.querySelector('tbody');

// List of topics
const topics = [
    { name: "Projectile Motion", lectures: 4, homework: 4 },
    { name: "Relative Motion", lectures: 6, homework: 6 },
    { name: "Geometrical Optics", lectures: 19, homework: 19 },
    { name: "NLM", lectures: 11, homework: 11 },
    { name: "Friction", lectures: 6, homework: 6 },
    { name: "Work Power Energy", lectures: 7, homework: 7 },
    { name: "Circular Motion", lectures: 8, homework: 8 },
    { name: "Center of Mass", lectures: 10, homework: 10 },
    { name: "Rotation", lectures: 12, homework: 12 },
    { name: "SHM", lectures: 7, homework: 7 },
    { name: "Electrostaticas", lectures: 19, homework: 19 },
    { name: "Gravitation", lectures: 5, homework: 5 },
    { name: "Current", lectures: 11, homework: 11 },
    { name: "HEAT", lectures: 2, homework: 2 },
    { name: "Capacitance", lectures: 9, homework: 9 },
    { name: "EMF", lectures: 16, homework: 16 },
    { name: "EMI", lectures: 9, homework: 9 },
    { name: "AC", lectures: 4, homework: 4 },
    { name: "EMW", lectures: 1, homework: 1 },
    { name: "Modern Physics-1", lectures: 9, homework: 9 },
    { name: "Modern Physics-2", lectures: 5, homework: 5 },
    { name: "KTG, THERMO", lectures: 8, homework: 8 },
    { name: "FLUIDS", lectures: 8, homework: 8 },
    { name: "Elasticity & Viscocity", lectures: 5, homework: 5 },
    { name: "Surface Tension", lectures: 3, homework: 3 },
    { name: "Calorimetry", lectures: 4, homework: 4 },
    { name: "Wave On String", lectures: 8, homework: 8 },
    { name: "Sound", lectures: 4, homework: 4 },
    { name: "Wave Optics", lectures: 5, homework: 5 },
    { name: "Semiconductor", lectures: 4, homework: 4 },
    { name: "ERROR", lectures: 5, homework: 5 }
];

// Function to create table row
function createTableRow(index, topic) {
    const row = document.createElement('tr');

    const slNoCell = document.createElement('td');
    slNoCell.textContent = index + 2;
    row.appendChild(slNoCell);

    const topicCell = document.createElement('td');
    topicCell.textContent = topic.name;
    row.appendChild(topicCell);

    const lectureCell = document.createElement('td');
    for (let i = 1; i <= topic.lectures; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        lectureCell.appendChild(checkbox);
        lectureCell.appendChild(document.createTextNode(i));
        lectureCell.appendChild(document.createElement('br'));
    }
    row.appendChild(lectureCell);

    const homeworkCell = document.createElement('td');
    for (let i = 1; i <= topic.homework; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        homeworkCell.appendChild(checkbox);
        homeworkCell.appendChild(document.createTextNode(i));
        homeworkCell.appendChild(document.createElement('br'));
    }
    row.appendChild(homeworkCell);

    const revisionCell = document.createElement('td');
    for (let i = 1; i <= 3; i++) {
        const label = document.createTextNode(`Rev ${i}: `);
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        revisionCell.appendChild(label);
        revisionCell.appendChild(dateInput);
        revisionCell.appendChild(document.createElement('br'));
    }
    row.appendChild(revisionCell);

    return row;
}

// Add topics to the table
topics.forEach((topic, index) => {
    const row = createTableRow(index, topic);
    topicTableBody.appendChild(row);
});

// Event listeners
praveenButton.addEventListener('click', () => {
    mainButtons.classList.add('hidden');
    praveenButtons.classList.remove('hidden');
});

ontrakButton.addEventListener('click', () => {
    mainButtons.classList.add('hidden');
    ontrakButtons.classList.remove('hidden');
});

backButton1.addEventListener('click', () => {
    praveenButtons.classList.add('hidden');
    mainButtons.classList.remove('hidden');
});

backButton2.addEventListener('click', () => {
    ontrakButtons.classList.add('hidden');
    mainButtons.classList.remove('hidden');
});

physicsNLButton.addEventListener('click', () => {
    praveenButtons.classList.add('hidden');
    physicsNLContent.classList.remove('hidden');
    loadSavedData();
});

backButton3.addEventListener('click', () => {
    physicsNLContent.classList.add('hidden');
    praveenButtons.classList.remove('hidden');
});

chemistryNLButton.addEventListener('click', () => {
    praveenButtons.classList.add('hidden');
    chemistryNLButtons.classList.remove('hidden');
});

chemistryFLButton.addEventListener('click', () => {
    ontrakButtons.classList.add('hidden');
    chemistryFLButtons.classList.remove('hidden');
});

backButton4.addEventListener('click', () => {
    chemistryNLButtons.classList.add('hidden');
    praveenButtons.classList.remove('hidden');
});

backButton5.addEventListener('click', () => {
    chemistryFLButtons.classList.add('hidden');
    ontrakButtons.classList.remove('hidden');
});

// Save data to localStorage
saveButton.addEventListener('click', () => {
    try {
        const rows = topicTableBody.querySelectorAll('tr');
        const data = Array.from(rows).map(row => {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            const dates = row.querySelectorAll('input[type="date"]');
            return {
                lectures: Array.from(checkboxes).map(cb => cb.checked),
                revisions: Array.from(dates).map(dateInput => dateInput.value)
            };
        });
        localStorage.setItem('physicsNLData', JSON.stringify(data));
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
    }
});

// Load saved data from localStorage
function loadSavedData() {
    const data = JSON.parse(localStorage.getItem('physicsNLData')) || [];
    const rows = topicTableBody.querySelectorAll('tr');
    data.forEach((item, index) => {
        const row = rows[index];
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        const dates = row.querySelectorAll('input[type="date"]');
        item.lectures.forEach((checked, i) => checkboxes[i].checked = checked);
        item.revisions.forEach((date, i) => dates[i].value = date);
    });
}


// MATHS NORMAL LANE

// Define constants for new DOM elements
const mathsNLButton = document.getElementById('mathsNLButton');
const mathsNLContent = document.getElementById('mathsNLContent');
const saveMathsButton = document.getElementById('saveMathsButton');
const backButtonMathsNL = document.getElementById('backButtonMathsNL');
const mathsNLTableBody = document.getElementById('mathsNLTableBody');

// List of Maths NL topics
const mathsTopics = [
    { name: "SETS", lectures: 3, homework: 3 },
    { name: "FOM", lectures: 23, homework: 23 },
    { name: "Quadratic", lectures: 7, homework: 7 },
    { name: "Relation & Function", lectures: 18, homework: 18 },
    { name: "ITF", lectures: 4, homework: 4 },
    { name: "Statistics", lectures: 3, homework: 3 },
    { name: "Sequence & Series", lectures: 7, homework: 7 },
    { name: "Matrices & Determinants", lectures: 11, homework: 11 },
    { name: "Straight Line", lectures: 9, homework: 9 },
    { name: "Circle", lectures: 9, homework: 9 },
    { name: "LCD", lectures: 14, homework: 14 },
    { name: "MOD", lectures: 5, homework: 5 },
    { name: "AOD", lectures: 15, homework: 15 },
    { name: "Conic Section", lectures: 12, homework: 12 },
    { name: "Indefinite", lectures: 8, homework: 8 },
    { name: "Definite", lectures: 7, homework: 7 },
    { name: "Area", lectures: 3, homework: 3 },
    { name: "Differential", lectures: 6, homework: 6 },
    { name: "V3D", lectures: 14, homework: 14 },
    { name: "Complex Numbers", lectures: 9, homework: 9 },
    { name: "SOT", lectures: 6, homework: 6 },
    { name: "BT", lectures: 10, homework: 10 },
    { name: "PnC", lectures: 9, homework: 9 },
    { name: "Probability", lectures: 8, homework: 8 }
];

// Function to create table rows for Maths NL topics
function createMathsTableRow(index, topic) {
    const row = document.createElement('tr');

    const slNoCell = document.createElement('td');
    slNoCell.textContent = index + 1;
    row.appendChild(slNoCell);

    const topicCell = document.createElement('td');
    topicCell.textContent = topic.name;
    row.appendChild(topicCell);

    const lectureCell = document.createElement('td');
    for (let i = 1; i <= topic.lectures; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        lectureCell.appendChild(checkbox);
        lectureCell.appendChild(document.createTextNode(i));
        lectureCell.appendChild(document.createElement('br'));
    }
    row.appendChild(lectureCell);

    const homeworkCell = document.createElement('td');
    for (let i = 1; i <= topic.homework; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        homeworkCell.appendChild(checkbox);
        homeworkCell.appendChild(document.createTextNode(i));
        homeworkCell.appendChild(document.createElement('br'));
    }
    row.appendChild(homeworkCell);

    const revisionCell = document.createElement('td');
    for (let i = 1; i <= 3; i++) {
        const label = document.createTextNode(`Rev ${i}: `);
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        revisionCell.appendChild(label);
        revisionCell.appendChild(dateInput);
        revisionCell.appendChild(document.createElement('br'));
    }
    row.appendChild(revisionCell);

    return row;
}

// Add Maths NL topics to the table
mathsTopics.forEach((topic, index) => {
    const row = createMathsTableRow(index, topic);
    mathsNLTableBody.appendChild(row);
});

// Event listeners for Maths NL
mathsNLButton.addEventListener('click', () => {
    praveenButtons.classList.add('hidden');
    mathsNLContent.classList.remove('hidden');
    loadSavedMathsData();
});

backButtonMathsNL.addEventListener('click', () => {
    mathsNLContent.classList.add('hidden');
    praveenButtons.classList.remove('hidden');
});

// Save Maths NL data to localStorage
saveMathsButton.addEventListener('click', () => {
    try {
        const rows = mathsNLTableBody.querySelectorAll('tr');
        const data = Array.from(rows).map(row => {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            const dates = row.querySelectorAll('input[type="date"]');
            return {
                lectures: Array.from(checkboxes).map(cb => cb.checked),
                revisions: Array.from(dates).map(dateInput => dateInput.value)
            };
        });
        localStorage.setItem('mathsNLData', JSON.stringify(data));
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
    }
});

// Load saved Maths NL data from localStorage
function loadSavedMathsData() {
    const data = JSON.parse(localStorage.getItem('mathsNLData')) || [];
    const rows = mathsNLTableBody.querySelectorAll('tr');
    data.forEach((item, index) => {
        const row = rows[index];
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        const dates = row.querySelectorAll('input[type="date"]');
        item.lectures.forEach((checked, i) => checkboxes[i].checked = checked);
        item.revisions.forEach((date, i) => dates[i].value = date);
    });
}

// CHEMISTRY PC/IOC NL

// Define constants for new DOM elements
const pcIocNlButton = document.getElementById('pcIocNlButton');
const pcIocNlContent = document.getElementById('pcIocNlContent');
const savePcIocNlButton = document.getElementById('savePcIocNlButton');
const backButtonPcIocNl = document.getElementById('backButtonPcIocNl');
const pcIocNlTableBody = document.getElementById('pcIocNlTableBody');

// List of PC/IOC NL topics
const pcIocNlTopics = [
    { name: "Mole Concept", lectures: 6, homework: 6 },
    { name: "QMM", lectures: 4, homework: 4 },
    { name: "Periodic Table", lectures: 5, homework: 5 },
    { name: "Real Gas", lectures: 3, homework: 3 },
    { name: "Chemical Bonding", lectures: 17, homework: 17 },
    { name: "Equilibrium", lectures: 15, homework: 15 },
    { name: "Coordination Compounds", lectures: 8, homework: 8 },
    { name: "Electrochemistry", lectures: 9, homework: 9 },
    { name: "Metallurgy", lectures: 4, homework: 4 },
    { name: "GIC", lectures: 2, homework: 2 },
    { name: "Qualitative Analysis (Anion)", lectures: 5, homework: 5 },
    { name: "P-Block (17,18)", lectures: 2, homework: 2 },
    { name: "Chemical Kinetics", lectures: 7, homework: 7 },
    { name: "Qualitative Analysis (Cation)", lectures: 3, homework: 3 },
    { name: "Solution", lectures: 7, homework: 7 },
    { name: "Surface Chemistry", lectures: 3, homework: 3 },
    { name: "S-Block", lectures: 3, homework: 3 },
    { name: "Solid State", lectures: 6, homework: 6 },
    { name: "P-Block (N,O)", lectures: 5, homework: 5 },
    { name: "Thermodynamics", lectures: 12, homework: 12 },
    { name: "B & C Family", lectures: 4, homework: 4 },
    { name: "Equivalent", lectures: 4, homework: 4 },
    { name: "D & F Block", lectures: 4, homework: 4 }
];

// Function to create table rows for PC/IOC NL topics
function createPcIocNlTableRow(index, topic) {
    const row = document.createElement('tr');

    const slNoCell = document.createElement('td');
    slNoCell.textContent = index + 1;
    row.appendChild(slNoCell);

    const topicCell = document.createElement('td');
    topicCell.textContent = topic.name;
    row.appendChild(topicCell);

    const lectureCell = document.createElement('td');
    for (let i = 1; i <= topic.lectures; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        lectureCell.appendChild(checkbox);
        lectureCell.appendChild(document.createTextNode(i));
        lectureCell.appendChild(document.createElement('br'));
    }
    row.appendChild(lectureCell);

    const homeworkCell = document.createElement('td');
    for (let i = 1; i <= topic.homework; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        homeworkCell.appendChild(checkbox);
        homeworkCell.appendChild(document.createTextNode(i));
        homeworkCell.appendChild(document.createElement('br'));
    }
    row.appendChild(homeworkCell);

    const revisionCell = document.createElement('td');
    for (let i = 1; i <= 3; i++) {
        const label = document.createTextNode(`Rev ${i}: `);
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        revisionCell.appendChild(label);
        revisionCell.appendChild(dateInput);
        revisionCell.appendChild(document.createElement('br'));
    }
    row.appendChild(revisionCell);

    return row;
}

// Add PC/IOC NL topics to the table
pcIocNlTopics.forEach((topic, index) => {
    const row = createPcIocNlTableRow(index, topic);
    pcIocNlTableBody.appendChild(row);
});

// Event listeners for PC/IOC NL
pcIocNlButton.addEventListener('click', () => {
    chemistryNLButtons.classList.add('hidden');
    pcIocNlContent.classList.remove('hidden');
    loadSavedPcIocNlData();
});

backButtonPcIocNl.addEventListener('click', () => {
    pcIocNlContent.classList.add('hidden');
    chemistryNLButtons.classList.remove('hidden');
});

// Save PC/IOC NL data to localStorage
savePcIocNlButton.addEventListener('click', () => {
    try {
        const rows = pcIocNlTableBody.querySelectorAll('tr');
        const data = Array.from(rows).map(row => {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            const dates = row.querySelectorAll('input[type="date"]');
            return {
                lectures: Array.from(checkboxes).map(cb => cb.checked),
                revisions: Array.from(dates).map(dateInput => dateInput.value)
            };
        });
        localStorage.setItem('pcIocNlData', JSON.stringify(data));
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
    }
});

// Load saved PC/IOC NL data from localStorage
function loadSavedPcIocNlData() {
    const data = JSON.parse(localStorage.getItem('pcIocNlData')) || [];
    const rows = pcIocNlTableBody.querySelectorAll('tr');
    data.forEach((item, index) => {
        const row = rows[index];
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        const dates = row.querySelectorAll('input[type="date"]');
        item.lectures.forEach((checked, i) => checkboxes[i].checked = checked);
        item.revisions.forEach((date, i) => dates[i].value = date);
    });
}
// chemistry oc nl 
// Define constants for new DOM elements
const ocNlButton = document.getElementById('ocNlButton');
const ocNlContent = document.getElementById('ocNlContent');
const saveOcNlButton = document.getElementById('saveOcNlButton');
const backButtonOcNl = document.getElementById('backButtonOcNl');
const ocNlTableBody = document.getElementById('ocNlTableBody');

// List of OC NL topics
const ocNlTopics = [
    { name: "IUPAC & Structural Isomerism", lectures: 6, homework: 6 },
    { name: "Structural Identification", lectures: 6, homework: 6 },
    { name: "GOC-I", lectures: 7, homework: 7 },
    { name: "GOC-II", lectures: 7, homework: 7 },
    { name: "Stereoisomerism", lectures: 12, homework: 12 },
    { name: "ORM-I", lectures: 6, homework: 6 },
    { name: "ORM-II", lectures: 8, homework: 8 },
    { name: "ROH", lectures: 6, homework: 6 },
    { name: "ORM-III", lectures: 6, homework: 6 },
    { name: "ORM-IV", lectures: 3, homework: 3 },
    { name: "Aromatic Compounds", lectures: 5, homework: 5 },
    { name: "Carbonyl & Carboxylic", lectures: 5, homework: 5 },
    { name: "Biomolecules", lectures: 3, homework: 3 },
    { name: "Polymer", lectures: 2, homework: 2 },
    { name: "Chemistry In Everyday Life", lectures: 2, homework: 2 }
];

// Function to create table rows for OC NL topics
function createOcNlTableRow(index, topic) {
    const row = document.createElement('tr');

    const slNoCell = document.createElement('td');
    slNoCell.textContent = index + 1;
    row.appendChild(slNoCell);

    const topicCell = document.createElement('td');
    topicCell.textContent = topic.name;
    row.appendChild(topicCell);

    const lectureCell = document.createElement('td');
    for (let i = 1; i <= topic.lectures; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        lectureCell.appendChild(checkbox);
        lectureCell.appendChild(document.createTextNode(i));
        lectureCell.appendChild(document.createElement('br'));
    }
    row.appendChild(lectureCell);

    const homeworkCell = document.createElement('td');
    for (let i = 1; i <= topic.homework; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        homeworkCell.appendChild(checkbox);
        homeworkCell.appendChild(document.createTextNode(i));
        homeworkCell.appendChild(document.createElement('br'));
    }
    row.appendChild(homeworkCell);

    const revisionCell = document.createElement('td');
    for (let i = 1; i <= 3; i++) {
        const label = document.createTextNode(`Rev ${i}: `);
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        revisionCell.appendChild(label);
        revisionCell.appendChild(dateInput);
        revisionCell.appendChild(document.createElement('br'));
    }
    row.appendChild(revisionCell);

    return row;
}

// Add OC NL topics to the table
ocNlTopics.forEach((topic, index) => {
    const row = createOcNlTableRow(index, topic);
    ocNlTableBody.appendChild(row);
});

// Event listeners for OC NL
ocNlButton.addEventListener('click', () => {
    chemistryNLButtons.classList.add('hidden');
    ocNlContent.classList.remove('hidden');
    loadSavedOcNlData();
});

backButtonOcNl.addEventListener('click', () => {
    ocNlContent.classList.add('hidden');
    chemistryNLButtons.classList.remove('hidden');
});

// Save OC NL data to localStorage
saveOcNlButton.addEventListener('click', () => {
    try {
        const rows = ocNlTableBody.querySelectorAll('tr');
        const data = Array.from(rows).map(row => {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            const dates = row.querySelectorAll('input[type="date"]');
            return {
                lectures: Array.from(checkboxes).map(cb => cb.checked),
                revisions: Array.from(dates).map(dateInput => dateInput.value)
            };
        });
        localStorage.setItem('ocNlData', JSON.stringify(data));
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
    }
});

// Load saved OC NL data from localStorage
function loadSavedOcNlData() {
    const data = JSON.parse(localStorage.getItem('ocNlData')) || [];
    const rows = ocNlTableBody.querySelectorAll('tr');
    data.forEach((item, index) => {
        const row = rows[index];
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        const dates = row.querySelectorAll('input[type="date"]');
        item.lectures.forEach((checked, i) => checkboxes[i].checked = checked);
        item.revisions.forEach((date, i) => dates[i].value = date);
    });
}

// physics fl 
// Define constants for new DOM elements
const physicsFlButton = document.getElementById('physicsFlButton');
const physicsFlContent = document.getElementById('physicsFlContent');
const savePhysicsFlButton = document.getElementById('savePhysicsFlButton');
const backButtonPhysicsFl = document.getElementById('backButtonPhysicsFl');
const physicsFlTableBody = document.getElementById('physicsFlTableBody');

// List of Physics FL topics
const physicsFlTopics = [
    { name: "Kinematics", lectures: 6, homework: 6 },
    { name: "Geometric Optics", lectures: 9, homework: 9 },
    { name: "NLM", lectures: 4, homework: 4 },
    { name: "Friction", lectures: 2, homework: 2 },
    { name: "WPE", lectures: 3, homework: 3 },
    { name: "Circular Motion", lectures: 4, homework: 4 },
    { name: "COM", lectures: 4, homework: 4 },
    { name: "RBD", lectures: 6, homework: 6 },
    { name: "SHM", lectures: 4, homework: 4 },
    { name: "Electrostatics", lectures: 9, homework: 9 },
    { name: "Gravitation", lectures: 2, homework: 2 },
    { name: "Current", lectures: 5, homework: 5 },
    { name: "Heat", lectures: 2, homework: 2 },
    { name: "Capacitance", lectures: 4, homework: 4 },
    { name: "EMF", lectures: 5, homework: 5 },
    { name: "EMI", lectures: 4, homework: 4 },
    { name: "EMW", lectures: 1, homework: 1 },
    { name: "AC", lectures: 2, homework: 2 },
    { name: "Modern Physics", lectures: 3, homework: 3 },
    { name: "Nuclear Physics", lectures: 3, homework: 3 },
    { name: "Wave On String", lectures: 3, homework: 3 },
    { name: "Sound Wave", lectures: 4, homework: 4 },
    { name: "Wave Optics", lectures: 3, homework: 3 },
    { name: "Thermodynamics", lectures: 3, homework: 3 },
    { name: "Fluid Mechanics", lectures: 2, homework: 2 },
    { name: "Calorimetry", lectures: 1, homework: 1 },
    { name: "Elasticity", lectures: 1, homework: 1 },
    { name: "Thermal Expansion", lectures: 1, homework: 1 },
    { name: "Error", lectures: 1, homework: 1 },
    { name: "Screw", lectures: 1, homework: 1 },
    { name: "Semiconductor", lectures: 6, homework: 6 },
    { name: "Communication Systems", lectures: 2, homework: 2 }
];

// Function to create table rows for Physics FL topics
function createPhysicsFlTableRow(index, topic) {
    const row = document.createElement('tr');

    const slNoCell = document.createElement('td');
    slNoCell.textContent = index + 1;
    row.appendChild(slNoCell);

    const topicCell = document.createElement('td');
    topicCell.textContent = topic.name;
    row.appendChild(topicCell);

    const lectureCell = document.createElement('td');
    for (let i = 1; i <= topic.lectures; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        lectureCell.appendChild(checkbox);
        lectureCell.appendChild(document.createTextNode(i));
        lectureCell.appendChild(document.createElement('br'));
    }
    row.appendChild(lectureCell);

    const homeworkCell = document.createElement('td');
    for (let i = 1; i <= topic.homework; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        homeworkCell.appendChild(checkbox);
        homeworkCell.appendChild(document.createTextNode(i));
        homeworkCell.appendChild(document.createElement('br'));
    }
    row.appendChild(homeworkCell);

    const revisionCell = document.createElement('td');
    for (let i = 1; i <= 3; i++) {
        const label = document.createTextNode(`Rev ${i}: `);
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        revisionCell.appendChild(label);
        revisionCell.appendChild(dateInput);
        revisionCell.appendChild(document.createElement('br'));
    }
    row.appendChild(revisionCell);

    return row;
}

// Add Physics FL topics to the table
physicsFlTopics.forEach((topic, index) => {
    const row = createPhysicsFlTableRow(index, topic);
    physicsFlTableBody.appendChild(row);
});

// Event listeners for Physics FL
physicsFlButton.addEventListener('click', () => {
    ontrakButtons.classList.add('hidden');
    physicsFlContent.classList.remove('hidden');
    loadSavedPhysicsFlData();
});

backButtonPhysicsFl.addEventListener('click', () => {
    physicsFlContent.classList.add('hidden');
    ontrakButtons.classList.remove('hidden');
});

// Save Physics FL data to localStorage
savePhysicsFlButton.addEventListener('click', () => {
    try {
        const rows = physicsFlTableBody.querySelectorAll('tr');
        const data = Array.from(rows).map(row => {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            const dates = row.querySelectorAll('input[type="date"]');
            return {
                lectures: Array.from(checkboxes).map(cb => cb.checked),
                revisions: Array.from(dates).map(dateInput => dateInput.value)
            };
        });
        localStorage.setItem('physicsFlData', JSON.stringify(data));
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
    }
});

// Load saved Physics FL data from localStorage
function loadSavedPhysicsFlData() {
    const data = JSON.parse(localStorage.getItem('physicsFlData')) || [];
    const rows = physicsFlTableBody.querySelectorAll('tr');
    data.forEach((item, index) => {
        const row = rows[index];
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        const dates = row.querySelectorAll('input[type="date"]');
        item.lectures.forEach((checked, i) => checkboxes[i].checked = checked);
        item.revisions.forEach((date, i) => dates[i].value = date);
    });
}

// chemistry pc/ioc FL

// Define constants for new DOM elements
const pcIocFlButton = document.getElementById('pcIocFlButton');
const pcIocFlContent = document.getElementById('pcIocFlContent');
const savePcIocFlButton = document.getElementById('savePcIocFlButton');
const backButtonPcIocFl = document.getElementById('backButtonPcIocFl');
const pcIocFlTableBody = document.getElementById('pcIocFlTableBody');

// List of PC/IOC FL topics
const pcIocFlTopics = [
    { name: "Mole Concept", lectures: 5, homework: 5 },
    { name: "QMM", lectures: 2, homework: 2 },
    { name: "Periodic Table", lectures: 3, homework: 3 },
    { name: "Real Gas", lectures: 3, homework: 3 },
    { name: "Chemical Bonding", lectures: 10, homework: 10 },
    { name: "Chemical Equilibrium", lectures: 3, homework: 3 },
    { name: "Ionic Equilibrium", lectures: 6, homework: 6 },
    { name: "Coordination Compounds", lectures: 5, homework: 5 },
    { name: "Metallurgy", lectures: 2, homework: 2 },
    { name: "Qualitative Analysis (Anion)", lectures: 2, homework: 2 },
    { name: "GIC", lectures: 2, homework: 2 },
    { name: "P-Block (17-18)", lectures: 1, homework: 1 },
    { name: "Chemical Kinetics", lectures: 4, homework: 4 },
    { name: "Qualitative Analysis (Cation)", lectures: 2, homework: 2 },
    { name: "Solution", lectures: 3, homework: 3 },
    { name: "Surface Chemistry", lectures: 2, homework: 2 },
    { name: "Solid State", lectures: 3, homework: 3 },
    { name: "S-Block", lectures: 1, homework: 1 },
    { name: "N & O family", lectures: 2, homework: 2 },
    { name: "Thermodynamics", lectures: 3, homework: 3 },
    { name: "Thermochemistry", lectures: 2, homework: 2 },
    { name: "Equivalent Concept", lectures: 2, homework: 2 },
    { name: "B & C family", lectures: 2, homework: 2 },
    { name: "D & F Block", lectures: 1, homework: 1 },
    { name: "Atomic Structure (optional)", lectures: 5, homework: 5 },
    { name: "Gaseous State (optional)", lectures: 5, homework: 5 }
];

// Function to create table rows for PC/IOC FL topics
function createPcIocFlTableRow(index, topic) {
    const row = document.createElement('tr');

    const slNoCell = document.createElement('td');
    slNoCell.textContent = index + 1;
    row.appendChild(slNoCell);

    const topicCell = document.createElement('td');
    topicCell.textContent = topic.name;
    row.appendChild(topicCell);

    const lectureCell = document.createElement('td');
    for (let i = 1; i <= topic.lectures; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        lectureCell.appendChild(checkbox);
        lectureCell.appendChild(document.createTextNode(i));
        lectureCell.appendChild(document.createElement('br'));
    }
    row.appendChild(lectureCell);

    const homeworkCell = document.createElement('td');
    for (let i = 1; i <= topic.homework; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        homeworkCell.appendChild(checkbox);
        homeworkCell.appendChild(document.createTextNode(i));
        homeworkCell.appendChild(document.createElement('br'));
    }
    row.appendChild(homeworkCell);

    const revisionCell = document.createElement('td');
    for (let i = 1; i <= 3; i++) {
        const label = document.createTextNode(`Rev ${i}: `);
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        revisionCell.appendChild(label);
        revisionCell.appendChild(dateInput);
        revisionCell.appendChild(document.createElement('br'));
    }
    row.appendChild(revisionCell);

    return row;
}

// Add PC/IOC FL topics to the table
pcIocFlTopics.forEach((topic, index) => {
    const row = createPcIocFlTableRow(index, topic);
    pcIocFlTableBody.appendChild(row);
});

// Event listeners for PC/IOC FL
pcIocFlButton.addEventListener('click', () => {
    chemistryFLButtons.classList.add('hidden');
    pcIocFlContent.classList.remove('hidden');
    loadSavedPcIocFlData();
});

backButtonPcIocFl.addEventListener('click', () => {
    pcIocFlContent.classList.add('hidden');
    chemistryFLButtons.classList.remove('hidden');
});

// Save PC/IOC FL data to localStorage
savePcIocFlButton.addEventListener('click', () => {
    try {
        const rows = pcIocFlTableBody.querySelectorAll('tr');
        const data = Array.from(rows).map(row => {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            const dates = row.querySelectorAll('input[type="date"]');
            return {
                lectures: Array.from(checkboxes).map(cb => cb.checked),
                revisions: Array.from(dates).map(dateInput => dateInput.value)
            };
        });
        localStorage.setItem('pcIocFlData', JSON.stringify(data));
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
    }
});

// Load saved PC/IOC FL data from localStorage
function loadSavedPcIocFlData() {
    const data = JSON.parse(localStorage.getItem('pcIocFlData')) || [];
    const rows = pcIocFlTableBody.querySelectorAll('tr');
    data.forEach((item, index) => {
        const row = rows[index];
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        const dates = row.querySelectorAll('input[type="date"]');
        item.lectures.forEach((checked, i) => checkboxes[i].checked = checked);
        item.revisions.forEach((date, i) => dates[i].value = date);
    });
}

// chemistry oc fl

// Define constants for new DOM elements
const ocFlButton = document.getElementById('ocFlButton');
const ocFlContent = document.getElementById('ocFlContent');
const saveOcFlButton = document.getElementById('saveOcFlButton');
const backButtonOcFl = document.getElementById('backButtonOcFl');
const ocFlTableBody = document.getElementById('ocFlTableBody');

// List of OC FL topics
const ocFlTopics = [
    { name: "IUPAC", lectures: 4, homework: 4 },
    { name: "Structural Identification", lectures: 3, homework: 3 },
    { name: "GOC-1", lectures: 4, homework: 4 },
    { name: "GOC-2", lectures: 3, homework: 3 },
    { name: "Stereoisomerism", lectures: 7, homework: 7 },
    { name: "ORM-1", lectures: 3, homework: 3 },
    { name: "ORM-2", lectures: 4, homework: 4 },
    { name: "ROH", lectures: 3, homework: 3 },
    { name: "ORM-3", lectures: 2, homework: 2 },
    { name: "ORM-4", lectures: 2, homework: 2 },
    { name: "Polymer", lectures: 2, homework: 2 },
    { name: "Aromatic Compounds", lectures: 2, homework: 2 },
    { name: "Chemistry in Everyday Life", lectures: 2, homework: 2 },
    { name: "Carbonyl & Carboxylic", lectures: 2, homework: 2 },
    { name: "Biomolecules", lectures: 4, homework: 4 },
    { name: "Environmental Chemistry", lectures: 2, homework: 2 }
];

// Function to create table rows for OC FL topics
function createOcFlTableRow(index, topic) {
    const row = document.createElement('tr');

    const slNoCell = document.createElement('td');
    slNoCell.textContent = index + 1;
    row.appendChild(slNoCell);

    const topicCell = document.createElement('td');
    topicCell.textContent = topic.name;
    row.appendChild(topicCell);

    const lectureCell = document.createElement('td');
    for (let i = 1; i <= topic.lectures; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        lectureCell.appendChild(checkbox);
        lectureCell.appendChild(document.createTextNode(i));
        lectureCell.appendChild(document.createElement('br'));
    }
    row.appendChild(lectureCell);

    const homeworkCell = document.createElement('td');
    for (let i = 1; i <= topic.homework; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        homeworkCell.appendChild(checkbox);
        homeworkCell.appendChild(document.createTextNode(i));
        homeworkCell.appendChild(document.createElement('br'));
    }
    row.appendChild(homeworkCell);

    const revisionCell = document.createElement('td');
    for (let i = 1; i <= 3; i++) {
        const label = document.createTextNode(`Rev ${i}: `);
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        revisionCell.appendChild(label);
        revisionCell.appendChild(dateInput);
        revisionCell.appendChild(document.createElement('br'));
    }
    row.appendChild(revisionCell);

    return row;
}

// Add OC FL topics to the table
ocFlTopics.forEach((topic, index) => {
    const row = createOcFlTableRow(index, topic);
    ocFlTableBody.appendChild(row);
});

// Event listeners for OC FL
ocFlButton.addEventListener('click', () => {
    chemistryFLButtons.classList.add('hidden');
    ocFlContent.classList.remove('hidden');
    loadSavedOcFlData();
});

backButtonOcFl.addEventListener('click', () => {
    ocFlContent.classList.add('hidden');
    chemistryFLButtons.classList.remove('hidden');
});

// Save OC FL data to localStorage
saveOcFlButton.addEventListener('click', () => {
    try {
        const rows = ocFlTableBody.querySelectorAll('tr');
        const data = Array.from(rows).map(row => {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            const dates = row.querySelectorAll('input[type="date"]');
            return {
                lectures: Array.from(checkboxes).map(cb => cb.checked),
                revisions: Array.from(dates).map(dateInput => dateInput.value)
            };
        });
        localStorage.setItem('ocFlData', JSON.stringify(data));
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
    }
});

// Load saved OC FL data from localStorage
function loadSavedOcFlData() {
    const data = JSON.parse(localStorage.getItem('ocFlData')) || [];
    const rows = ocFlTableBody.querySelectorAll('tr');
    data.forEach((item, index) => {
        const row = rows[index];
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        const dates = row.querySelectorAll('input[type="date"]');
        item.lectures.forEach((checked, i) => checkboxes[i].checked = checked);
        item.revisions.forEach((date, i) => dates[i].value = date);
    });
}

// maths fl

// Define constants for new DOM elements
const mathsFlButton = document.getElementById('mathsFlButton');
const mathsFlContent = document.getElementById('mathsFlContent');
const saveMathsFlButton = document.getElementById('saveMathsFlButton');
const backButtonMathsFl = document.getElementById('backButtonMathsFl');
const mathsFlTableBody = document.getElementById('mathsFlTableBody');

// List of Maths FL topics
const mathsFlTopics = [
    { name: "Sets", lectures: 1, homework: 1 },
    { name: "FOM", lectures: 8, homework: 8 },
    { name: "Quadratic", lectures: 4, homework: 4 },
    { name: "Relation", lectures: 1, homework: 1 },
    { name: "Function", lectures: 9, homework: 9 },
    { name: "ITF", lectures: 2, homework: 2 },
    { name: "Limit", lectures: 4, homework: 4 },
    { name: "Statistics", lectures: 1, homework: 1 },
    { name: "Sequence & Series", lectures: 4, homework: 4 },
    { name: "Determinants", lectures: 2, homework: 2 },
    { name: "Matrix", lectures: 4, homework: 4 },
    { name: "Straight Line", lectures: 5, homework: 5 },
    { name: "Continuity & Differentiability", lectures: 4, homework: 4 },
    { name: "MOD", lectures: 2, homework: 2 },
    { name: "AOD", lectures: 9, homework: 9 },
    { name: "Mathematical Reasoning", lectures: 1, homework: 1 },
    { name: "Conic Section", lectures: 7, homework: 7 },
    { name: "Indefinite", lectures: 4, homework: 4 },
    { name: "Definite", lectures: 4, homework: 4 },
    { name: "Area", lectures: 2, homework: 2 },
    { name: "Differential", lectures: 4, homework: 4 },
    { name: "V3D", lectures: 8, homework: 8 },
    { name: "Complex Number", lectures: 5, homework: 5 },
    { name: "BT", lectures: 4, homework: 4 },
    { name: "SOT", lectures: 3, homework: 3 },
    { name: "PnC", lectures: 9, homework: 9 },
    { name: "Probability", lectures: 8, homework: 8 }
];

// Function to create table rows for Maths FL topics
function createMathsFlTableRow(index, topic) {
    const row = document.createElement('tr');

    const slNoCell = document.createElement('td');
    slNoCell.textContent = index + 1;
    row.appendChild(slNoCell);

    const topicCell = document.createElement('td');
    topicCell.textContent = topic.name;
    row.appendChild(topicCell);

    const lectureCell = document.createElement('td');
    for (let i = 1; i <= topic.lectures; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        lectureCell.appendChild(checkbox);
        lectureCell.appendChild(document.createTextNode(i));
        lectureCell.appendChild(document.createElement('br'));
    }
    row.appendChild(lectureCell);

    const homeworkCell = document.createElement('td');
    for (let i = 1; i <= topic.homework; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        homeworkCell.appendChild(checkbox);
        homeworkCell.appendChild(document.createTextNode(i));
        homeworkCell.appendChild(document.createElement('br'));
    }
    row.appendChild(homeworkCell);

    const revisionCell = document.createElement('td');
    for (let i = 1; i <= 3; i++) {
        const label = document.createTextNode(`Rev ${i}: `);
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        revisionCell.appendChild(label);
        revisionCell.appendChild(dateInput);
        revisionCell.appendChild(document.createElement('br'));
    }
    row.appendChild(revisionCell);

    return row;
}

// Add Maths FL topics to the table
mathsFlTopics.forEach((topic, index) => {
    const row = createMathsFlTableRow(index, topic);
    mathsFlTableBody.appendChild(row);
});

// Event listeners for Maths FL
mathsFlButton.addEventListener('click', () => {
    chemistryFLButtons.classList.add('hidden');
    ontrakButtons.classList.add('hidden');
    mathsFlContent.classList.remove('hidden');
    loadSavedMathsFlData();
});

backButtonMathsFl.addEventListener('click', () => {
    mathsFlContent.classList.add('hidden');
    ontrakButtons.classList.remove('hidden');
});

// Save Maths FL data to localStorage
saveMathsFlButton.addEventListener('click', () => {
    try {
        const rows = mathsFlTableBody.querySelectorAll('tr');
        const data = Array.from(rows).map(row => {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            const dates = row.querySelectorAll('input[type="date"]');
            return {
                lectures: Array.from(checkboxes).map(cb => cb.checked),
                revisions: Array.from(dates).map(dateInput => dateInput.value)
            };
        });
        localStorage.setItem('mathsFlData', JSON.stringify(data));
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
    }
});

// Load saved Maths FL data from localStorage
function loadSavedMathsFlData() {
    const data = JSON.parse(localStorage.getItem('mathsFlData')) || [];
    const rows = mathsFlTableBody.querySelectorAll('tr');
    data.forEach((item, index) => {
        const row = rows[index];
        const checkboxes = row.querySelectorAll('input[type="checkbox"]');
        const dates = row.querySelectorAll('input[type="date"]');
        item.lectures.forEach((checked, i) => checkboxes[i].checked = checked);
        item.revisions.forEach((date, i) => dates[i].value = date);
    });
}



//progress bar in ontrak, praveen
document.addEventListener('DOMContentLoaded', function() {
    const subjects = [
        { id: 'physicsNl', totalLectures: 225 },
        { id: 'pcIocNl', totalLectures: 135 },
        { id: 'ocNl', totalLectures: 82 },
        { id: 'mathsNl', totalLectures: 212 },
        { id: 'physicsFl', totalLectures: 127 },
        { id: 'pcIocFl', totalLectures: 109 },
        { id: 'ocFl', totalLectures: 60 },
        { id: 'mathsFl', totalLectures: 124 }
    ];

    function updateProgressBar(subject, totalLectures, doneLectures) {
        const progressFill = document.getElementById(`${subject}ProgressFill`);
        const progressText = document.getElementById(`${subject}ProgressText`);

        const progress = (doneLectures / totalLectures) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.innerHTML = `${Math.round(progress)}% <span style="color: green; display: inline-block; margin-left: 10px;">[Done: ${doneLectures}]</span><span style="color: red; display: inline-block; margin-left: 10px;">[Not Done: ${totalLectures - doneLectures}]</span>`;
    }

    function loadSavedData(subject) {
        const savedData = JSON.parse(localStorage.getItem(`${subject}Data`)) || {};
        let doneLectures = 0;
        for (const lecture in savedData) {
            if (savedData[lecture]) {
                doneLectures++;
            }
        }
        return doneLectures;
    }

    subjects.forEach(({ id, totalLectures }) => {
        const doneLectures = loadSavedData(id);
        updateProgressBar(id, totalLectures, doneLectures);
    });

    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {
        subjects.forEach(({ id, totalLectures }) => {
            const doneLectures = loadSavedData(id);
            updateProgressBar(id, totalLectures, doneLectures);
        });
    });
});


