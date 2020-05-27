const ol_tabs = document.getElementById("ol_tabs");
const inp_noteString = document.getElementById("inp_noteString");

const validNotes = ["d", "e", "f#", "g", "a", "b", "c#", "D", "E", "F#", "G", "A", "B", "C#"];
const validNotesWithSharp = ["f", "c", "F", "C"];

const notes = [];

inp_noteString.addEventListener("input", updateTabs);

function updateTabs() {
    const noteString = inp_noteString.value;
    let i = 0;
    while (i < noteString.length) {
	const letter = noteString[i++];
	if (validNotes.contains(letter)) {
	    addNote(letter);
	} else if (validNotesWithSharp.contains(letter)) {
	    const modifier = noteString[i++];
	    if (validNotes.contains(letter + modifier)) {
		addNote(letter + modifier);
	    } else {
		return;
	    }
	} else {
	    return;
	}
    }
    updateTabs();
}

function addNote(note) {
    notes.put(note);
}

function updateTabs() {
    ol_tabs.innerHTML = "";
    notes.forEach(
	note => ol_notes.appendChild(generateNoteElement(note)));
}

function generateNoteElement(note) {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = "../assets/notes/note_${note}.png";
    li.appendChild(img);
    return li;
}
