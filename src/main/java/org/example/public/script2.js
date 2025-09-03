document.addEventListener('DOMContentLoaded', () => {
    // List of questions for the second game
    const questions = [
        {
            text: "It is okay to talk loudly on the phone during a lecture.",
            isCorrect: false
        },
        {
            text: "You should greet professors and university staff.",
            isCorrect: true
        },
        {
            text: "It's acceptable to be late for class if you notify the professor.",
            isCorrect: false
        },
        {
            text: "You must submit your assignments on time.",
            isCorrect: true
        },
        {
            text: "You are allowed to use gadgets during an exam.",
            isCorrect: false
        },
        {
            text: "You should clean up after yourself in classrooms and the cafeteria.",
            isCorrect: true
        },
        {
            text: "It's okay to cheat or use cheat sheets.",
            isCorrect: false
        },
        {
            text: "It's important to help your classmates if they ask.",
            isCorrect: true
        }
    ];

    let currentQuestionIndex = 0;
    // Retrieve the score from the first game. If it doesn't exist, start at 0.
    let score = localStorage.getItem('gameScore') ? parseInt(localStorage.getItem('gameScore')) : 0;

    const questionText = document.getElementById('question-text');
    const trueBtn = document.getElementById('true-btn');
    const falseBtn = document.getElementById('false-btn');
    const scoreElement = document.getElementById('score');
    const endGameModal = document.getElementById('endGameModal');
    const finalScoreText = document.getElementById('final-score-text');
    const restartBtn = document.getElementById('restart-btn');

    // Display the initial score from the previous game
    scoreElement.textContent = score;

    // Function to display the next question
    function showQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionText.textContent = currentQuestion.text;
        } else {
            endGame();
        }
    }

    // Function to check the user's answer
    function checkAnswer(isUserCorrect) {
        const currentQuestion = questions[currentQuestionIndex];
        if (isUserCorrect === currentQuestion.isCorrect) {
            score++;
            scoreElement.textContent = score;
            // Update the total score in localStorage after each correct answer
            localStorage.setItem('gameScore', score);

            // Check if the total score has reached the target
            if (score === 13) {
                window.location.href = 'end.html';
                return; // Stop the function from proceeding
            }
        }
        currentQuestionIndex++;
        showQuestion();
    }

    // Function to end the game
    function endGame() {
        // The game is over, so display the final total score without redirecting
        finalScoreText.textContent = `Your final total score is: ${score}.`;
        endGameModal.style.display = 'flex';
    }

    // Event listeners for the buttons
    trueBtn.addEventListener('click', () => {
        checkAnswer(true);
    });

    falseBtn.addEventListener('click', () => {
        checkAnswer(false);
    });

    restartBtn.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        scoreElement.textContent = score;
        // Reset score in localStorage to start the entire game from scratch
        localStorage.setItem('gameScore', 0);
        endGameModal.style.display = 'none';
        showQuestion();
    });

    // Start the game
    showQuestion();
});