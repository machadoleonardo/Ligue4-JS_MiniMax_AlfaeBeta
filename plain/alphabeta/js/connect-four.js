/**
 * Minimax (+Alpha-Beta) implentação 
 * @plain javascript version
 */
function Game() {
    this.rows = 6; // Altura
    this.colunas = 7; // Largura
    this.status = 0; // 0: em andamento, 1: ganhador, 2: perdedor, 3: empate
    this.profundidade = 4; // Busca em profundidade
    this.pontuacao = 100000, // Ganhar/Perder pontuacao
    this.round = 0; // 0: Humano, 1: Computador
    this.winning_array = []; // Array de vitorias
    this.interacoes = 0; // Contador de iterações
    
    that = this;

    that.init();
}

Game.prototype.init = function() {
    // montar tabuleiro
    // Criar Array bi-dimensional
    var tabuleiro = new Array(that.rows);
    for (var i = 0; i < tabuleiro.length; i++) {
        tabuleiro[i] = new Array(that.colunas);

        for (var j = 0; j < tabuleiro[i].length; j++) {
            tabuleiro[i][j] = null;
        }
    }

    //Criar a partir tabuleiro (veja board.js)
    this.board = new Board(this, tabuleiro, 0);

    // Criando visual do tabuleiro
    var tabuleiro = "";
    for (var i = 0; i < that.rows; i++) {
        tabuleiro += "<tr>";
        for (var j = 0; j < that.colunas; j++) {
            tabuleiro += "<td class='empty'></td>";
        }
        tabuleiro += "</tr>";
    }

    document.getElementById('tabuleiro').innerHTML = tabuleiro;

    // Action listeners
    var td = document.getElementById('tabuleiro').getElementsByTagName("td");

    for (var i = 0; i < td.length; i++) {
        if (td[i].addEventListener) {
            td[i].addEventListener('click', that.act, false);
        } else if (td[i].attachEvent) {
            td[i].attachEvent('click', that.act)
        }
    }
}

/**
 * On-click event
 */
Game.prototype.act = function(e) {
    var element = e.target || window.event.srcElement;

    // Vez jogador Humano
    if (that.round == 0) that.place(element.cellIndex);
    
    // Vez computador
    if (that.round == 1) that.generateComputerDecision();
}

Game.prototype.place = function(coluna) {
    // Se não terminou
    if (that.board.pontuacao() != that.pontuacao && that.board.pontuacao() != -that.pontuacao && !that.board.isFull()) {
        for (var y = that.rows - 1; y >= 0; y--) {
            if (document.getElementById('tabuleiro').rows[y].cells[coluna].className == 'empty') {
                if (that.round == 1) {
                    document.getElementById('tabuleiro').rows[y].cells[coluna].className = 'coin cpu-coin';
                } else {
                    document.getElementById('tabuleiro').rows[y].cells[coluna].className = 'coin human-coin';
                }
                break;
            }
        }

        if (!that.board.place(coluna)) {
            return alert("Movimento inválido!");
        }

        that.round = that.switchRound(that.round);
        that.updateStatus();
    }
}

Game.prototype.generateComputerDecision = function() {
    if (that.board.pontuacao() != that.pontuacao && that.board.pontuacao() != -that.pontuacao && !that.board.isFull()) {
        that.interacoes = 0; // Reiniciar contador
        document.getElementById('carregando').style.display = "Calculando Jogada"; //  Carregar mensagem

        // Calculando jogada
        setTimeout(function() {
            // Debug time
            var startzeit = new Date().getTime();

            // Chamada de Algoritimo
            var ai_move = that.maximizePlay(that.board, that.profundidade);

            var laufzeit = new Date().getTime() - startzeit;
            document.getElementById('ai-tempo').innerHTML = laufzeit.toFixed(2) + 'ms';

            // Tomar uma decisão
            that.place(ai_move[0]);

            // Debug
            document.getElementById('ai-coluna').innerHTML = 'Coluna: ' + parseInt(ai_move[0] + 1);
            document.getElementById('ai-pontuacao').innerHTML = 'Pontuação: ' + ai_move[1];
            document.getElementById('ai-interacoes').innerHTML = that.interacoes;

            document.getElementById('carregando').style.display = "Nenhum"; // Remove mensagem
        }, 100);
    }
}

