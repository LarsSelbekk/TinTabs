"use strict";
const dropCheatSheet = document.getElementById("dropCheatSheet");
const cheatsheet = document.getElementById("cheatsheet");
const tabs = document.getElementById("tabs");

// const lastNoteKeyStandIn = "K";

const allowedNotes = [
    "d", "i", "e", "j", "f", "g", "h", "a", "n", "b", "m", ",", "c", " ", "Enter",
    "D", "I", "E", "J", "F", "G", "H", "A", "N", "B", "M", "C", "K"
];

dropCheatSheet.addEventListener("click", toggleCheatSheet);

tabs.addEventListener("focusout", e => {
    const target = e.currentTarget;
    if (target.textContent.trim().length === 0) {
        target.textContent = "";
    }
});

tabs.addEventListener("keypress", e => {
    const key = e.key;
    if (allowedNotes.indexOf(key) < 0) {
        e.preventDefault();
    }
});

function interceptKey(event, replacementString) {
    let selection = window.getSelection();
    let startIndex = Math.min(selection.focusOffset, selection.anchorOffset);
    let endIndex = Math.max(selection.focusOffset, selection.anchorOffset);
    let oldContent = event.target.textContent;

    event.target.textContent = oldContent.slice(0, startIndex) + replacementString + oldContent.slice(endIndex);

    selection.setPosition(event.currentTarget.firstChild, startIndex+1);

    event.preventDefault();
}

let cheatSheetDown = false;

function toggleCheatSheet() {
    if (cheatSheetDown) {
        dropCheatSheet.value = "Cheat sheet \u25bc";
        cheatsheet.classList.add("hidden");
    }
    else {
        dropCheatSheet.value = "Cheat sheet \u25b2";
        cheatsheet.classList.remove("hidden");
    }
    cheatSheetDown = !cheatSheetDown;
}