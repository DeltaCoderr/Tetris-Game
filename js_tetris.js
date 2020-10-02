var fps = 7.5;
var W = 432;
var H = 528;
var X = 0;
var Y = 0;
ITER = 0;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, 432, 528);

var canvasData = ctx.getImageData(0, 0, 432, 528);
ctx.putImageData(canvasData, 0, 0);

var gameStatus = {
    points: 0,
    fps: 7.5,
    boardW: 432,
    boardH: 528
}


var keyPresses = [0];

var storedFunctions = [];

var tetro = {
    position: { x: (W - 48) / 2, y: 0 },
    boundaryPoints: [[18, 36, 54, { x: 24, y: 48 }, { x: 48, y: 48 }], [48, 48, 48]]
}

//Creates a new tetro piece
function Tetro(imgSrc, xBound1, yBound1, xBound2, yBound2, xBound3, yBound3) {
    this.image = new Image();
    this.image.src = imgSrc,
        this.boundaryPoints = [xBound1, yBound1, xBound2, yBound2, xBound3, yBound3]
}

//All possible pieces the player can use
var tetroO = new Tetro("images/tetro_o.png", 12, 48, 36, 48, 36, 48);
var tetroT = new Tetro("images/tetro_t.png", 12, 48, 36, 48, 60, 48);
var tetroT1 = new Tetro("images/tetro_t1.png", 12, 48, 36, 72, 36, 72);
var tetroT2 = new Tetro("images/tetro_t2.png", 12, 24, 36, 48, 60, 24);
var tetroT3 = new Tetro("images/tetro_t3.png", 12, 72, 36, 48, 36, 48);
var tetroI = new Tetro("images/tetro_i.png", 12, 96, 12, 96, 12, 96);
var tetroI1 = new Tetro("images/tetro_i1.png", 12, 24, 36, 24, 84, 24);
var tetroJ = new Tetro("images/tetro_j.png", 12, 48, 36, 48, 60, 48);
var tetroJ1 = new Tetro("images/tetro_j1.png", 12, 72, 36, 72, 12, 72);
var tetroJ2 = new Tetro("images/tetro_j2.png", 12, 24, 36, 24, 60, 48);
var tetroJ3 = new Tetro("images/tetro_j3.png", 12, 72, 36, 24, 36, 24);
var tetroL = new Tetro("images/tetro_l.png", 12, 48, 36, 48, 60, 48);
var tetroL1 = new Tetro("images/tetro_l1.png", 12, 24, 36, 72, 36, 72);
var tetroL2 = new Tetro("images/tetro_l2.png", 12, 48, 36, 24, 60, 24);
var tetroL3 = new Tetro("images/tetro_l3.png", 12, 72, 36, 72, 36, 72);
var tetroZ = new Tetro("images/tetro_z.png", 12, 24, 36, 48, 60, 48);
var tetroZ1 = new Tetro("images/tetro_z1.png", 12, 72, 36, 48, 36, 48);
var tetroS = new Tetro("images/tetro_s.png", 12, 48, 36, 48, 60, 24);
var tetroS1 = new Tetro("images/tetro_s1.png", 12, 48, 36, 72, 36, 72);

//The piece the player is holding right now
var currTetro = new Tetro("images/tetro_o.png", 12, 48, 36, 48, 36, 48)

function rotateTetro() { //Rotates the tetro piece that the player is controlling
    switch (currTetro) {
        case tetroJ: 
            currTetro = tetroJ1; //Rotate to left
            break
        case tetroJ1:
            currTetro = tetroJ2;
            break
        case tetroJ2:
            currTetro = tetroJ3;
            break
        case tetroJ3:
            currTetro = tetroJ;
            break
        case tetroT:
            currTetro = tetroT1;
            break
        case tetroT1:
            currTetro = tetroT2;
            break
        case tetroT2:
            currTetro = tetroT3;
            break
        case tetroT3:
            currTetro = tetroT;
            break
        case tetroI:
            currTetro = tetroI1;
            break
        case tetroI1:
            currTetro = tetroI;
            break
        case tetroL:
            currTetro = tetroL1;
            break
        case tetroL1:
            currTetro = tetroL2;
            break
        case tetroL2:
            currTetro = tetroL3;
            break
        case tetroL3:
            currTetro = tetroL;
            break
        case tetroS:
            currTetro = tetroS1;
            break
        case tetroS1:
            currTetro = tetroS;
            break
        case tetroZ:
            currTetro = tetroZ1;
            break
        case tetroZ1:
            currTetro = tetroZ;
            break
    }
}

function drawCanvas() { //Draws the canvas with the last frame data
    ctx.putImageData(canvasData, 0, 0);
}

function copyCanvas() { //Copies to a variable the canvas the data had
    canvasData = ctx.getImageData(0, 0, 432, 528);
}


function drawTetro(tetro, xpos, ypos) { //Draws the tetro in the canvas
    ctx.drawImage(tetro, xpos, ypos);
}

function detectCollision() { //Detect if the piece has colided with another piece or the bottom
    getHitInfo();
    if (tetro.position.y + currTetro.image.height == H || (currTetro.hit1.data[0] != 0 || currTetro.hit2.data[1] != 0 || currTetro.hit3.data[0] != 0)) {
        rowCheck();
        resetTetro();
        copyCanvas();
        ITER++;
    }
}