/**
 * Algoritimo
 * Minimax principle
 */
Game.prototype.maximizePlay = function(board, profundidade, alpha, beta) {
    // Call pontuacao of our board
    var pontuacao = board.pontuacao();

    // Parada
    if (board.isFinished(profundidade, pontuacao)) return [null, pontuacao];

    // Coluna, pontuacao
    var max = [null, -99999];

    // Para toda Possibilidade de Movimento
    for (var coluna = 0; coluna < that.colunas; coluna++) {
        var new_board = board.copy(); // Create new board

        if (new_board.place(coluna)) {

            that.interacoes++; // Debug

            var next_move = that.minimizePlay(new_board, profundidade - 1, alpha, beta); // Recursive calling

            // Evolue novo movimento
            if (max[0] == null || next_move[1] > max[1]) {
                max[0] = coluna;
                max[1] = next_move[1];
                alpha = next_move[1];
            }

            if (alpha >= beta) return max;
        }
    }

    return max;
}

Game.prototype.minimizePlay = function(board, profundidade, alpha, beta) {
    var pontuacao = board.pontuacao();

    if (board.isFinished(profundidade, pontuacao)) return [null, pontuacao];

    // coluna, pontuacao
    var min = [null, 99999];

    for (var coluna = 0; coluna < that.colunas; coluna++) {
        var new_board = board.copy();

        if (new_board.place(coluna)) {

            that.interacoes++;

            var next_move = that.maximizePlay(new_board, profundidade - 1, alpha, beta);

            if (min[0] == null || next_move[1] < min[1]) {
                min[0] = coluna;
                min[1] = next_move[1];
                beta = next_move[1];
            }

            if (alpha >= beta) return min;

        }
    }
    return min;
}

Game.prototype.switchRound = function(round) {
    // 0 Humana, 1 Computador
    if (round == 0) {
        return 1;
    } else {
        return 0;
    }
}

Game.prototype.updateStatus = function() {
    // Humano Ganhou
    if (that.board.pontuacao() == -that.pontuacao) {
        that.status = 1;
        that.markWin();
        alert("Você ganhou!");
    }

    // Computador venceu
    if (that.board.pontuacao() == that.pontuacao) {
        that.status = 2;
        that.markWin();
        alert("Você perdeu!");
    }

    // Empate
    if (that.board.isFull()) {
        that.status = 3;
        alert("Empate!");
    }

    var html = document.getElementById('status');
    if (that.status == 0) {
        html.className = "status-running";
        html.innerHTML = "Partida em Andamento";
    } else if (that.status == 1) {
        html.className = "status-won";
        html.innerHTML = "Você ganhou";
    } else if (that.status == 2) {
        html.className = "status-lost";
        html.innerHTML = "Você perdeu";
    } else {
        html.className = "status-tie";
        html.innerHTML = "Empate";
    }
}

Game.prototype.markWin = function() {
    document.getElementById('tabuleiro').className = "finished";
    for (var i = 0; i < that.winning_array.length; i++) {
        var name = document.getElementById('tabuleiro').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className;
        document.getElementById('tabuleiro').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className = name + " win";
    }
}

Game.prototype.restartGame = function() {
    if (confirm('O jogo será reiniciado?')) {
        // Dropdown value
        var dificuldade = document.getElementById('dificuldade');
        var profundidade = dificuldade.options[dificuldade.selectedIndex].value;
        that.profundidade = profundidade;
        that.status = 0;
        that.round = 0;
        that.init();
        document.getElementById('ai-interacoes').innerHTML = "?";
        document.getElementById('ai-tempo').innerHTML = "?";
        document.getElementById('ai-coluna').innerHTML = "Coluna: ?";
        document.getElementById('ai-pontuacao').innerHTML = "Pontuação: ?";
        document.getElementById('tabuleiro').className = "";
        that.updateStatus();
    }
}

/**
 * Start game
 */
function Start() {
    window.Game = new Game();
}

window.onload = function() {
    Start()
};
