let totalPoints = 0;
let currentFactIndex = 0;
let pendingEntry = {};
let quizActive = false;
let correctFact = null;

//animation duration
const ANIMATION_DURATION = 2000; 

// function to handle the loader and reveal the content
function initializeApp() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('mainContent');

    //hide the loader and show the content
    setTimeout(() => {
        loader.style.opacity = 0; //fade-out transition
        
        setTimeout(() => {
            loader.style.display = 'none';
            mainContent.classList.remove('hidden');
            mainContent.classList.add('visible');
        }, 1500); 
        
    }, ANIMATION_DURATION); 
    
    // display initial fact
    displayFact(currentFactIndex);
}

window.onload = initializeApp; 

//fact data
const factData = [
    // HERBS (🌿)
    { emoji: '🌿', fact: 'Mint plants can talk to each other using smell! They release scents that warn nearby herbs about insects.', question: 'What do Mint plants use to warn nearby herbs about insects?', answer: 'Smell / Scents' },
    { emoji: '🌿', fact: 'Some herbs like basil actually chase away mosquitoes better than some sprays.', question: 'Which herb is noted for chasing away mosquitoes better than sprays?', answer: 'Basil' },
    { emoji: '🌿', fact: 'Coriander seeds can fly! Their round shape lets them roll or bounce far in the wind.', question: 'How do round Coriander seeds "fly"?', answer: 'They roll or bounce far in the wind' },
    { emoji: '🌿', fact: 'Certain herbs like oregano and thyme are antibacterial — they can kill tiny germs on their leaves!', question: 'What specific property do Oregano and Thyme share that kills germs?', answer: 'Antibacterial' },
    { emoji: '🌿', fact: 'A herb called “touch-me-not” (Mimosa) folds its leaves instantly when touched — like it’s shy.', question: 'What does the Mimosa plant do instantly when touched?', answer: 'Folds its leaves' },
    // SHRUBS (🌱)
    { emoji: '🌱', fact: 'Some shrubs like bougainvillea have flowers that aren’t really flowers — the bright colours are fake petals!', question: 'In Bougainvillea, what are the bright colors referred to as?', answer: 'Fake petals' },
    { emoji: '🌱', fact: 'The hibiscus flower can change its color during the day depending on sunlight and temperature.', question: 'What causes the Hibiscus flower to change its color during the day?', answer: 'Sunlight and temperature' },
    { emoji: '🌱', fact: 'Many shrubs grow into shapes naturally — some look like perfect balls or domes without trimming.', question: 'What shapes do some shrubs naturally grow into without trimming?', answer: 'Perfect balls or domes' },
    { emoji: '🌱', fact: 'Some shrubs have hollow stems where tiny insects live like in an apartment building.', question: 'What part of some shrubs acts like an "apartment building" for tiny insects?', answer: 'Hollow stems' },
    { emoji: '🌱', fact: 'The leaves of rosemary shrubs contain oils that stay fragrant for years, even after drying.', question: 'What substance in Rosemary leaves keeps them fragrant for years?', answer: 'Oils' },
    // TREES (🌳)
    { emoji: '🌳', fact: 'Trees can send food and nutrients to sick or weak trees through underground root networks — like sharing lunch!', question: 'How do trees "share lunch" with weak neighbors?', answer: 'Through underground root networks' },
    { emoji: '🌳', fact: 'The rain sound changes depending on which tree it falls on — pine trees make soft rain sounds while banyan trees make louder ones.', question: 'Which tree makes a soft rain sound, according to the facts?', answer: 'Pine trees' },
    { emoji: '🌳', fact: 'Some trees can “walk”! Coconut and mangrove trees grow new roots on one side, slowly shifting position over time.', question: 'Which process allows Coconut and Mangrove trees to "walk"?', answer: 'Growing new roots on one side' },
    { emoji: '🌳', fact: 'The dragon blood tree has red sap that looks like real blood — it was used as ink in ancient times.', question: 'What was the red sap of the Dragon Blood tree used for in ancient times?', answer: 'Ink' },
    { emoji: '🌳', fact: 'A single large tree can provide a home for over 1,000 different species — insects, birds, moss, mushrooms, frogs, and even other plants live on it.', question: 'Approximately how many species can a single large tree provide a home for?', answer: 'Over 1,000' }
];


// --- fact display logic ---

/**
 * changes the displayed fact
 * @param {number} direction 
 */
function changeFact(direction) {
    if (quizActive) return; 
    const numFacts = factData.length;

    currentFactIndex = (currentFactIndex + direction + numFacts) % numFacts;

    displayFact(currentFactIndex);
}

/**
 * updates the fact card display based on the given index.
 * @param {number} index 
 */
function displayFact(index) {
    const factObject = factData[index];

    document.getElementById("factTitle").innerText = `${factObject.emoji} Fun Fact (${index + 1}/${factData.length})`;
    document.getElementById("factContent").innerText = factObject.fact;
}

