(() => {
    const question = document.getElementById("question");
    const choices = Array.from(document.getElementsByClassName("choice-text"));
    const progressText = document.getElementById("progress-text");
    const scoreText = document.getElementById("score");
    const speechButton = document.getElementById("speak-question");
    const speechStatus = document.createElement("span");

    const SCORE_POINTS = 10;
    const MAX_QUESTIONS = 10;

    let currentQuestion = {};
    let acceptingAnswers = true;
    let score = 0;
    let questionCounter = 0;
    let availableQuestions = [];
    let totalQuestions = 0;
    let currentUtterance = null;

    speechStatus.className = "speech-status";
    speechStatus.setAttribute("role", "status");
    speechStatus.setAttribute("aria-live", "polite");
    document.body.appendChild(speechStatus);

    const speechSynthesis = window.speechSynthesis;
    const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;

    const resetSpeechButton = () => {
        speechButton.textContent = "▶";
        speechButton.setAttribute("aria-label", "Read question and answers aloud");
        speechButton.title = "Read question and answers aloud";
    };

    const stopSpeaking = () => {
        if (!currentUtterance) return;
        speechSynthesis.cancel();
        currentUtterance = null;
        resetSpeechButton();
    };

    if (speechSynthesis && SpeechSynthesisUtterance) {
        speechButton.addEventListener("click", () => {
            if (currentUtterance) {
                stopSpeaking();
                return;
            }

            const answers = [...document.querySelectorAll(".choice-container")].map((container, index) => {
                const label = container.querySelector(".choice-prefix")?.textContent.trim()
                    || `Answer ${index + 1}`;
                const answer = container.querySelector(".choice-text")?.textContent.trim() || "";
                return `${label}: ${answer}`;
            });
            const utterance = new SpeechSynthesisUtterance(
                `Question: ${question.textContent.trim()}. ${answers.join(". ")}`
            );

            speechSynthesis.cancel();
            currentUtterance = utterance;
            speechButton.textContent = "■";
            speechButton.setAttribute("aria-label", "Stop speaking");
            speechButton.title = "Stop speaking";
            speechStatus.textContent = "";

            const finish = () => {
                if (currentUtterance !== utterance) return;
                currentUtterance = null;
                resetSpeechButton();
            };

            utterance.onend = finish;
            utterance.onerror = event => {
                finish();
                if (event.error !== "canceled" && event.error !== "interrupted") {
                    speechStatus.textContent = "Text-to-speech could not play this text.";
                }
            };

            try {
                speechSynthesis.speak(utterance);
                if (speechSynthesis.paused) {
                    speechSynthesis.resume();
                }
            } catch (error) {
                finish();
                speechStatus.textContent = "Text-to-speech could not play this text.";
            }
        });
    } else {
        speechButton.disabled = true;
        speechStatus.textContent = "Text-to-speech is not supported in this browser.";
    }

    const startGame = () => {
        questionCounter = 0;
        score = 0;
        const selectedCategory = new URLSearchParams(window.location.search).get("category");
        const categoryQuestions = selectedCategory
            ? questions.filter(item => item.category === selectedCategory)
            : questions;

        availableQuestions = questionList(categoryQuestions, MAX_QUESTIONS);
        totalQuestions = availableQuestions.length;
        getNewQuestion();
    };

    const getNewQuestion = () => {
        if (availableQuestions.length === 0) {
            localStorage.setItem("mostRecentScore", score);
            window.location.assign("end.html");
            return;
        }

        questionCounter++;
        progressText.innerText = `Question ${questionCounter} of ${totalQuestions}`;

        const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions[questionsIndex];
        const shuffledChoices = shuffleChoices(selectedQuestion);
        currentQuestion = {
            ...selectedQuestion,
            answer: shuffledChoices.findIndex(choice => choice.isCorrect) + 1,
        };

        shuffledChoices.forEach((choice, index) => {
            currentQuestion[`choice${index + 1}`] = choice.text;
        });

        question.innerText = currentQuestion.question;
        choices.forEach(choice => {
            choice.innerText = currentQuestion[`choice${choice.dataset.number}`];
        });

        availableQuestions.splice(questionsIndex, 1);
        acceptingAnswers = true;
    };

    const shuffleChoices = selectedQuestion => {
        const shuffledChoices = [1, 2, 3, 4].map(number => ({
            text: selectedQuestion[`choice${number}`],
            isCorrect: number === selectedQuestion.answer,
        }));

        for (let index = shuffledChoices.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [shuffledChoices[index], shuffledChoices[randomIndex]] =
                [shuffledChoices[randomIndex], shuffledChoices[index]];
        }

        return shuffledChoices;
    };

    const questionList = (allQuestions, subsetSize) => {
        const shuffledQuestions = [...allQuestions];
        for (let index = shuffledQuestions.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [shuffledQuestions[index], shuffledQuestions[randomIndex]] =
                [shuffledQuestions[randomIndex], shuffledQuestions[index]];
        }

        return shuffledQuestions.slice(0, subsetSize);
    };

    choices.forEach(choice => {
        choice.addEventListener("click", event => {
            if (!acceptingAnswers) return;

            stopSpeaking();
            acceptingAnswers = false;
            const selectedChoice = event.currentTarget;
            const selectedAnswer = selectedChoice.dataset.number;
            const isCorrectAnswer = selectedAnswer == currentQuestion.answer;
            const classToApply = isCorrectAnswer ? "correct" : "incorrect";
            const correctChoice = choices.find(item => item.dataset.number == currentQuestion.answer);

            if (isCorrectAnswer) {
                incrementScore(SCORE_POINTS);
            }

            selectedChoice.parentElement.classList.add(classToApply);
            correctChoice.parentElement.classList.add("correct");

            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                correctChoice.parentElement.classList.remove("correct");
                getNewQuestion();
            }, 1500);
        });
    });

    const incrementScore = amount => {
        score += amount;
        scoreText.innerText = score;
    };

    startGame();
})();
