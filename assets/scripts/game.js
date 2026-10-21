const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progress-text");
const scoreText = document.getElementById("score");

// Variables for game.
let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let totalQuestions = 0;

//Constants for maximum number of points per correct answer and maximum number of questions per game.
const SCORE_POINTS = 10;
const MAX_QUESTIONS = 10;

//Function to start game.
startGame = () => {
    questionCounter = 0;
    score = 0;
    const selectedCategory = new URLSearchParams(window.location.search).get("category");
    const categoryQuestions = selectedCategory
        ? questions.filter(question => question.category === selectedCategory)
        : questions;
    availableQuestions = questionList(categoryQuestions, MAX_QUESTIONS);
    totalQuestions = availableQuestions.length;
    getNewQuestion();
};

//Function to get a new question
getNewQuestion = () => {
    //Checks if all questions have been answered
    if(availableQuestions.length === 0){
        localStorage.setItem('mostRecentScore', score);

        return window.location.assign('end.html');
    }

    //Increments question counter and updates progress text.
    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${totalQuestions}`;

    //Selects a random question from the array of available questions.
    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[questionsIndex];
    const shuffledChoices = shuffleChoices(selectedQuestion);
    currentQuestion = {
        ...selectedQuestion,
        answer: shuffledChoices.findIndex(choice => choice.isCorrect) + 1,
    };

    shuffledChoices.forEach((choice, index) => {
        currentQuestion['choice' + (index + 1)] = choice.text;
    });

    question.innerText = currentQuestion.question;

    //Populates choices with answer options.
    choices.forEach(choice => {
        const number = choice.dataset.number;
        choice.innerText = currentQuestion['choice' + number];
    });

    //Removes each used question from the array of available questions.
    availableQuestions.splice(questionsIndex, 1);

    //Allows user ti select an answer.
    acceptingAnswers = true;
};

// Shuffle each question's answers while keeping track of the correct option.
const shuffleChoices = selectedQuestion => {
    const shuffledChoices = [1, 2, 3, 4].map(number => ({
        text: selectedQuestion['choice' + number],
        isCorrect: number === selectedQuestion.answer,
    }));

    for (let index = shuffledChoices.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledChoices[index], shuffledChoices[randomIndex]] =
            [shuffledChoices[randomIndex], shuffledChoices[index]];
    }

    return shuffledChoices;
};

//Function to shuffle and get subset of questions.
questionList = (allQuestions, subsetSize) => {
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
    return shuffledQuestions.slice(0, subsetSize);
};

// Event listener for user choices
choices.forEach(choice => {
    choice.addEventListener('click', e => {
         // Prevent answering if not in the accepting state.
        if(!acceptingAnswers) return;

        // Update game state based on user choice.
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset.number;
        const isCorrectAnswer = selectedAnswer == currentQuestion.answer;

        const classToApply = isCorrectAnswer ? 'correct' : 'incorrect';
        const correctChoice = choices.find(choice => choice.dataset.number == currentQuestion.answer);

        // Increment score if the answer is correct.
        if(isCorrectAnswer) {
            incrementScore(SCORE_POINTS);
        }

        // Highlight the selected choice and reveal the correct answer.
        selectedChoice.parentElement.classList.add(classToApply);
        correctChoice.parentElement.classList.add('correct');

        // Move to the next question after a delay.
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            correctChoice.parentElement.classList.remove('correct');
            getNewQuestion();

        }, 1500);
    });
});

// Function to increment the score./
incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

//Start the game.
startGame();