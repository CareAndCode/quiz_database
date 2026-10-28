const username = document.getElementById("username");
const scoreForm = document.getElementById("score-form");
const saveScore = document.getElementById("save-score");
const finalScore = document.getElementById("final-score");

if (username && scoreForm && saveScore && finalScore) {
    const mostRecentScore = localStorage.getItem("mostRecentScore");
    finalScore.textContent = mostRecentScore;

    username.addEventListener("input", () => {
        saveScore.disabled = !username.value.trim();
    });

    scoreForm.addEventListener("submit", event => {
        event.preventDefault();

        const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScores.push({
            score: mostRecentScore,
            name: username.value.trim(),
        });
        highScores.sort((first, second) => second.score - first.score);
        highScores.splice(5);
        localStorage.setItem("highScores", JSON.stringify(highScores));
        window.location.assign("scores.html");
    });
}

const highScoresList = document.getElementById("high-score-list");
if (highScoresList) {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    highScoresList.replaceChildren();

    highScores.forEach(score => {
        const item = document.createElement("li");
        item.className = "high-score";
        item.textContent = `${score.name} - ${score.score}`;
        highScoresList.appendChild(item);
    });
}