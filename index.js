var config = {
    type: Phaser.AUTO,
    width: 320,
    height: 640,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

pentominoColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
    0xff8000, 0xff0080, 0x00ff80, 0x80ff00, 0x8000ff, 0x0080ff];

pentominoPieces = [[{x: 0, y: -2}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
    [{x: -1, y: 1}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}],
    [{x: -1, y: 1}, {x: 0, y: -2}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}],
    [{x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}],
    [{x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: -2}, {x: 0, y: -1}, {x: 0, y: 0}],
    [{x: -1, y: 0}, {x: 0, y: -2}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 1, y: 0}],
    [{x: -1, y: -1}, {x: -1, y: 1}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}],
    [{x: -2, y: 0}, {x: -1, y: 0}, {x: 0, y: -2}, {x: 0, y: -1}, {x: 0, y: 0}],
    [{x: -1, y: 1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: -1}, {x: 1, y: 0}],
    [{x: -1, y: 0}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 0}],
    [{x: -1, y: 0}, {x: 0, y: -2}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}],
    [{x: -1, y: 1}, {x: 0, y: -1}, {x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: -1}]];

pentominoPieceBottoms = [2, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1];

function Pentomino(type, center) {
    this.type = type;
    this.blocks = pentominoPieces[type];
    this.center = center;

    this.draw = function (blockSize, graphics) {
        graphics.fillStyle(pentominoColors[this.type]);
        for (var i = 0; i < this.blocks.length; i++) {
            graphics.fillRect((this.center.x + this.blocks[i].x) * blockSize + 1,
                (this.center.y + this.blocks[i].y) * blockSize + 1,
                blockSize - 1,
                blockSize - 1);
        }
    };
}

