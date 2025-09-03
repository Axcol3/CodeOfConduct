const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');
const container = document.querySelector('.main-container');

// Canvas setup
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;

// Game state variables
let selectedItem = null;
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

// Event listener for all items (tap to select)
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', () => {
        // Find and un-highlight any previously selected item
        if (selectedItem) {
            selectedItem.style.borderColor = '#333';
        }

        // Find and remove any previous connection for this item
        const existingTarget = connections.get(item.id);
        if (existingTarget) {
            existingTarget.style.borderColor = '#333';
            connections.delete(item.id);
            draw();
        }

        // Highlight the new selected item
        selectedItem = item;
        selectedItem.style.borderColor = 'green';
    });
});

// Event listener for all targets (tap to connect)
document.querySelectorAll('.target').forEach(target => {
    target.addEventListener('click', () => {
        if (selectedItem) {
            const isCorrect = correctAnswers[selectedItem.id] === target.id;

            // Set border colors based on correctness
            target.style.borderColor = isCorrect ? 'green' : 'red';
            selectedItem.style.borderColor = isCorrect ? 'green' : 'red';

            // Establish the connection and reset selected item
            connections.set(selectedItem.id, target);
            selectedItem = null;
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

        // Рисуем "границу" линии
        ctx.strokeStyle = 'black'; // цвет границы
        ctx.lineWidth = 30;        // шире основной линии
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // Рисуем основную линию поверх границы
        ctx.strokeStyle = isCorrect ? 'green' : 'red'; // основной цвет линии
        ctx.lineWidth = 20;                             // уже, чем граница
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    });
}

// Next button and modal window logic
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('next');
    const modal = document.getElementById('warningModal');
    const closeModal = document.getElementById('closeModal');
    const scoreDisplay = document.getElementById('score');

    startBtn.addEventListener('click', () => {
        const totalItems = document.querySelectorAll('.item').length;
        let score = 0;

        if (connections.size < totalItems) {
            modal.style.display = 'flex';
            modal.querySelector('p').textContent = 'Please connect all items before submitting!';
            return;
        }

        connections.forEach((target, itemId) => {
            if (correctAnswers[itemId] === target.id) {
                score++;
            }
        });

        scoreDisplay.textContent = score;
        localStorage.setItem('gameScore', score);

        if (score === totalItems) {
            window.location.href = 'index2.html';
        } else {
            modal.querySelector('p').textContent = `You got ${score} out of ${totalItems} correct. Try again!`;
            modal.style.display = 'flex';
        }
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.querySelector('p').textContent = 'Please connect all items before submitting!';
    });
});

// Resize event listener
window.addEventListener('resize', () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    draw();
});