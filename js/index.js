// Selecting necessary elements
const note = document.getElementById('note');
const saveBtn = document.getElementById('saveBtn');
const saveAsNewBtn = document.createElement('button'); 
const menuIcon = document.getElementById('menuIcon');
const menu = document.getElementById('menu');
const savedNotesOption = document.getElementById('savedNotesOption');
const noteContainer = document.getElementById('noteContainer');
const savedNotesContainer = document.getElementById('savedNotesContainer');
const backIcon = document.getElementById('backIcon');
const notesList = document.getElementById('notesList');

// Add 'Save As New' button properties
saveAsNewBtn.id = 'saveAsNewBtn';
saveAsNewBtn.textContent = 'Save As New';
saveAsNewBtn.style.display = 'none';
saveAsNewBtn.style.marginLeft = '10px';
noteContainer.appendChild(saveAsNewBtn);

// Load saved notes from localStorage when the page loads
let savedNotes = JSON.parse(localStorage.getItem('notes')) || {};

// Variable to track the currently opened note
let currentOpenedNote = null;

// Display saved notes in the Saved Notes section
displaySavedNotes();

// Save note to localStorage
saveBtn.addEventListener('click', function () {
    const noteContent = note.value.trim();

    if (!noteContent) {
        alert('Please write something before saving.');
        return;
    }

    const filename = currentOpenedNote || prompt('Enter a filename for your note:').trim();

    if (!filename) {
        alert('Filename cannot be empty.');
        return;
    }

    // Save note content with filename in localStorage
    savedNotes[filename] = noteContent;
    localStorage.setItem('notes', JSON.stringify(savedNotes));

    displaySavedNotes(); // Update the saved notes list
    currentOpenedNote = filename; // Set the current note to the saved one
    alert(`Note "${filename}" saved successfully!`);
});


saveAsNewBtn.addEventListener('click', function () {
    const noteContent = note.value.trim();

    if (!noteContent) {
        alert('Please write something before saving.');
        return;
    }

    const filename = prompt('Enter a new filename for your note:').trim();

    if (!filename) {
        alert('Filename cannot be empty.');
        return;
    }

    if (savedNotes[filename]) {
        alert('A note with this filename already exists. Please choose a different name.');
        return;
    }

    // Save note content with the new filename in localStorage
    savedNotes[filename] = noteContent;
    localStorage.setItem('notes', JSON.stringify(savedNotes));

    displaySavedNotes(); // Update the saved notes list
    alert(`Note saved as "${filename}" successfully!`);
});

// Display saved notes
function displaySavedNotes() {
    notesList.innerHTML = ''; // Clear the list before rendering

    for (let key in savedNotes) {
        const li = document.createElement('li');
        li.textContent = key;

        // Open the note on click
        li.addEventListener('click', function () {
            openNoteInTextArea(key);
        });

    //download button
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent triggering note opening
            downloadNoteAsTxt(key);
        });

        // delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent triggering note opening
            deleteNote(key);
        });

        li.appendChild(downloadButton);
        li.appendChild(deleteButton);
        notesList.appendChild(li);
    }
}

// Open the selected note in the text area
function openNoteInTextArea(filename) {
    note.value = savedNotes[filename]; // Populate the text area with note content
    currentOpenedNote = filename; // Track the current opened note
    noteContainer.style.display = 'block'; // Switch back to the note-taking area
    savedNotesContainer.style.display = 'none'; // Hide the saved notes container
    saveAsNewBtn.style.display = 'inline-block'; // Show the Save As New button when a note is opened
}

// Download the note as a .txt file
function downloadNoteAsTxt(filename) {
    const noteContent = savedNotes[filename];
    const blob = new Blob([noteContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Delete note from localStorage
function deleteNote(filename) {
    delete savedNotes[filename];
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    displaySavedNotes();
}

// Toggle menu visibility
menuIcon.addEventListener('click', function () {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Show saved notes container
savedNotesOption.addEventListener('click', function () {
    noteContainer.style.display = 'none';
    savedNotesContainer.style.display = 'block';
    menu.style.display = 'none';
    saveAsNewBtn.style.display = 'none'; // Hide the Save As New button when viewing saved notes
});

// Go back to main note container
backIcon.addEventListener('click', function () {
    savedNotesContainer.style.display = 'none';
    noteContainer.style.display = 'block';
});
