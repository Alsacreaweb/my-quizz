import { useEffect, useState } from "react";
import Player from "./Player";
import toastr from 'toastr';
import { v4 as uuidv4 } from 'uuid';
import type { Players } from "../utils/interface";

interface PlayerListProps {
    players: Players[];
    setPlayers: (players: Players[]) => void;
}

export default function PlayerList({ players, setPlayers }: PlayerListProps) {
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [allDifficulties, setAllDifficulties] = useState<string[]>([]);

    useEffect(() => {
        const storedGame = localStorage.getItem('game');
        const quizId = storedGame ? JSON.parse(storedGame).QuizId : null;

        if (storedGame) {
            const gameData = JSON.parse(storedGame);
            if (gameData.PlayerList && gameData.PlayerList.length > 0) {
                setPlayers(gameData.PlayerList);
            }
        }

        if (quizId) {
            const storedQuiz = localStorage.getItem('quizz');
            if (storedQuiz) {
                const quizzList = JSON.parse(storedQuiz);
                const quiz = quizzList.find((q: { id: string }) => q.id === quizId);
                if (quiz) {
                    let categories: string[] = quiz.content.map((item: { category: string }) => item.category);
                    categories = [...new Set(categories.flat())];
                    setAllCategories(categories);
                    let difficulties: string[] = quiz.content.map((item: { difficulty: string }) => item.difficulty);
                    difficulties = [...new Set(difficulties.flat())];
                    setAllDifficulties(difficulties);
                }
            }
        }
    }, [setPlayers]);

    const addPlayer = () => {
        setPlayers([...players, { id: uuidv4(), name: '', categories: [], difficulties: [], questions: [] }]);
    };

    const updatePlayerName = (id: string, name: string) => {
        setPlayers(players.map(player =>
            player.id === id ? { ...player, name } : player
        ));
    };

    const updatePlayerCategories = (id: string, categories: string[]) => {
        setPlayers(players.map(player =>
            player.id === id ? { ...player, categories } : player
        ));
    };

    const updatePlayerDifficulties = (id: string, difficulties: string[]) => {
        setPlayers(players.map(player =>
            player.id === id ? { ...player, difficulties } : player
        ));
    };

    const deletePlayer = (id: string) => {
        setPlayers(players.filter(player => player.id !== id));
    };

    const savePlayersToLocalStorage = () => {
        const storedGame = localStorage.getItem('game');
        if (storedGame) {
            const game = JSON.parse(storedGame);
            game["PlayerList"] = players;
            localStorage.setItem('game', JSON.stringify(game));
            toastr.success("Joueurs enregistrés avec succès !");
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-slate-200 text-2xl font-bold mb-4">Définir les joueurs</h2>

            <button
                onClick={addPlayer}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Ajouter un joueur
            </button>

            <div className={`grid ${players.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-14`}>
                {players.map((player) => (
                    <div key={player.id} className="relative">
                        <Player
                            player={player}
                            categories={allCategories}
                            difficulties={allDifficulties}
                            updatePlayerName={updatePlayerName}
                            updatePlayerCategories={updatePlayerCategories}
                            updatePlayerDifficulties={updatePlayerDifficulties}
                        />
                        <button
                            onClick={() => deletePlayer(player.id)}
                            className="bg-red-500 text-white p-2 bottom-0 right-0 rounded mt-2 w-full"
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={savePlayersToLocalStorage}
                className="bg-green-500 text-white p-2 rounded mt-4"
            >
                Enregistrer les joueurs
            </button>
        </div>
    );
}
