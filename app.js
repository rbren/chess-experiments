const { createApp } = Vue;

createApp({
    data() {
        return {
            board: [],
            selectedPiece: null,
            currentTurn: 'White',
            validMoves: [],
        }
    },
    methods: {
        initializeBoard() {
            const board = Array(8).fill(null).map(() => Array(8).fill(null));
            
            // Set up pawns
            for (let i = 0; i < 8; i++) {
                board[1][i] = { type: '♟', color: 'Black' };
                board[6][i] = { type: '♙', color: 'White' };
            }
            
            // Set up other pieces
            const backRowBlack = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
            const backRowWhite = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
            
            for (let i = 0; i < 8; i++) {
                board[0][i] = { type: backRowBlack[i], color: 'Black' };
                board[7][i] = { type: backRowWhite[i], color: 'White' };
            }
            
            this.board = board;
        },
        
        getSquareColor(row, col) {
            return (row + col) % 2 === 0 ? 'white' : 'black';
        },
        
        getPiece(row, col) {
            return this.board[row]?.[col]?.type || '';
        },
        
        isSelected(row, col) {
            return this.selectedPiece && 
                   this.selectedPiece.row === row && 
                   this.selectedPiece.col === col;
        },
        
        isValidMove(row, col) {
            return this.validMoves.some(move => 
                move.row === row && move.col === col
            );
        },
        
        getValidMoves(row, col) {
            const piece = this.board[row][col];
            if (!piece) return [];
            
            const moves = [];
            
            // Simple pawn movement logic
            if (piece.type === '♙' || piece.type === '♟') {
                const direction = piece.color === 'White' ? -1 : 1;
                const startRow = piece.color === 'White' ? 6 : 1;
                
                // Move forward one square
                if (!this.board[row + direction]?.[col]) {
                    moves.push({ row: row + direction, col });
                    
                    // Move forward two squares from starting position
                    if (row === startRow && !this.board[row + 2 * direction]?.[col]) {
                        moves.push({ row: row + 2 * direction, col });
                    }
                }
                
                // Capture diagonally
                for (const colOffset of [-1, 1]) {
                    const newCol = col + colOffset;
                    const newRow = row + direction;
                    if (this.board[newRow]?.[newCol]?.color !== piece.color) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            }
            
            return moves.filter(move => 
                move.row >= 0 && move.row < 8 && 
                move.col >= 0 && move.col < 8
            );
        },
        
        handleSquareClick(row, col) {
            const piece = this.board[row][col];
            
            // If no piece is selected and clicked square has a piece of current turn's color
            if (!this.selectedPiece && piece && piece.color === this.currentTurn) {
                this.selectedPiece = { row, col };
                this.validMoves = this.getValidMoves(row, col);
                return;
            }
            
            // If a piece is selected and clicked square is a valid move
            if (this.selectedPiece && this.isValidMove(row, col)) {
                // Move the piece
                this.board[row][col] = this.board[this.selectedPiece.row][this.selectedPiece.col];
                this.board[this.selectedPiece.row][this.selectedPiece.col] = null;
                
                // Switch turns
                this.currentTurn = this.currentTurn === 'White' ? 'Black' : 'White';
                
                // Reset selection
                this.selectedPiece = null;
                this.validMoves = [];
                return;
            }
            
            // Reset selection
            this.selectedPiece = null;
            this.validMoves = [];
        },
        
        resetGame() {
            this.initializeBoard();
            this.currentTurn = 'White';
            this.selectedPiece = null;
            this.validMoves = [];
        }
    },
    mounted() {
        this.initializeBoard();
    }
}).mount('#app');