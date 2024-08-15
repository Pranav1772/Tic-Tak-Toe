import { useState } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";
import GameOver from "./components/GameOver.jsx";

const PLAYERS = {
    X: "Player 1",
    O: "Player 2",
};

const INITIAL_GAME_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

function derivedActivePlayer(gameTurns) {
    let currentPlayer = "X";
    if (gameTurns.length > 0 && gameTurns[0].player === "X") {
        currentPlayer = "O";
    }
    return currentPlayer;
}

function deriveWinner(gameBoard, player) {
    let winner;
    for (const combination of WINNING_COMBINATIONS) {
        const firstSqareSymbol = gameBoard[combination[0].row][combination[0].column];
        const secondSqareSymbol = gameBoard[combination[1].row][combination[1].column];
        const thirdSqareSymbol = gameBoard[combination[2].row][combination[2].column];

        if (firstSqareSymbol && firstSqareSymbol === secondSqareSymbol && firstSqareSymbol === thirdSqareSymbol) {
            winner = player[firstSqareSymbol];
        }
    }
    return winner;
}

function deriveGameBoard(gameTurns) {
    let gameBoard = INITIAL_GAME_BOARD.map((array) => [...array]);
    for (const turn of gameTurns) {
        const { square, player } = turn;
        const { row, col } = square;
        gameBoard[row][col] = player;
    }
    return gameBoard;
}

function App() {
    const [player, setPlayers] = useState(PLAYERS);
    const [gameTurns, setGameTurns] = useState([]);
    // const [activePlayer, setActivePlayer] = useState("X");

    const activePlayer = derivedActivePlayer(gameTurns);
    const gameBoard = deriveGameBoard(gameTurns);
    const winner = deriveWinner(gameBoard, player);
    const hasDraw = gameTurns.length === 9 && !winner;

    function handleSelectSquare(rowIndex, colIndex) {
        // setActivePlayer((curActivePlayer) => (curActivePlayer === "X" ? "O" : "X"));

        setGameTurns((prevTurns) => {
            const currentPlayer = derivedActivePlayer(prevTurns);
            const updatedTurns = [{ square: { row: rowIndex, col: colIndex }, player: currentPlayer }, ...prevTurns];
            return updatedTurns;
        });
    }

    function handleRestart() {
        setGameTurns([]);
    }

    function handlePlayerNameChange(symbol, newName) {
        setPlayers((prevPlayers) => {
            return {
                ...prevPlayers,
                [symbol]: newName,
            };
        });
    }

    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    <Player name={PLAYERS.X} symbol="X" isActive={activePlayer === "X"} onChangeName={handlePlayerNameChange} />
                    <Player name={PLAYERS.O} symbol="O" isActive={activePlayer === "O"} onChangeName={handlePlayerNameChange} />
                </ol>
                {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
                <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
            </div>
            <Log turns={gameTurns} />
        </main>
    );
}

export default App;