function Tetris(boardWidth, boardHeight) {
    this.currentPiece = null;
    this.board = [];
    for (var i = 0; i < boardWidth; i++) {
        this.board[i] = [];
        for (var j = 0; j < boardHeight; j++) {
            this.board[i][j] = -1;
        }
    }
    this.gameOver = false;

    this.spawnPiece = function () {
        var type = Math.floor(Math.random() * 12);
        this.currentPiece = new Pentomino(type, {
            x: Math.floor(this.board.length / 2),
            y: -1 - pentominoPieceBottoms[type]
        });
    };

    this.spawnPiece();

    this.tick = function () {
        var canFall = true;
        for (var i = 0; i < this.currentPiece.blocks.length; i++) {
            if (this.currentPiece.center.y + this.currentPiece.blocks[i].y + 1 >= 0 &&
                (this.currentPiece.center.y + this.currentPiece.blocks[i].y + 1 >= this.board[0].length ||
                    this.board[this.currentPiece.center.x + this.currentPiece.blocks[i].x]
                        [this.currentPiece.center.y + this.currentPiece.blocks[i].y + 1] !== -1)) {
                canFall = false;
                break;
            }
        }
        if (canFall) {
            this.currentPiece.center.y++;
        } else {
            for (i = 0; i < this.currentPiece.blocks.length; i++) {
                if (this.currentPiece.center.y + this.currentPiece.blocks[i].y < 0) {
                    this.gameOver = true;
                    return;
                }
                this.board[this.currentPiece.center.x + this.currentPiece.blocks[i].x]
                    [this.currentPiece.center.y + this.currentPiece.blocks[i].y] = this.currentPiece.type;
            }
            this.clearRows();
            this.spawnPiece();
        }
    };

    this.clearRows = function () {
        for (var i = this.board[0].length - 1; i >= 0; i--) {
            var isFull = true;
            for (var j = 0; j < this.board.length; j++) {
                if (this.board[j][i] === -1) {
                    isFull = false;
                    break;
                }
            }
            if (isFull) {
                for (var j = 0; j < this.board.length; j++) {
                    for (var k = i; k > 0; k--) {
                        this.board[j][k] = this.board[j][k-1];
                    }
                    this.board[j][0] = -1;
                }
                i--;
            }
        }
    };

    this.moveDown = function () {
        for (var i = 0; i < this.currentPiece.blocks.length; i++) {
            if (this.currentPiece.center.y + this.currentPiece.blocks[i].y + 1 >= 0 &&
                (this.currentPiece.center.y + this.currentPiece.blocks[i].y + 1 >= this.board[0].length ||
                    this.board[this.currentPiece.center.x + this.currentPiece.blocks[i].x]
                        [this.currentPiece.center.y + this.currentPiece.blocks[i].y + 1] !== -1)) {
                return
            }
        }
        this.currentPiece.center.y++;
    };

    this.moveLeft = function () {
        for (var i = 0; i < this.currentPiece.blocks.length; i++) {
            if (this.currentPiece.center.y + this.currentPiece.blocks[i].y >= 0 &&
                (this.currentPiece.center.x + this.currentPiece.blocks[i].x - 1 < 0 ||
                    this.board[this.currentPiece.center.x + this.currentPiece.blocks[i].x - 1]
                        [this.currentPiece.center.y + this.currentPiece.blocks[i].y] !== -1)) {
                return
            }
        }
        this.currentPiece.center.x--;
    };

    this.moveRight = function () {
        for (var i = 0; i < this.currentPiece.blocks.length; i++) {
            if (this.currentPiece.center.y + this.currentPiece.blocks[i].y >= 0 &&
                (this.currentPiece.center.x + this.currentPiece.blocks[i].x + 1 >= this.board.length ||
                    this.board[this.currentPiece.center.x + this.currentPiece.blocks[i].x + 1]
                        [this.currentPiece.center.y + this.currentPiece.blocks[i].y] !== -1)) {
                return
            }
        }
        this.currentPiece.center.x++;
    };

    this.rotateLeft = function () {
        for (var i = 0; i < this.currentPiece.blocks.length; i++) {
            if (this.currentPiece.center.y - this.currentPiece.blocks[i].x >= 0 &&
                (this.currentPiece.center.y - this.currentPiece.blocks[i].x >= this.board[0].length ||
                    this.currentPiece.center.x + this.currentPiece.blocks[i].y < 0 ||
                    this.currentPiece.center.x + this.currentPiece.blocks[i].y >= this.board.length ||
                    this.board[this.currentPiece.center.x + this.currentPiece.blocks[i].y]
                        [this.currentPiece.center.y - this.currentPiece.blocks[i].x] !== -1)) {
                return
            }
        }
        for (i = 0; i < this.currentPiece.blocks.length; i++) {
            var temp = this.currentPiece.blocks[i].x;
            this.currentPiece.blocks[i].x = this.currentPiece.blocks[i].y;
            this.currentPiece.blocks[i].y = -temp;
        }
    };

    this.rotateRight = function () {
        for (var i = 0; i < this.currentPiece.blocks.length; i++) {
            if (this.currentPiece.center.y + this.currentPiece.blocks[i].x >= 0 &&
                (this.currentPiece.center.y + this.currentPiece.blocks[i].x >= this.board[0].length ||
                    this.currentPiece.center.x - this.currentPiece.blocks[i].y < 0 ||
                    this.currentPiece.center.x - this.currentPiece.blocks[i].y >= this.board.length ||
                    this.board[this.currentPiece.center.x - this.currentPiece.blocks[i].y]
                        [this.currentPiece.center.y + this.currentPiece.blocks[i].x] !== -1)) {
                return
            }
        }
        for (i = 0; i < this.currentPiece.blocks.length; i++) {
            var temp = this.currentPiece.blocks[i].x;
            this.currentPiece.blocks[i].x = -this.currentPiece.blocks[i].y;
            this.currentPiece.blocks[i].y = temp;
        }
    };

    this.flip = function () {
        for (var i = 0; i < this.currentPiece.blocks.length; i++) {
            if (this.currentPiece.center.y + this.currentPiece.blocks[i].y >= 0 &&
                (this.currentPiece.center.x - this.currentPiece.blocks[i].x < 0 ||
                    this.currentPiece.center.x - this.currentPiece.blocks[i].x >= this.board.length ||
                    this.board[this.currentPiece.center.x - this.currentPiece.blocks[i].x]
                        [this.currentPiece.center.y + this.currentPiece.blocks[i].y] !== -1)) {
                return
            }
        }
        for (i = 0; i < this.currentPiece.blocks.length; i++) {
            this.currentPiece.blocks[i].x = -this.currentPiece.blocks[i].x;
        }
    };

    this.draw = function (blockSize, graphics) {
        this.currentPiece.draw(blockSize, graphics);
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[0].length; j++) {
                if (this.board[i][j] !== -1) {
                    graphics.fillStyle(pentominoColors[this.board[i][j]]);
                    graphics.fillRect(i * blockSize + 1, j * blockSize + 1, blockSize - 1, blockSize - 1);
                }
            }
        }
    };
}

var tetris, graphics, timer, lastKeyDownTimestamp = -100;

function preload() {

}

function create() {
    tetris = new Tetris(16, 32);

    graphics = this.add.graphics({lineStyle: {color: 0xffffff}});

    timer = this.time.addEvent({delay: 500, callback: tick, loop: true});

    this.input.keyboard.on('keydown', function (event) {
        if (event.timeStamp - 10 > lastKeyDownTimestamp) {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.S) {
                tetris.moveDown();
                lastKeyDownTimestamp = event.timeStamp;
            }
            else if (event.timeStamp - 100 > lastKeyDownTimestamp) {
                if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.A) {
                    tetris.moveLeft();
                    lastKeyDownTimestamp = event.timeStamp;
                }
                else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.D) {
                    tetris.moveRight();
                    lastKeyDownTimestamp = event.timeStamp;
                }
                else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.Q) {
                    tetris.rotateLeft();
                    lastKeyDownTimestamp = event.timeStamp;
                }
                else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.E) {
                    tetris.rotateRight();
                    lastKeyDownTimestamp = event.timeStamp;
                }
                else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.W) {
                    tetris.flip();
                    lastKeyDownTimestamp = event.timeStamp;
                }
            }
        }
    });
}

function update() {
    graphics.clear();

    tetris.draw(config.width / tetris.board.length, graphics);

    graphics.strokeRect(0, 0, config.width, config.height);
}

function tick() {
    tetris.tick();

    if (tetris.gameOver) {
        timer.remove(false);
    }
}