// --- quiz game logic ---

/**
 * starts the quiz by validating input and opening the modal.
 */
function startQuiz() {
    let name = document.getElementById("name").value.trim();
    let bottles = Number(document.getElementById("bottles").value);

    if (name === "" || bottles <= 0 || isNaN(bottles)) {
        alert("Enter a valid name and number of bottles!");
        return;
    }

    // store input temporarily
    pendingEntry = { name: name, bottles: bottles };
    quizActive = true;

    setupQuiz();
    document.getElementById("quizModal").style.display = "block";
}

/**
 * random quiz question based on the facts
 */
function setupQuiz() {
    // select the correct fact/question randomly
    const correctFactIndex = Math.floor(Math.random() * factData.length);
    correctFact = factData[correctFactIndex];

    const questionElement = document.getElementById("quizQuestion");
    const optionsElement = document.getElementById("quizOptions");
    const messageElement = document.getElementById("quizMessage");
    const continueButton = document.getElementById("quizContinueButton");

    questionElement.innerText = correctFact.question;
    optionsElement.innerHTML = '';
    messageElement.innerText = '';
    messageElement.className = 'message';
    continueButton.style.display = 'none';

    // option list (3 incorrect + 1 correct)
    let options = [];
    const incorrectIndices = new Set();

    while (incorrectIndices.size < 3) {
        let randomIncorrectIndex = Math.floor(Math.random() * factData.length);
        if (randomIncorrectIndex !== correctFactIndex && !incorrectIndices.has(randomIncorrectIndex)) {
            incorrectIndices.add(randomIncorrectIndex);
            options.push({ text: factData[randomIncorrectIndex].answer, isCorrect: false });
        }
    }

    // add the correct answer
    options.push({ text: correctFact.answer, isCorrect: true });

    // shuffle the options
    options.sort(() => Math.random() - 0.5);

    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.innerText = option.text;
        button.onclick = () => checkAnswer(button, option.isCorrect);
        optionsElement.appendChild(button);
    });
}

/**
 * checks the answer and provides feedback.
 * @param {HTMLElement} selectedButton 
 * @param {boolean} isCorrect 
 */
function checkAnswer(selectedButton, isCorrect) {
    if (!quizActive) return;

    const messageElement = document.getElementById("quizMessage");
    const options = document.querySelectorAll('.quiz-option');
    const continueButton = document.getElementById("quizContinueButton");

    options.forEach(btn => {
        btn.disabled = true;
        btn.onclick = null; 
        if (btn.innerText === correctFact.answer) {
            btn.classList.add('correct');
        }
    });

    if (isCorrect) {
        selectedButton.classList.add('correct');
        messageElement.innerText = '✅ Correct! Points earned.';
        messageElement.classList.add('correct');
        continueButton.innerText = 'Verify Entry & Add Points';
        continueButton.onclick = continueEntry;
    } else {
        selectedButton.classList.add('incorrect');
        messageElement.innerText = `❌ Incorrect! You must answer correctly to log your refill. The correct answer was: ${correctFact.answer}`;
        messageElement.classList.add('incorrect');
        continueButton.innerText = 'Try Again (Close & Re-enter)';
        continueButton.onclick = closeQuizModal;
    }
    
    continueButton.style.display = 'block';
    quizActive = false; 
}

//continue taking questions
function continueEntry() {
    if (!pendingEntry.name) return;
    
    if (document.getElementById('quizMessage').innerText.includes('Correct')) {
        addEntryAndPoints(pendingEntry.name, pendingEntry.bottles);
    }
    
    closeQuizModal();
}

/**
 * function to add the entry and update the points.
 * @param {string} name
 * @param {number} bottles
 */
function addEntryAndPoints(name, bottles) {
    // each bottle = 1 point
    totalPoints += bottles;
    document.getElementById("total").innerText = totalPoints;

    // convert points to rewards 
    let points = totalPoints;

    let trees = Math.floor(points / 6);
    points = points % 6;

    let shrubs = Math.floor(points / 4);
    points = points % 4;

    let herbs = Math.floor(points / 2);

    document.getElementById("herbs").innerText = herbs;
    document.getElementById("shrubs").innerText = shrubs;
    document.getElementById("trees").innerText = trees;

    // show entry
    let list = document.getElementById("list");
    list.innerHTML += `
        <div class="entry">
            ✅ <b>${name}</b> refilled <b>${bottles}</b> bottles 
            → earned <b>${bottles} Green Points</b>
        </div>
    `;

    // resetdata
    document.getElementById("name").value = "";
    document.getElementById("bottles").value = "";
}


function closeQuizModal() {
    document.getElementById("quizModal").style.display = "none";
    quizActive = false;
    pendingEntry = {};
    // if incorrect, clear the input fields
    const message = document.getElementById('quizMessage').innerText;
    if (message.includes('Incorrect')) {
        document.getElementById("name").value = "";
        document.getElementById("bottles").value = "";
    }
}
