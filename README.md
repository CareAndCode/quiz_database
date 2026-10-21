# The Great Quiz Database

A lightweight, browser-based multiple-choice trivia game. Play a randomized set
of questions, keep track of your score, and save your best results to a local
leaderboard.

## Features

- A new randomized selection of up to 10 questions each game.
- The option to play with questions from one selected category.
- Four shuffled answer choices for every question.
- Correct and incorrect answer feedback, including a reveal of the correct
  answer after each selection.
- 10 points for each correct answer.
- A leaderboard that keeps the five highest scores in browser storage.
- Responsive layout styled with Bootstrap.

## Play the game

No build tools or package installation are required. From the repository root,
start a local static web server:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser. Choose
a category or leave **All categories** selected, then select **Begin Quiz** to
play. Enter a name at the end to save your score, or choose **Scores** from the
home page to view the leaderboard.

You can also open `index.html` directly in a browser, though using a local
server is recommended.

## How to play

1. Optionally choose a category on the home page, then start a quiz.
2. Select one of the four answers for each question. Your selection is locked
   while the answer feedback is displayed.
3. Earn 10 points for each correct answer. An incorrect selection does not
   earn points, and the correct answer is shown before the next question.
4. After the quiz, enter a name to save your score. The leaderboard retains
   the top five scores.

## Project structure

```text
.
├── index.html                 # Home page and instructions
├── game.html                  # Quiz interface
├── end.html                   # Final score and save-score form
├── scores.html                # Leaderboard
└── assets/
    ├── css/
    │   └── style.css          # Site and game styles
    └── scripts/
        ├── questions.js       # Question bank
        ├── game.js            # Question flow, answer feedback, and scoring
        ├── end.js             # Final score and score saving
        └── scores.js          # Leaderboard rendering
```

## Adding questions

Add question objects to the `questions` array in
[`assets/scripts/questions.js`](assets/scripts/questions.js). Each question
uses four choices and an `answer` value from `1` to `4`, indicating which
`choice` is correct:

```javascript
{
    question: "Which planet is known as the Red Planet?",
    category: "Space",
    choice1: "Venus",
    choice2: "Mars",
    choice3: "Jupiter",
    choice4: "Mercury",
    answer: 2,
}
```

The category is stored with each question and used to populate the category
selector on the home page.

## Score storage

Scores are saved in the browser's `localStorage`, under the `highScores` key.
They are local to the browser and profile used to play; they are not uploaded
to a server or shared automatically across devices. Clearing browser site data
can remove saved scores.

## External resources

The pages load Bootstrap, Google Fonts, and Font Awesome from external CDNs.
An internet connection may be needed for those styles and icons to load; the
quiz itself is implemented with the files in this repository.
