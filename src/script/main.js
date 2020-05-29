"use strict";
const dropCheatSheet = document.getElementById("dropCheatSheet");
const cheatsheet = document.getElementById("cheatsheet");
const tabs = document.getElementById("tabs");

const lastNoteKeyStandIn = "K";
const lastNoteKeyStandInCode = 75;
const lastNoteKey = "\u00ce";

const allowedNotes = new Set([
    "d", "i", "e", "j", "f", "g", "h", "a", "n", "b", "m", "c", ",", " ", "\n", lastNoteKey,
    "D", "I", "E", "J", "F", "G", "H", "A", "N", "B", "M", "C", lastNoteKeyStandIn
]);

const allowedNoteCodes = new Set([
    68, 73, 69, 74, 70, 71, 72, 65, 78, 66, 77, 67, 188, 32, 13, lastNoteKeyStandInCode,
    17, 16, 20, 91, 8, 39, 37, 38, 40, 116, 123
]);

const disallowedKeycodes = [
    81, 87, 82, 84, 89, 85, 79, 80,
];

let cheatSheetDown = false;
let dataTransferText;

dropCheatSheet.addEventListener("click", toggleCheatSheet);

/*tabs.addEventListener("focusout", e => {
 const target = e.currentTarget;
 if (target.textContent.trim().length === 0) {
 target.textContent = "";
 }
 });*/

tabs.addEventListener("paste", e =>
    dataTransferText = e.clipboardData.getData("text")
);

tabs.addEventListener("beforeinput", e => {
    if (e.dataTransfer !== undefined && e.dataTransfer !== null) dataTransferText = e.dataTransfer.getData("text");
});

// tabs.addEventListener("keydown", e => {
//     if (e.keyCode === 13) e.preventDefault();
// });

tabs.addEventListener("compositionend", e=>alert("'"+e.data+"'"));

// TODO: # kan settes inn??
// Not using beforeinput as the letters will be inserted after event listener execution, making it impossible to
// prevent key insertion.
tabs.addEventListener("input", e => {
    // For mobile: e.data contains the entire content ... sometimes. Seems keyboard-dependent. Shouldn't be relied
    // on, except as a maximum bound for inserted content, except for when pasting
    const target = e.currentTarget;
    // focusOffset and anchorOffset seem to always be equal when execution has reached input-event
    // oh btw - this doesn't work with insertFromDrop or insertParagraph. Because suddenly the window thinks your
    // selection is at 0, probably because of more rediculous casting.
    // ...
    // Because screw you.
    const selection = window.getSelection();
    let index = selection.focusOffset;

    const inputType = e.inputType;
    // console.log(e);
    // alert(stringify_object(e));
    // const k = document.createElement("span");
    // k.innerText = stringify_object(e);
    // document.body.appendChild(k);
    // console.log(e);
    // alert(stringify_object(e));
    const k = document.createElement("span");
    k.innerText = stringify_object(e);
    document.body.appendChild(k);
    // cleanNoteStringSegment(target, 0, target.textContent.length);
    switch (inputType) {
        case "insertFromDrop":
        case "insertFromPaste":
        case "insertFromPasteAsQuotation":  // TODO: check if using DataTransfer
        case "insertFromYank":              // TODO: check if using DataTransfer
        case "insertLink":                  // TODO: check if using DataTransfer
            if (dataTransferText !== undefined) {
                const data = dataTransferText;
                dataTransferText = undefined;
                if (data !== null) {
                    // console.log(e);
                    if (selection.focusNode !== target.childNodes[0]) {
                        if (selection.focusNode === target) {
                            index = target.childNodes[0].length;
                        } else {
                            let selectedChildIndex =
                                // index = target.childNodes[0].textContent.length;
                                Array.prototype.indexOf.call(target.childNodes, selection.focusNode.parentElement);
                            for (let childIndex = 0; childIndex < selectedChildIndex; childIndex++) {
                                index += target.childNodes[childIndex].textContent.length;
                            }
                            index -= data.length;
                        }
                        let newTextContent = "";
                        while (target.childNodes.length !== 0) {
                            const child = target.childNodes[0];
                            newTextContent += child.textContent;
                            target.removeChild(child);
                        }
                        target.textContent = newTextContent;
                        cleanNoteStringSegment(target, index, index + data.length);
                    } else {
                        cleanNoteStringSegment(target, index-data.length, index);
                    }
                }
                else {
                    cleanNoteStringSegment(target, 0, index);
                }
            }
            else {
                cleanNoteStringSegment(target, 0, index);
            }
            break;
        case "insertCompositionText":       // TODO: idk
            // break;
        case "insertText":
            const leastPossibleLeftBound = index - e.data.length;
            const leftBound = Math.max(0, leastPossibleLeftBound);
            cleanNoteStringSegment(target, leftBound, index);
            break;
        case "insertReplacementText":       // TODO: idk
            break;
        // This cancels paragraph insertion. Because of course it does.
        case "insertParagraph":
            const position = target.childNodes[0].textContent.length;
            target.textContent = target.textContent;
            window.getSelection().setPosition(target.childNodes[0], position);
            break;
        default:
            break;
    }

    // content is contained in property _ for inputTypes ...
    // data: insertText, insertCompositionText
    // dataTransfer (or just ... not I guess. That's _fine_.): insertFrom*, insertReplacementText
    // none: all others
    // You know what, that system sucks.
});

