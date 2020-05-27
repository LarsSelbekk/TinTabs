"use strict";
const dropCheatSheet = document.getElementById("dropCheatSheet");
const cheatsheet = document.getElementById("cheatsheet");
dropCheatSheet.addEventListener("click", toggleCheatSheet);

let cheatSheetDown = false;

function toggleCheatSheet() {
    if (cheatSheetDown) {
        dropCheatSheet.innerText = 'Cheat sheet \u25bc';
        cheatsheet.classList.add("hidden");
    } else {
        dropCheatSheet.innerText = 'Cheat sheet \u25b2';
        cheatsheet.classList.remove("hidden");
    }
    cheatSheetDown = !cheatSheetDown;
}