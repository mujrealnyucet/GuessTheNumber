// Promenne :)
let currentSecret = 0;
let currentAttempts = 0;
let chosenDifficulty = 10;

// Tlacitka

var returnBtn = document.querySelector(`.button-return`);
returnBtn.addEventListener(`click`, exitGame);

var restartBtn = document.querySelector(`.button-restart`);
restartBtn.addEventListener(`click`, () => startGame(chosenDifficulty)); // ocekava jiny objekt tak si ho vytvorime (https://www.reddit.com/r/learnjavascript/comments/twljtu/how_do_i_pass_arguments_to_a_function_inside/)

// Obrazovky
var startScreen = document.querySelector(`.main-menu`);
var gameScreen = document.querySelector(`.game`);

// Formular (tedy ta samotna hra)
const form = document.getElementById(`game-form`);
form.addEventListener(`submit`, function (event) {
    event.preventDefault();

    // Counter
    currentAttempts++;

    const data = new FormData(form);
    const guessedNumber = data.get(`number-input`);
    let something = (Math.abs(guessedNumber - currentSecret))
    let percentAway = (something / chosenDifficulty) * 100;

    if (percentAway <= 5) {
        document.querySelector(`.extra-hint-message`).innerHTML = "Skoro hoří...";
    } else if (percentAway <= 15) {
        document.querySelector(`.extra-hint-message`).innerHTML = "Přihořívá...";
    } else if (percentAway <= 30) {
        document.querySelector(`.extra-hint-message`).innerHTML = "Lehounce přihoříva...";
    } else {
        document.querySelector(`.extra-hint-message`).innerHTML = "Samá voda...";
    }

    if (guessedNumber < currentSecret) {
        document.querySelector(`.hint-message`).innerHTML = 'jsi moc nízko!'
        form.reset();
    };
    if (guessedNumber > currentSecret) {
        document.querySelector(`.hint-message`).innerHTML = 'jsi moc vysoko!'
        form.reset();
    };
    if (guessedNumber == currentSecret) {
        document.querySelector(`.extra-hint-message`).innerHTML = "Hoří!";
        document.querySelector(`.hint-message`).innerHTML = 'Gratuluji! Uhodl jsi.'
        document.querySelector(`.correct`).classList.remove(`hidden`);
        document.querySelector(`.number-submit-btn`).disabled = true;
        saveToHistory(currentSecret, currentAttempts, chosenDifficulty)
    };
    console.log(`Attemps: ${currentAttempts}`);
})

// Vyber obtiznosti
const startForm = document.getElementById(`start-form`);
startForm.addEventListener(`submit`, function (event) {
    event.preventDefault();

    const adata = new FormData(startForm);
    // empty check
    if (adata.get(`upper-limit`)) {
        chosenDifficulty = adata.get(`upper-limit`);
    }
    console.log(`Difficulty: ${chosenDifficulty}`)
    startGame(chosenDifficulty);
})

// Nacist historii
displayHistory();

function startGame(chosenDifficulty) {
    document.querySelector(`.correct`).classList.add(`hidden`);
    document.querySelector(`.number-submit-btn`).disabled = false;
    document.querySelector(`.extra-hint-message`).innerHTML = "";
    document.querySelector(`.hint-message`).innerHTML = "";
    startScreen.classList.add(`hidden`);
    gameScreen.classList.remove(`hidden`);


    currentAttempts = 0;
    currentSecret = getRandomIntInclusive(1, chosenDifficulty);
    //console.log(currentSecret);
}

function exitGame() {
    startScreen.classList.remove(`hidden`);
    gameScreen.classList.add(`hidden`);

    form.reset();
    displayHistory();
}

function saveToHistory(secret, result, difficulty) {
    let history = JSON.parse(localStorage.getItem('gameHistory')) || [];

    const historyItem = {
        date: new Date().toLocaleString(),
        secretNumber: secret,
        tookAttempts: result,
        difficulty: difficulty
    };
    history.push(historyItem);

    localStorage.setItem('gameHistory', JSON.stringify(history));
}

function displayHistory() {
    const historyContainer = document.querySelector('.history');

    const history = JSON.parse(localStorage.getItem('gameHistory')).reverse() || [];

    // Neduplikuj
    historyContainer.innerHTML = '';

    history.forEach(item => {
        const historyHTML = `
            <div class="history-item">
            <p class="took-attemtps">Počet pokusů: <span style="text-decoration: underline;">${item.tookAttempts}</span></p
            <p class="smaller">Uhodnuté číslo: <b>${item.secretNumber} z ${item.difficulty}</b> možností.</p>   
            <p class="date smaller">Datum: ${item.date}</p>
            </div>
        `;

        historyContainer.insertAdjacentHTML('beforeend', historyHTML);
    });
}

// Thanks https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

//localStorage.clear();