function getCleanedNoteString(noteString) {
    const processed = [];
    for (const char of noteString) {
        if (allowedNotes.has(char)) {
            if (char === lastNoteKeyStandIn) {
                processed.push(lastNoteKey);
            }
            else {
                processed.push(char);
            }
        }
    }
    return processed.join("");

}

// InputEvent

/*A
 tabs.addEventListener("beforeinput", e => {
 // alert(e);
 // alert("keydown"+e.key+e.keyCode);
 // const key = e.key;
 const key = e.data;
 // if (e.ctrlKey || e.altKey) return;
 // const keyCode = (96 <= e.keyCode && e.keyCode <= 105)? e.keyCode-48 : e.keyCode;
 // const key = String.fromCharCode(keyCode);
 // if (RegExp("\p{L}").exec(key).index >= 0 && allowedNotes.indexOf(key) < 0) {
 //         e.preventDefault();
 //         e.stopPropagation();
 // }
 // if (disallowedKeycodes.ind)
 if (allowedNotes.indexOf(key) < 0) {
 // if (allowedNoteCodes.indexOf(keyCode) < 0) {
 //     e.preventDefault();
 // e.stopPropagation();
 }
 else if (key === lastNoteKeyStandIn) {
 // else if (keyCode === lastNoteKeyStandInCode) {
 interceptKey(e, lastNoteKey);
 }
 });*/

// inclusive startIndex, endIndex exclusive
function cleanNoteStringSegment(target, startIndex, endIndex) {
    const uncleanString = target.textContent;

    const cleanedSegment = getCleanedNoteString(uncleanString.substring(startIndex, endIndex));

    target.textContent =
        uncleanString.slice(0, startIndex) + cleanedSegment + uncleanString.slice(endIndex);
    // Check prevents blur on input of disallowed character to empty textContent
    if (target.textContent.length > 0)
        window.getSelection().setPosition(target.firstChild, startIndex + cleanedSegment.length);

}

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


function stringify_object(object, depth = 0, max_depth = 2) {
    // change max_depth to see more levels, for a touch event, 2 is good
    if (depth > max_depth)
        return "Object";

    const obj = {};
    for (let key in object) {
        let value = object[key];
        if (value instanceof Node)
            // specify which properties you want to see from the node
            value = {id: value.id};
        else if (value instanceof Window)
            value = "Window";
        else if (value instanceof Object)
            value = stringify_object(value, depth + 1, max_depth);

        obj[key] = value;
    }

    return depth ? obj : JSON.stringify(obj);
}