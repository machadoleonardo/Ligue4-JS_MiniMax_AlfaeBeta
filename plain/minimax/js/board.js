function Board(game, field, player) {
    this.game = game
    this.field = field;
    this.player = player;
}

Board.prototype.isFinished = function(profundidade, pontuacao) {
    if (profundidade == 0 || pontuacao == this.game.pontuacao || pontuacao == -this.game.pontuacao || this.isFull()) {
        return true;
    }
    return false;
}

Board.prototype.place = function(column) {

    if (this.field[0][column] == null && column >= 0 && column < this.game.colunas) {
        for (var y = this.game.rows - 1; y >= 0; y--) {
            if (this.field[y][column] == null) {
                this.field[y][column] = this.player; 
                break; 
            }
        }
        this.player = this.game.switchRound(this.player);
        return true;
    } else {
        return false;
    }
}

Board.prototype.pontuacaoPosition = function(row, column, delta_y, delta_x) {
    var human_points = 0;
    var computer_points = 0;

    this.game.winning_array_human = [];
    this.game.winning_array_cpu = [];

    for (var i = 0; i < 4; i++) {
        if (this.field[row][column] == 0) {
            this.game.winning_array_human.push([row, column]);
            human_points++; // Add for each human chip
        } else if (this.field[row][column] == 1) {
            this.game.winning_array_cpu.push([row, column]);
            computer_points++; // Add for each computer chip
        }
        row += delta_y;
        column += delta_x;
    }

    if (human_points == 4) {
        this.game.winning_array = this.game.winning_array_human;
        return -this.game.pontuacao;
    } else if (computer_points == 4) {
        this.game.winning_array = this.game.winning_array_cpu;
        return this.game.pontuacao;
    } else {
        return computer_points;
    }
}

Board.prototype.pontuacao = function() {
    var points = 0;

    var vertical_points = 0;
    var horizontal_points = 0;
    var diagonal_points1 = 0;
    var diagonal_points2 = 0;

    for (var row = 0; row < this.game.rows - 3; row++) {
        for (var column = 0; column < this.game.colunas; column++) {
            var pontuacao = this.pontuacaoPosition(row, column, 1, 0);
            if (pontuacao == this.game.pontuacao) return this.game.pontuacao;
            if (pontuacao == -this.game.pontuacao) return -this.game.pontuacao;
            vertical_points += pontuacao;
        }            
    }

    for (var row = 0; row < this.game.rows; row++) {
        for (var column = 0; column < this.game.colunas - 3; column++) { 
            var pontuacao = this.pontuacaoPosition(row, column, 0, 1);   
            if (pontuacao == this.game.pontuacao) return this.game.pontuacao;
            if (pontuacao == -this.game.pontuacao) return -this.game.pontuacao;
            horizontal_points += pontuacao;
        } 
    }

    for (var row = 0; row < this.game.rows - 3; row++) {
        for (var column = 0; column < this.game.colunas - 3; column++) {
            var pontuacao = this.pontuacaoPosition(row, column, 1, 1);
            if (pontuacao == this.game.pontuacao) return this.game.pontuacao;
            if (pontuacao == -this.game.pontuacao) return -this.game.pontuacao;
            diagonal_points1 += pontuacao;
        }            
    }

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

Board.prototype.isFull = function() {
    for (var i = 0; i < this.game.colunas; i++) {
        if (this.field[0][i] == null) {
            return false;
        }
    }
    return true;
}

Board.prototype.copy = function() {
    var new_board = new Array();
    for (var i = 0; i < this.field.length; i++) {
        new_board.push(this.field[i].slice());
    }
    return new Board(this.game, new_board, this.player);
}