function rowCheck() { //Checks all the rows
    var imgDataArray = [[],
    [],
    [],
    [],
    [],
    [],
    []];

    var positionArray = [516, 492, 468, 444, 420, 396, 372];

    for (var j = 0; j < positionArray.length; j++) {
        for (var x = 12; x < 420; x += 24) {
            var imgData = ctx.getImageData(x, positionArray[j], 1, 1);
            imgDataArray[j].push(imgData);
        }
    }

    for (var m = 0; m < imgDataArray.length; m++) {
        var rowChecked = checkRows(m, imgDataArray);
        if (rowChecked == true) {//If any of the rows are filled
            clearRow(m); //Clear them
        }
    }

}

function checkRows(row, imgDataArray) { //Checks if the row is filled
    for (var i = 0; i < imgDataArray[row].length; i++) {
        if (imgDataArray[row][i].data[0] == 0 && imgDataArray[row][i].data[1] == 0 && imgDataArray[row][i].data[2] == 0) {
            return false; //Not filled
        }
    }
    return true; //Filled
}

function clearRow(row) { //Clears a row
    var arrayRow = [504, 480, 456, 432, 408, 384, 360];
    var savedCanvas = ctx.getImageData(0, 0, W, arrayRow[row]);
    ctx.putImageData(savedCanvas, 0, 24);
    gameStatus.points += 100;
    var score = document.getElementById("score");
    score.innerHTML = "SCORE: " + gameStatus.points;
}

function resetTetro() { //After the tetro is place
    tetro.position.y = 0; //Move to the starting y
    currTetro = randomizeTetro(); //Get a new piece
    tetro.position.x = (W - 48) / 2; //Move to the starting x
}


function gameOver() {
    //Draws a game over message
    ctx.font = "50px Tahoma";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "White";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);

    clearInterval(game); //End the game
}

function checkGameOver() { //Checks if the player has lost
    getHitInfo();
    if (
        tetro.position.y + currTetro.image.height == H || 
        (currTetro.hit1.data[0] != 0 || currTetro.hit2.data[1] !=0 || currTetro.hit3.data[0] != 0)
        ) {
        gameOver(); //End he game
    }
}

var storedT = [ tetroO, tetroI, tetroJ, tetroL, tetroT, tetroZ, tetroS ];

function randomizeTetro() {
    //return storedT[1];
    var randomTetro = Math.floor(Math.random() * 7); //Gets a random number
    return storedT[randomTetro];//Gets a new piece based on the index of the piece and the random number
}

function updateGameState() { //Update the game state
    drawCanvas(); //Creates a new frame
    copyCanvas(); //Copies the last frame to the new frame
    tetro.position.y += 12; //The tetris piece goes down one row
    moveX(); //When pressed right add x posistion, when pressed left subtract x position
    drawTetro(currTetro.image, tetro.position.x, tetro.position.y); //Draws the players tetro
    detectCollision(); //Detect any collision at the players tetro
    checkGameOver(); //Detect if the player piece has hit the height limit
}

function getHitInfo() {
    currTetro.hit1 = ctx.getImageData(tetro.position.x+currTetro.boundaryPoints[0],tetro.position.y+currTetro.boundaryPoints[1]+1,1,1);
    currTetro.hit2 = ctx.getImageData(tetro.position.x+currTetro.boundaryPoints[2],tetro.position.y+currTetro.boundaryPoints[3]+1,1,1);
    currTetro.hit3 = ctx.getImageData(tetro.position.x+currTetro.boundaryPoints[4],tetro.position.y+currTetro.boundaryPoints[5]+1,1,1)   
}

function moveX() {//Moves the player piece left or right
    tetro.position.x += keyPresses[0];
    tetro.position.x = Math.max(0, Math.min(tetro.position.x, (W - currTetro.image.width)));
    keyPresses.unshift(0);
}

function dropDownTetro() { //Drops the tetro piece faster
    while (tetro.position.y != 0) { //While the piece didnt hit the bottom
        tetro.position.y += 12; //Go down
        getHitInfo();

        if (tetro.position.y + currTetro.image.height == H ||
            (currTetro.hit1.data[0] != 0 || currTetro.hit2.data[1] != 0 || currTetro.hit3.data[0] != 0)) {
            drawCanvas(); //Draw the frame
            drawTetro(currTetro.image, tetro.position.x, tetro.position.y); //Draw the players piece
            rowCheck(); //Checks if any rows are filled
            copyCanvas(); //Gets the last frame
            resetTetro(); //Move player back to start and creates a new piece
            ITER++;
        }
    }
}

function storeKey(ev) { //Stores what keys where pressed to make the player piece move later
    arrows = ((ev.which)) || ((ev.keyCode));

    switch (arrows) { //In case the arrow is
        case 32: //Down
            dropDownTetro(); //Make the piece fall faster
        case 37: //Left
            keyPresses.unshift(-24);
            break;
        case 38://Up
            rotateTetro(); //Rotate the piece
            break;
        case 39://Right
            keyPresses.unshift(24);
            break;
        case 40: //Space bar
            tetro.position.y += 12; //Send to the bottom???
            break;
    }
}

/* START GAME */
//Starts the game and updates the frame every (exmaple: fps = 7.5, 1000 / 7.5 = 133.34 seconds)
var game = setInterval(updateGameState, 1000 / fps);