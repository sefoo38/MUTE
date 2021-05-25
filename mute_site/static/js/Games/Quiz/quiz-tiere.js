// select all elements
const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const qImg = document.getElementById("qImg");
const choiceA = document.getElementById("A");
const choiceB = document.getElementById("B");
const choiceC = document.getElementById("C");
const progress = document.getElementById("progress");
const scoreDiv = document.getElementById("score");
const imgMuteCoin = document.getElementById("imgMuteCoin");
const coinFlip = document.getElementById("coinFlip");
const gameover = document.getElementById("gameover");


// create questions
let questions = [
    {
        imgMuteCoin : "video/mute/MuteCoin.gif",
        question : "hase",
        imgSrc : "video/tiere/hase.gif",
        choiceA : "img/elefant.png",
        choiceB : "img/hase.png",
        choiceC : "img/vogel.png",
        correct : "B"
    },{
        imgMuteCoin : "video/mute/MuteCoin.gif",
        question : "eule",
        imgSrc : "video/tiere/eule.gif",
        choiceA : "img/eule.png",
        choiceB : "img/vogel.png",
        choiceC : "img/maus.png",
        correct : "A"
    },{
        imgMuteCoin : "video/mute/MuteCoin.gif",
        question : "elefant",
        imgSrc : "video/tiere/elefant.gif",
        choiceA : "img/maus.png",
        choiceB : "img/vogel.png",
        choiceC : "img/elefant.png",
        correct : "C"

    },{
        imgMuteCoin : "video/mute/MuteCoin.gif",
        question : "vogel",
        imgSrc : "video/tiere/vogel.gif",
        choiceA : "img/hase.png",
        choiceB : "img/eule.png",
        choiceC : "img/vogel.png",
        correct : "C"
    },{
        imgMuteCoin : "video/mute/MuteCoin.gif",
        question : "maus",
        imgSrc : "video/tiere/maus.gif",
        choiceA : "img/hase.png",
        choiceB : "img/maus.png",
        choiceC : "img/elefant.png",
        correct : "B"
    }
];

// create some variables
const firstQ = questions.length - 4;
const secondQ = questions.length - 3;
const thirdQ = questions.length - 2;
const fourthQ = questions.length - 1;
const lastQuestion = questions.length - 1;
let runningQuestion = 0;
let count = 0;
let score = 0;
const MUTE_COINS = 0;
var correctAnswer = new Audio('sound/ui/correctAnswer.mp3');
var haseSound = new Audio('sound/tiere/hase.mp3');
var euleSound = new Audio('sound/tiere/eule.mp3');
var elefantSound = new Audio('sound/tiere/elefant.mp3');
var vogelSound = new Audio('sound/tiere/vogel.mp3');
var mausSound = new Audio('sound/tiere/maus.mp3');
var happyendSound = new Audio('sound/ui/happyend.mp3');

// render a question
function renderQuestion(){
    let q = questions[runningQuestion];

    imgMuteCoin.innerHTML = "<img src="+ q.imgMuteCoin +">";
    question.innerHTML = "<p>"+ q.question +"</p>";
    qImg.innerHTML = "<img src="+ q.imgSrc +">";
    choiceA.innerHTML = "<img src="+ q.choiceA +">";
    choiceB.innerHTML = "<img src="+ q.choiceB +">";
    choiceC.innerHTML = "<img src="+ q.choiceC +">";
}

start.addEventListener("click",startQuiz);

// start quiz
function startQuiz(){
    start.style.display = "none";
    renderQuestion();
    quiz.style.display = "block";
    renderProgress();
    score = 0;
}

// render progress
function renderProgress(){
    for(let qIndex = 0; qIndex <= lastQuestion; qIndex++){
        progress.innerHTML += "<div class='prog' id="+ qIndex +"></div>";
    }
}

// checkAnwer
async function checkAnswer(answer){
    if( answer == questions[runningQuestion].correct){
        // answer is correct
        score++;
        // change progress color to green
        answerIsCorrect();
        flip();
        coinFlip.style.display = "block";
        correctAnswer.play();
    }else{
        // answer is wrong
        // change progress color to red
        answerIsWrong();
        coinFlip.style.display = "none";
    }
    count = 0;
    if(runningQuestion < lastQuestion){
        runningQuestion++;
        renderQuestion();
    }else{
        await sleep(3000);      // sleep 3 sec until you show mute with firework
        happyend();
    }
    helpForAnimalSounds();
}

// answer is correct
function answerIsCorrect(){
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
    addScore(MUTE_COINS);
}

// answer is wrong
function answerIsWrong(){
    document.getElementById(runningQuestion).style.backgroundColor = "#f00";
}

// flip coin if the answer is correct
function flip(){
    coinFlip.innerHTML = "<img src="+ "video/mute/Coin-4.gif" +">";
}

// add +1 to score if the answer was correct
addScore = num => {
    score +=num;
    scoreDiv.innerText = score;
}

// show mute with firework
function happyend(){
    gameover.innerHTML = "<img src="+ "video/mute/Freude_Feuerwerk.gif" +">";
    coinFlip.style.display = "none";
    happyendSound.play();
    mausSound.stop();
}

// sleep function
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function helpForAnimalSounds() {
    if(runningQuestion == firstQ){
        haseSound.play();
    }
    if(runningQuestion == secondQ){
        euleSound.play();
    }
    if(runningQuestion == thirdQ){
        elefantSound.play();
    }
    if(runningQuestion == fourthQ){
        vogelSound.play();
    }
    if(runningQuestion == lastQuestion){
        await sleep(6000);
        mausSound.play();
    }
}
