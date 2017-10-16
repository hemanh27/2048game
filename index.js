var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');

var scoreLabel = document.getElementById('score-title');
var message = document.getElementById('message');
var score = 0;
var size = 4;
var width = canvas.width / size - 6;
console.log(width);
var blocks = [];
var fontSize;
var loss = false;

startGame();

function block(row, coll) {
    this.value = 0;
    this.x = coll * width + 5 * (coll + 1);
    console.log(this.x);
    this.y = row * width + 5 * (row + 1);
    console.log(this.y);
}

function createBlocks() {
    var i, j;
    for(i = 0; i < size; i++) {
        blocks[i] = [];
        for(j = 0; j < size; j++) {
            blocks[i][j] = new block(i, j);
        }
    }
}

function drawBlock(block) {
    ctx.beginPath();
    ctx.rect(block.x, block.y, width, width);
    switch (block.value){
        case 0 : ctx.fillStyle = '#A9A9A9'; break;
        case 2 : ctx.fillStyle = '#D2691E'; break;
        case 4 : ctx.fillStyle = '#FF7F50'; break;
        case 8 : ctx.fillStyle = '#ffbf00'; break;
        case 16 : ctx.fillStyle = '#bfff00'; break;
        case 32 : ctx.fillStyle = '#40ff00'; break;
        case 64 : ctx.fillStyle = '#00bfff'; break;
        case 128 : ctx.fillStyle = '#FF7F50'; break;
        case 256 : ctx.fillStyle = '#0040ff'; break;
        case 512 : ctx.fillStyle = '#ff0080'; break;
        case 1024 : ctx.fillStyle = '#D2691E'; break;
        case 2048 : ctx.fillStyle = '#FF7F50'; break;
        default : ctx.fillStyle = '#ff0080';
    }
    ctx.fill();
    if (block.value) {
        fontSize = width/2;
        ctx.font = fontSize + 'px Tahoma';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(block.value, block.x + width / 2, block.y + width / 2 + width/7);
    }
}

function canvasClean() {
    ctx.clearRect(0, 0, 500, 500);
}

document.onkeydown = function (event) {
    if (!loss) {
        if (event.keyCode === 38 || event.keyCode === 87) {
            moveUp();
        } else if (event.keyCode === 39 || event.keyCode === 68) {
            moveRight();
        } else if (event.keyCode === 40 || event.keyCode === 83) {
            moveDown();
        } else if (event.keyCode === 37 || event.keyCode === 65) {
            moveLeft();
        }
        scoreLabel.innerHTML = 'Score : ' + score;
    }
}

function startGame() {
    createBlocks();
    drawAllBlocks();
    pasteNewBlock();
    pasteNewBlock();
}

function finishGame() {
    message.innerHTML='No more moves left';
	canvas.style.opacity = '0.5';
	loss = true;
}

function drawAllBlocks() {
    var i, j;
    for(i = 0; i < size; i++) {
        for(j = 0; j < size; j++) {
            drawBlock(blocks[i][j]);
        }
    }
}

function pasteNewBlock() {
    var countFree = 0;
    var i, j;
    for(i = 0; i < size; i++) {
        for(j = 0; j < size; j++) {
            if(!blocks[i][j].value) {
                countFree++;
            }
        }
    }
    if(!countFree) {
        finishGame();
        return;
    }
    while(true) {
        var row = Math.floor(Math.random() * size);
        var coll = Math.floor(Math.random() * size);
        if(!blocks[row][coll].value) {
            blocks[row][coll].value = 2 * Math.ceil(Math.random() * 2);
            drawAllBlocks();
            return;
        }
    }
}

function moveRight() {
    var i, j;
    var coll;
    for(i = 0; i < size; i++) {
        for(j = size - 2; j >= 0; j--) {
            if(blocks[i][j].value) {
                coll = j;
                while (coll + 1 < size) {
                    if (!blocks[i][coll + 1].value) {
                        blocks[i][coll + 1].value = blocks[i][coll].value;
                        blocks[i][coll].value = 0;
                        coll++;
                    } else if (blocks[i][coll].value == blocks[i][coll + 1].value) {
                        blocks[i][coll + 1].value *= 2;
                        score +=  blocks[i][coll + 1].value;
                        blocks[i][coll].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewBlock();
}

function moveLeft() {
    var i, j;
    var coll;
    for(i = 0; i < size; i++) {
        for(j = 1; j < size; j++) {
            if(blocks[i][j].value) {
                coll = j;
                while (coll - 1 >= 0) {
                    if (!blocks[i][coll - 1].value) {
                        blocks[i][coll - 1].value = blocks[i][coll].value;
                        blocks[i][coll].value = 0;
                        coll--;
                    } else if (blocks[i][coll].value == blocks[i][coll - 1].value) {
                        blocks[i][coll - 1].value *= 2;
                        score +=   blocks[i][coll - 1].value;
                        blocks[i][coll].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewBlock();
}

function moveUp() {
    var i, j, row;
    for(j = 0; j < size; j++) {
        for(i = 1; i < size; i++) {
            if(blocks[i][j].value) {
                row = i;
                while (row > 0) {
                    if(!blocks[row - 1][j].value) {
                        blocks[row - 1][j].value = blocks[row][j].value;
                        blocks[row][j].value = 0;
                        row--;
                    } else if (blocks[row][j].value == blocks[row - 1][j].value) {
                        blocks[row - 1][j].value *= 2;
                        score +=  blocks[row - 1][j].value;
                        blocks[row][j].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewBlock();
}

function moveDown() {
    var i, j, row;
    for(j = 0; j < size; j++) {
        for(i = size - 2; i >= 0; i--) {
            if(blocks[i][j].value) {
                row = i;
                while (row + 1 < size) {
                    if (!blocks[row + 1][j].value) {
                        blocks[row + 1][j].value = blocks[row][j].value;
                        blocks[row][j].value = 0;
                        row++;
                    } else if (blocks[row][j].value == blocks[row + 1][j].value) {
                        blocks[row + 1][j].value *= 2;
                        score +=  blocks[row + 1][j].value;
                        blocks[row][j].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewBlock();
}