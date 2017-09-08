/**
 * Creates an instance of Board.
 * 
 * @constructor
 * @this {Board}
 * @param {Game} game The main-game object. 
 * @param {array} field The field containing our situation.
 * @param {numero} player The current player.
 */
function Board(game, field, player) {
    this.game = game
    this.field = field;
    this.player = player;
}

/**
 * Determina se acabou.
 *
 * @param {numero} profundidade
 * @param {numero} pontuacao
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
 * @param {numero} column
 * @return {boolean} 
 */
Board.prototype.place = function(column) {
    // Check if column valid
    // 1. not empty 2. not exceeding the board size
    if (this.field[0][column] == null && column >= 0 && column < this.game.colunas) {
        // Bottom to top
        for (var y = this.game.rows - 1; y >= 0; y--) {
            if (this.field[y][column] == null) {
                this.field[y][column] = this.player; // Set current player coin
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
 * @param {numero} row
 * @param {numero} column
 * @param {numero} delta_y
 * @param {numero} delta_x
 * @return {numero}
 */
Board.prototype.pontuacaoPosition = function(row, column, delta_y, delta_x) {
    var human_points = 0;
    var computer_points = 0;

    // Save winning positions to arrays for later usage
    this.game.winning_array_human = [];
    this.game.winning_array_cpu = [];

    // Determine score through amount of available chips
    for (var i = 0; i < 4; i++) {
        if (this.field[row][column] == 0) {
            this.game.winning_array_human.push([row, column]);
            human_points++; // Add for each human chip
        } else if (this.field[row][column] == 1) {
            this.game.winning_array_cpu.push([row, column]);
            computer_points++; // Add for each computer chip
        }

        // Moving through our board
        row += delta_y;
        column += delta_x;
    }

    // Marking winning/returning score
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
 * @return {numero}
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
    // Verifica pontuação de cada coluna
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
        for (var column = 0; column < this.game.colunas; column++) {
            // Die Column bewerten und zu den Punkten hinzufügen
            var pontuacao = this.pontuacaoPosition(row, column, 1, 0);
            if (pontuacao == this.game.pontuacao) return this.game.pontuacao;
            if (pontuacao == -this.game.pontuacao) return -this.game.pontuacao;
            vertical_points += pontuacao;
        }            
    }

    // Horizontal points
    // Verifica pontuação de cada linha
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
        for (var column = 0; column < this.game.colunas - 3; column++) { 
            var pontuacao = this.pontuacaoPosition(row, column, 0, 1);   
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
        for (var column = 0; column < this.game.colunas - 3; column++) {
            var pontuacao = this.pontuacaoPosition(row, column, 1, 1);
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
        for (var column = 0; column <= this.game.colunas - 4; column++) {
            var pontuacao = this.pontuacaoPosition(row, column, -1, +1);
            if (pontuacao == this.game.pontuacao) return this.game.pontuacao;
            if (pontuacao == -this.game.pontuacao) return -this.game.pontuacao;
            diagonal_points2 += pontuacao;
        }

    }

    points = horizontal_points + vertical_points + diagonal_points1 + diagonal_points2;
    return points;
}

/**
 * Determina se está cheio.
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
 * Retorna a cópia do tabuleiro
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
