const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.main-container');

// Canvas setup
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;

// Game state variables
let startElement = null;
let isDrawing = false;
let currentMouse = { x: 0, y: 0 };
const connections = new Map();

// Correct answer key for the matching game
const correctAnswers = {
    'item1': 'target1',
    'item2': 'target2',
    'item3': 'target2',
    'item4': 'target1',
    'item5': 'target2'
};

// Helper function to get the center of an element
function getCenter(el) {
    const rect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top
    };
}

// Event listeners for drawing lines
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('mousedown', () => {
        startElement = item;
        isDrawing = true;
        document.querySelectorAll('.item').forEach(i => i.style.borderColor = '#333');
        item.style.borderColor = 'green';
    });
});

document.addEventListener('mousemove', (e) => {
    if (isDrawing && startElement) {
        const containerRect = container.getBoundingClientRect();
        currentMouse.x = e.clientX - containerRect.left;
        currentMouse.y = e.clientY - containerRect.top;
        draw();
    }
});

document.querySelectorAll('.target').forEach(target => {
    target.addEventListener('mouseup', () => {
        if (isDrawing && startElement) {
            connections.set(startElement.id, target);
            startElement.style.borderColor = '#333';
            startElement = null;
            isDrawing = false;
            draw();
        }
    });
});

// Main draw function for the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connections.forEach((target, itemId) => {
        const item = document.getElementById(itemId);
        const start = getCenter(item);
        const end = getCenter(target);
        const isCorrect = correctAnswers[itemId] === target.id;
       // ctx.strokeStyle = isCorrect ? 'green' : 'red';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    });

    if (isDrawing && startElement) {
        const start = getCenter(startElement);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 20;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(currentMouse.x, currentMouse.y);
        ctx.stroke();
    }
}

// Next button and modal window logic
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('next');
    const modal = document.getElementById('warningModal');
    const closeModal = document.getElementById('closeModal');

    startBtn.addEventListener('click', () => {
        const totalItems = document.querySelectorAll('.item').length;
        let score = 0;

        if (connections.size < totalItems) {
            modal.style.display = 'flex';
            return;
        }

        connections.forEach((target, itemId) => {
            const isCorrect = correctAnswers[itemId] === target.id;
            if (isCorrect) {
                score++;
            }
        });

        // Save the score to localStorage for the next game
        localStorage.setItem('gameScore', score);

        // All items are connected, now check the score and redirect
        if (score === totalItems) {
            // Redirect to the next page if all answers are correct
            window.location.href = 'index2.html';
        } else {
            // Display an alert or message for incorrect answers
            modal.querySelector('p').textContent = `You got ${score} out of ${totalItems} correct. Try again!`;
            modal.style.display = 'flex';
        }

        // Redraw lines with correct/incorrect colors
        draw();
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        // Reset modal text on close
        modal.querySelector('p').textContent = 'Please connect all items before starting!';
    });
});