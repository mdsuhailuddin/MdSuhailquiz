let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let userName = "";

// DOM Elements
const questionElement = document.getElementById("question");
const answerButtons = document.querySelector(".answer-buttons");
const nextButton = document.getElementById("next-btn");

const welcomeScreen = document.querySelector(".welcome-screen");
const startBtn = document.getElementById("start-btn");
const appContainer = document.querySelector(".app");

const createQuizScreen = document.getElementById("create-quiz-screen");
const quizOwnerHeading = document.getElementById("quiz-owner");

// Step 1: Get user name and go to quiz creation screen
startBtn.addEventListener("click", () => {
  const input = document.getElementById("username");
  if (input.value.trim() === "") {
    alert("Please enter your name to start creating a quiz.");
    return;
  }

  userName = input.value.trim();
  welcomeScreen.style.display = "none";
  createQuizScreen.style.display = "block";
});

// Step 2: Add Question
window.addQuestion = function () {
  const questionText = document.getElementById("question-input").value;
  const answerInputs = document.querySelectorAll(".answer");
  const correctIndex = parseInt(document.getElementById("correct-index").value) - 1;

  if (!questionText || answerInputs.length !== 4 || isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
    alert("Please fill all fields correctly.");
    return;
  }

  const answers = Array.from(answerInputs).map((input, index) => ({
    text: input.value,
    correct: index === correctIndex,
  }));

  questions.push({
    question: questionText,
    answers: answers,
  });

  // Clear form
  document.getElementById("question-input").value = "";
  answerInputs.forEach(input => input.value = "");
  document.getElementById("correct-index").value = "";

  alert("Question added!");
};

// Step 3: Start playing custom quiz
window.startCustomQuiz = function () {
  if (questions.length === 0) {
    alert("Please add at least one question.");
    return;
  }

  createQuizScreen.style.display = "none";
  appContainer.style.display = "block";
  quizOwnerHeading.innerText = `Quiz by ${userName}`;

  startQuiz();
};

// Step 4: Quiz Functions
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerText = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  const questionNo = currentQuestionIndex + 1;
  questionElement.innerText = `${questionNo}. ${currentQuestion.question}`;

  currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

function resetState() {
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }

  Array.from(answerButtons.children).forEach(button => {
    if (button.dataset.correct === "true") button.classList.add("correct");
    button.disabled = true;
  });

  nextButton.style.display = "block";
}

function showScore() {
  resetState();
  questionElement.innerText = `You scored ${score} out of ${questions.length}`;
  nextButton.innerText = "Play Again";
  nextButton.style.display = "block";
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz(); // Restart quiz
  }
});
