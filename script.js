// variable declare
const cells = document.querySelectorAll(".cell");
const chooseX = document.getElementById("X");
const chooseO = document.getElementById("O");
let status = document.querySelector("#status");
let yourScore = document.querySelector("#yourScore");
let cpuScore = document.querySelector("#cpuScore");
const playerTurnStatus =  `It's <span class="boldStatus">your</span> move`;
const cpuTurnStatus =  `It's <span class="boldStatus">cpu's</span> move`;
const reset = document.getElementById("reset");
let boardArray = [];
let playerTurn = true;
let startGame = false;
let xoro = 0; // choosenChar
let movesCount = 0;
let check = 0;
let yourScoreCount = 0;
let cpuScoreCount = 0;
let player;
let cpu;
let decide;
let winningLine;

const winningCells = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let playersCells = [];
let cpusCells = [];
let checkCells;

// loops and event listeners
reset.addEventListener("click", resetScores);
cells.forEach(cell => cell.addEventListener("click", setChar));
cells.forEach(cell => cell.addEventListener("mouseenter", ghostChar));
cells.forEach(cell => cell.addEventListener("mouseleave", clearChar));


// on a new game reset
function newGame() {
    cells.forEach(function(cell) {
        cell.innerHTML = "";
        cell.classList.remove("taken");
    }); 
    status.innerHTML = `<span style="color: #ddd; font-weight: 400; ">Choose .... </span><span id="chooseX" onclick="chooseXorO(this.innerText)">X</span> or <span id="chooseO" onclick="chooseXorO(this.innerText)">O</span> ?`;
    startGame = false;
    playerTurn = true;
    movesCount = 0;
    count = 0;
    playersCells = [];
    cpusCells = [];
    checkCells = "";
}
newGame();

// choose X or O and set to xoro;
function chooseXorO(choosen) {
    if (choosen == "X" ? (xoro = 0, player = "X", cpu = "O") : (xoro =1, player = "O", cpu = "X"));
    status.innerHTML = playerTurnStatus;
    startGame = true;
}

// set char to a cell if not taken
function setChar() {
    //check game is not over
     let gameOver = isGameOver();
    if (gameOver) {return false;};

    if (!this.classList.contains("taken") && startGame == 1 && playerTurn == true) {
        this.innerHTML = `<p class="${player}">${player}</p>`
        this.classList.add("taken");
        playerTurn = false;
        movesCount++;
        playersCells.push(parseInt(this.dataset.value));
        lastMove = parseInt(this.dataset.value);
        check = 0;      
        cpuMove();
    }
}

// place a ghost char in cell on hover
function ghostChar() {
    if (!this.classList.contains("taken") && startGame == 1) {
        this.innerHTML = `<p class="ghost">${player}</p>`;
    }
}

// remove the ghost char on mouseleave
function clearChar() {
    if (!this.classList.contains("taken")) {
        this.innerHTML = "";
    }
}

function cpuMove() {

     //check game is not over
    let gameOver = isGameOver();
    if (gameOver) {return false;};
    status.innerHTML = cpuTurnStatus;

    let pickCell = "";
    let found = false;
    let isZero = lastMove % 2;

    // step 0 - if cpus move choose the center
    if (movesCount == 0) {
        pickCell = 4;
        found = true;
    }

    // step 1 - decide first move
    if (movesCount == 1) {
        found = true;
        // started with a corner
        if (isZero != 0 && !lastMove == 4) {
            // pick the center
            pickCell = 4;
        }
        // started with the center
        else if (lastMove == 4) {
            // pick a random corner
            let arr = [0,2,6,8];
            do {
                pickCell = Math.floor(Math.random() * 9);
            }
            while (!arr.includes(pickCell));
        }
        // started with an edge
        else {
            // pick the center
            pickCell = 4;
        }
    }

    // step 2 - attack
    if (movesCount > 1) {

        pickCell = 4;
        let count = 0;

        for (let i = 0; i < winningCells.length; i++) {

            for (let j = 0; j < cpusCells.length; j++) {
                let cur = cpusCells[j];
                if (winningCells[i].includes(cur)) {
                    count++;
                }
            }

            if (count == 2) {
                winningLine = winningCells[i];
                // go for the win
                for (let i = 0; i < winningLine.length; i++) {
                    if(!cpusCells.includes(winningLine[i])) {
                        pickCell = winningLine[i];
                        found = true;
                        //console.log("attack");
                        // dont choose a taken cell
                        if(cells[pickCell].classList.contains("taken")) {
                            continue;
                        }
                        else {
                            break;
                        }
                    }
                } 
            }
            count = 0;
        }
    }  

    // dont choose a taken cell
    if (cells[pickCell].classList.contains("taken")) {
        found = false;
    }
    
    // step 3 - block
    if (movesCount > 1 &&  found == false) {

        let count = 0;

        for (let i = 0; i < winningCells.length; i++) {

            for (let j = 0; j < playersCells.length; j++) {
                let cur = playersCells[j];
                if (winningCells[i].includes(cur)) {
                    count++;
                }
            }

            if (count == 2) {
                winningLine = winningCells[i];
                // block the win
                for (let i = 0; i < winningLine.length; i++) {
                    if(!playersCells.includes(winningLine[i])) {
                        pickCell = winningLine[i];
                        found = true;
                        // console.log("block");
                        // dont choose a taken cell
                        if(cells[pickCell].classList.contains("taken")) {
                            continue;
                        }
                        else {
                            break;
                        }
                    }
                } 
            }
            count = 0;
        }
    } 

    // dont choose a taken cell
    if(cells[pickCell].classList.contains("taken")) {
        found = false;
    }

    // if all above fails pick a random cell
    if (found == false) {
        do {
            pickCell = Math.floor(Math.random() * 9);
            // console.log("random");
        }
        while (cells[pickCell].classList.contains("taken"));

    }

    // set timeout and set the cpu char in a cell
    setTimeout(setCpuChar, 500);
    function setCpuChar() {
        cells[pickCell].innerHTML = `<p class="${cpu}">${cpu}</p>`;
        cells[pickCell].classList.add("taken");
        playerTurn = true;
        status.innerHTML = playerTurnStatus;
        movesCount++;
        cpusCells.push(pickCell);
        check = 1;
        found = false;
        isGameOver();
    }
}

function isGameOver() {

    if (check == 0 ? checkCells = playersCells : checkCells = cpusCells);
    let count = 0;
    for (let i = 0; i < winningCells.length; i++) {
        for (let j = 0; j < checkCells.length; j++) {
            if(winningCells[i].includes(checkCells[j])) {
                count++;
            }
        }
        if (count == 3) {
            if (check == 0) {
                status.innerHTML = `You <span class="boldStatus">Won</span> !`;
                yourScoreCount++;
                yourScore.innerHTML = yourScoreCount;
            }
            else {
                status.innerHTML = `You <span class="boldStatus">Lost</span> !`;
                cpuScoreCount++;
                cpuScore.innerHTML = cpuScoreCount;
            }
            setTimeout( newGame, 4000);
            return true;
        }
        else {
            count = 0;
        }
    }
     
    if(movesCount == 9) {
        status.innerHTML = `It's a <span class="boldStatus">Draw</span> !`;
        setTimeout( newGame, 4000);
        return true;
    }

    return false;
}

function resetScores() {
    yourScoreCount = 0;
    yourScore.innerHTML = 0;
    cpuScoreCount = 0;
    cpuScore.innerHTML = 0;
}


