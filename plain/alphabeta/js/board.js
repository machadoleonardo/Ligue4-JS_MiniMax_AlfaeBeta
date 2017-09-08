/**
 * Creates an instance of Board.
 * 
 * @constructor
 * @this {Board}
 * @param {Game} game The main-game object. 
 * @param {array} field The field containing our situation.
 * @param {number} player The current player.
 */
function Board(game, field, player) {
    this.game = game
    this.field = field;
    this.player = player;
}

/**
 * Determines if situation is finished.
 *
 * @param {number} profundidade
 * @param {number} pontuacao
 * @return {boolean}
 */
Board.prototype.isFinished = function(profundidade, pontuacao) {
    if (profundidade == 0 || pontuacao == this.game.pontuacao || pontuacao == -this.game.pontuacao || this.isFull()) {
        return true;
    }
    return false;
}

/**
 * Place in current board.
 *
 * @param {number} coluna
 * @return {boolean} 
 */
Board.prototype.place = function(coluna) {
    // Check if coluna valid
    // 1. not empty 2. not exceeding the board size
    if (this.field[0][coluna] == null && coluna >= 0 && coluna < this.game.colunas) {
        // Bottom to top
        for (var y = this.game.rows - 1; y >= 0; y--) {
            if (this.field[y][coluna] == null) {
                this.field[y][coluna] = this.player; // Set current player coin
                break; // Break from loop after inserting
            }
        }
        this.player = this.game.switchRound(this.player);
        return true;
    } else {
        return false;
    }
}

/**
 * Return a pontuacao for various positions (either horizontal, vertical or diagonal by moving through our board).
 *
 * @param {number} row
 * @param {number} coluna
 * @param {number} delta_y
 * @param {number} delta_x
 * @return {number}
 */
Board.prototype.pontuacaoPosition = function(row, coluna, delta_y, delta_x) {
    var human_points = 0;
    var computer_points = 0;

    // Save winning positions to arrays for later usage
    this.game.winning_array_human = [];
    this.game.winning_array_cpu = [];

    // Determine pontuacao through amount of available chips
    for (var i = 0; i < 4; i++) {
        if (this.field[row][coluna] == 0) {
            this.game.winning_array_human.push([row, coluna]);
            human_points++; // Add for each human chip
        } else if (this.field[row][coluna] == 1) {
            this.game.winning_array_cpu.push([row, coluna]);
            computer_points++; // Add for each computer chip
        }

        // Moving through our board
        row += delta_y;
        coluna += delta_x;
    }

    // Marking winning/returning pontuacao
    if (human_points == 4) {
        this.game.winning_array = this.game.winning_array_human;
        // Computer won (100000)
        return -this.game.pontuacao;
    } else if (computer_points == 4) {
        this.game.winning_array = this.game.winning_array_cpu;
        // Human won (-100000)
        return this.game.pontuacao;
    } else {
        // Return normal points
        return computer_points;
    }
}

/**
 * Returns the overall pontuacao for our board.
 *
 * @return {number}
 */
Board.prototype.pontuacao = function() {
    var points = 0;

    var vertical_points = 0;
    var horizontal_points = 0;
    var diagonal_points1 = 0;
    var diagonal_points2 = 0;

    // Board-size: 7x6 (height x width)
    // Array indices begin with 0
    // => e.g. height: 0, 1, 2, 3, 4, 5

    // Vertical points
    // Check each coluna for vertical pontuacao
    // 
    // Possible situations
    //  0  1  2  3  4  5  6
    // [x][ ][ ][ ][ ][ ][ ] 0
    // [x][x][ ][ ][ ][ ][ ] 1
    // [x][x][x][ ][ ][ ][ ] 2
    // [x][x][x][ ][ ][ ][ ] 3
    // [ ][x][x][ ][ ][ ][ ] 4
    // [ ][ ][x][ ][ ][ ][ ] 5
    for (var row = 0; row < this.game.rows - 3; row++) {
        // Für jede Column überprüfen
        for (var coluna = 0; coluna < this.game.colunas; coluna++) {
            // Die Column bewerten und zu den Punkten hinzufügen
            var pontuacao = this.pontuacaoPosition(row, coluna, 1, 0);
            if (pontuacao == this.game.pontuacao) return this.game.pontuacao;
            if (pontuacao == -this.game.pontuacao) return -this.game.pontuacao;
            vertical_points += pontuacao;
        }            
    }

    // Horizontal points
    // Check each row's pontuacao
    // 
    // Possible situations
    //  0  1  2  3  4  5  6
    // [x][x][x][x][ ][ ][ ] 0
    // [ ][x][x][x][x][ ][ ] 1
    // [ ][ ][x][x][x][x][ ] 2
    // [ ][ ][ ][x][x][x][x] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (var row = 0; row < this.game.rows; row++) {
        for (var coluna = 0; coluna < this.game.colunas - 3; coluna++) { 
            var pontuacao = this.pontuacaoPosition(row, coluna, 0, 1);   
            if (pontuacao == this.game.pontuacao) return this.game.pontuacao;
            if (pontuacao == -this.game.pontuacao) return -this.game.pontuacao;
            horizontal_points += pontuacao;
        } 
    }



    // Diagonal points 1 (left-bottom)
    //
    // Possible situation
    //  0  1  2  3  4  5  6
    // [x][ ][ ][ ][ ][ ][ ] 0
    // [ ][x][ ][ ][ ][ ][ ] 1
    // [ ][ ][x][ ][ ][ ][ ] 2
    // [ ][ ][ ][x][ ][ ][ ] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (var row = 0; row < this.game.rows - 3; row++) {
        for (var coluna = 0; coluna < this.game.colunas - 3; coluna++) {
            var pontuacao = this.pontuacaoPosition(row, coluna, 1, 1);
            if (pontuacao == this.game.pontuacao) return this.game.pontuacao;
            if (pontuacao == -this.game.pontuacao) return -this.game.pontuacao;
            diagonal_points1 += pontuacao;
        }            
    }

    // Diagonal points 2 (right-bottom)
    //
    // Possible situation
    //  0  1  2  3  4  5  6
    // [ ][ ][ ][x][ ][ ][ ] 0
    // [ ][ ][x][ ][ ][ ][ ] 1
    // [ ][x][ ][ ][ ][ ][ ] 2
    // [x][ ][ ][ ][ ][ ][ ] 3
    // [ ][ ][ ][ ][ ][ ][ ] 4
    // [ ][ ][ ][ ][ ][ ][ ] 5
    for (var row = 3; row < this.game.rows; row++) {
        for (var coluna = 0; coluna <= this.game.colunas - 4; coluna++) {
            var pontuacao = this.pontuacaoPosition(row, coluna, -1, +1);
            if (pontuacao == this.game.pontuacao) return this.game.pontuacao;
            if (pontuacao == -this.game.pontuacao) return -this.game.pontuacao;
            diagonal_points2 += pontuacao;
        }

    }

    points = horizontal_points + vertical_points + diagonal_points1 + diagonal_points2;
    return points;
}

/**
 * Determines if board is full.
 *
 * @return {boolean}
 */
Board.prototype.isFull = function() {
    for (var i = 0; i < this.game.colunas; i++) {
        if (this.field[0][i] == null) {
            return false;
        }
    }
    return true;
}

/**
 * Returns a copy of our board.
 *
 * @return {Board}
 */
Board.prototype.copy = function() {
    var new_board = new Array();
    for (var i = 0; i < this.field.length; i++) {
        new_board.push(this.field[i].slice());
    }
    return new Board(this.game, new_board, this.player);
}
