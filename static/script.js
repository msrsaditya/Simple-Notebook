function addCodeBox() {
    const codeContainers = document.querySelectorAll('.codebox-container');
    const lastCodeBox = codeContainers[codeContainers.length - 1];
    const newCodeBox = document.createElement('div');
    newCodeBox.classList.add('codebox-container');
    newCodeBox.innerHTML = `<textarea class="inputCodeArea" placeholder="Code Here..." rows="1"></textarea>`;
    lastCodeBox.insertAdjacentElement('afterend', newCodeBox);
}
function selectedCodeBox() {
    const selectedBox = document.querySelector('.selected');
    return selectedBox;
}
function removeCodeBox() {
    const codeBoxes = document.querySelectorAll('.codebox-container');
    if (codeBoxes.length > 1) {
        const selectedBox = selectedCodeBox();
        if (selectedBox) {
            selectedBox.remove();
        } else {
            codeBoxes[codeBoxes.length - 1].remove();
        }
    }
}
function adjustCodeBoxHeight() {
    const textareas = document.querySelectorAll('.inputCodeArea');
    textareas.forEach(textarea => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    });
}
document.getElementById('addCodeBox').addEventListener('click', addCodeBox);
document.getElementById('removeCodeBox').addEventListener('click', removeCodeBox);
document.addEventListener('input', function(event) {
    if (event.target && event.target.classList.contains('inputCodeArea')) {
        adjustCodeBoxHeight();
    }
});
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('inputCodeArea')) {
        const codeBoxes = document.querySelectorAll('.codebox-container');
        codeBoxes.forEach(box => box.classList.remove('selected'));
        event.target.closest('.codebox-container').classList.add('selected');
    }
});
document.addEventListener('keydown', function(event) {
    const isCmdOrCtrl = event.metaKey || event.ctrlKey;
    if (event.key === "Tab") {
        event.preventDefault();
        const textarea = event.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        textarea.value = value.substring(0, start) + "    " + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
    }
    if (isCmdOrCtrl && event.key === "k") {
        event.preventDefault();
        addCodeBox();
    }
    if (isCmdOrCtrl && event.key === "x") {
        event.preventDefault();
        removeCodeBox();
    }
    if (isCmdOrCtrl && event.key === "Enter") {
        event.preventDefault();
        document.getElementById('runCode').click();
    }
});

document.getElementById('runCode').addEventListener('click', function() {
    const selectedBox = selectedCodeBox();
    if (!selectedBox) {
        alert("No code box selected.");
        return;
    }
    const codeArea = selectedBox.querySelector('.inputCodeArea');
    const code = codeArea.value;
    const inputPromptMatch = code.match(/input\(["']([^"']+)["']\)/);
    const inputPrompt = inputPromptMatch ? inputPromptMatch[1] : "Enter input:";
    const requiresInput = code.includes("input(");
    if (!requiresInput) {
        executeCode(code, null);
    } else {
        const userInput = prompt(inputPrompt);
        executeCode(code, userInput, inputPrompt);
    }
});
function executeCode(code, userInput, inputPrompt) {
    fetch('/execute', {
        method: 'POST',
        body: new URLSearchParams({ code, userInput }), // Include userInput in the request body
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => response.text())
    .then(output => {
        if (inputPrompt && output.startsWith(inputPrompt)) {
            output = output.substring(inputPrompt.length).trim();
        }
        alert(output);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}
