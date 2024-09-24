import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ChoseFiles } from '../components/ChoseFiles';
import PlayerList from '../components/PlayerList';
import PlayGame from '../components/PlayGame';
import toastr from 'toastr';
import { GameStage, Players } from '../utils/interface'

export default function Game() {
    const [currentStage, setCurrentStage] = useState<GameStage>(GameStage.CHOOSE_QUIZZ);
    const [players, setPlayers] = useState<Players[]>(() => {
        const savedPlayers = localStorage.getItem('players');
        return savedPlayers ? JSON.parse(savedPlayers) : [];
    });

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (currentStage === GameStage.PLAY_GAME) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentStage]);

    const isAnyRadioSelected = () => {
        const radios = document.querySelectorAll<HTMLInputElement>('input[name="quizzChose"]');
        return Array.from(radios).some(radio => radio.checked);
    };

    const handleNext = () => {
        if (currentStage === GameStage.CHOOSE_QUIZZ && !isAnyRadioSelected()) {
            toastr.error('Aucun quiz sélectionné !');
        } else if (currentStage === GameStage.PLAYER_LIST && players.length === 0) {
            toastr.error('Veuillez ajouter au moins un joueur !');
        } else {
            setCurrentStage(currentStage + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStage(currentStage - 1);
    };

    const handleRestart = () => {
        Swal.fire({
            title: 'Confirmation',
            text: 'Voulez-vous vraiment recommencer la partie ? Toutes les données non sauvegardées seront perdues.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, recommencer',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('players');
                setCurrentStage(GameStage.CHOOSE_QUIZZ);
                setPlayers([]);
            }
        });
    };

    const getButtonText = () => {
        switch (currentStage) {
            case GameStage.CHOOSE_QUIZZ:
                return { previous: '', next: 'Définir les joueurs' };
            case GameStage.PLAYER_LIST:
                return { previous: 'Choisir un quiz', next: 'Commencer le jeu' };
            default:
                return { previous: '', next: '' };
        }
    };

    const { previous, next } = getButtonText();

    const renderView = () => {
        switch (currentStage) {
            case GameStage.CHOOSE_QUIZZ:
                return <ChoseFiles />;
            case GameStage.PLAYER_LIST:
                return <PlayerList players={players} setPlayers={setPlayers} />;
            case GameStage.PLAY_GAME:
                return <PlayGame />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 p-6 bg-slate-700 min-h-screen w-screen">
            <h1 className="text-slate-200 text-3xl font-bold">Bienvenue sur le quizz multijoueur !</h1>

            {renderView()}

            <div className="flex gap-4 mt-4">
                {currentStage > GameStage.CHOOSE_QUIZZ && previous && (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handlePrevious}
                    >
                        {previous}
                    </button>
                )}
                {currentStage < GameStage.SCORE && next && (
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleNext}
                    >
                        {next}
                    </button>
                )}
                {currentStage === GameStage.PLAY_GAME && (
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleRestart}
                    >
                        Recommencer la partie
                    </button>
                )}
            </div>
        </div>
    );
}
