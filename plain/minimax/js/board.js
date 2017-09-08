function Board(jogo, campo, jogador) {
    this.jogo = jogo
    this.campo = campo;
    this.jogador = jogador;
}

Board.prototype.isFinished = function(profundidade, pontuacao) {
    if (profundidade == 0 || pontuacao == this.jogo.pontuacao || pontuacao == -this.jogo.pontuacao || this.isFull()) {
        return true;
    }
    return false;
}

Board.prototype.place = function(coluna) {

    if (this.campo[0][coluna] == null && coluna >= 0 && coluna < this.jogo.colunas) {
        for (var y = this.jogo.rows - 1; y >= 0; y--) {
            if (this.campo[y][coluna] == null) {
                this.campo[y][coluna] = this.jogador;
                break;
            }
        }
        this.jogador = this.jogo.switchRound(this.jogador);
        return true;
    } else {
        return false;
    }
}

Board.prototype.pontuacaoPosition = function(row, coluna, delta_y, delta_x) {
    var human_points = 0;
    var computer_points = 0;

    this.jogo.winning_array_human = [];
    this.jogo.winning_array_cpu = [];

    for (var i = 0; i < 4; i++) {
        if (this.campo[row][coluna] == 0) {
            this.jogo.winning_array_human.push([row, coluna]);
            human_points++; // Add for each human chip
        } else if (this.campo[row][coluna] == 1) {
            this.jogo.winning_array_cpu.push([row, coluna]);
            computer_points++; // Add for each computer chip
        }
        row += delta_y;
        coluna += delta_x;
    }

    if (human_points == 4) {
        this.jogo.winning_array = this.jogo.winning_array_human;
        return -this.jogo.pontuacao;
    } else if (computer_points == 4) {
        this.jogo.winning_array = this.jogo.winning_array_cpu;
        return this.jogo.pontuacao;
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

    for (var row = 0; row < this.jogo.rows - 3; row++) {
        for (var coluna = 0; coluna < this.jogo.colunas; coluna++) {
            var pontuacao = this.pontuacaoPosition(row, coluna, 1, 0);
            if (pontuacao == this.jogo.pontuacao) return this.jogo.pontuacao;
            if (pontuacao == -this.jogo.pontuacao) return -this.jogo.pontuacao;
            vertical_points += pontuacao;
        }            
    }

    for (var row = 0; row < this.jogo.rows; row++) {
        for (var coluna = 0; coluna < this.jogo.colunas - 3; coluna++) { 
            var pontuacao = this.pontuacaoPosition(row, coluna, 0, 1);   
            if (pontuacao == this.jogo.pontuacao) return this.jogo.pontuacao;
            if (pontuacao == -this.jogo.pontuacao) return -this.jogo.pontuacao;
            horizontal_points += pontuacao;
        } 
    }

    for (var row = 0; row < this.jogo.rows - 3; row++) {
        for (var coluna = 0; coluna < this.jogo.colunas - 3; coluna++) {
            var pontuacao = this.pontuacaoPosition(row, coluna, 1, 1);
            if (pontuacao == this.jogo.pontuacao) return this.jogo.pontuacao;
            if (pontuacao == -this.jogo.pontuacao) return -this.jogo.pontuacao;
            diagonal_points1 += pontuacao;
        }            
    }

    for (var row = 3; row < this.jogo.rows; row++) {
        for (var coluna = 0; coluna <= this.jogo.colunas - 4; coluna++) {
            var pontuacao = this.pontuacaoPosition(row, coluna, -1, +1);
            if (pontuacao == this.jogo.pontuacao) return this.jogo.pontuacao;
            if (pontuacao == -this.jogo.pontuacao) return -this.jogo.pontuacao;
            diagonal_points2 += pontuacao;
        }

    }

    points = horizontal_points + vertical_points + diagonal_points1 + diagonal_points2;
    return points;
}

Board.prototype.isFull = function() {
    for (var i = 0; i < this.jogo.colunas; i++) {
        if (this.campo[0][i] == null) {
            return false;
        }
    }
    return true;
}

Board.prototype.copy = function() {
    var new_board = new Array();
    for (var i = 0; i < this.campo.length; i++) {
        new_board.push(this.campo[i].slice());
    }
    return new Board(this.jogo, new_board, this.jogador);
}
