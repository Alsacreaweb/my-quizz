import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaTrash, FaEdit } from 'react-icons/fa';
import toastr from 'toastr';
import { useNavigate } from 'react-router-dom';
import { ListQuiz } from '../utils/interface'

interface BibliothequeProps {
    quizs: ListQuiz[];
    setQuizs: React.Dispatch<React.SetStateAction<ListQuiz[]>>;
}

export const Bibliotheque: React.FC<BibliothequeProps> = ({ quizs, setQuizs }) => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('quizz', JSON.stringify(quizs));
    }, [quizs]);

    const confirmAndDelete = (id: string) => {
        Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Cette action ne peut pas être annulée.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedQuizs = quizs.filter((q) => q.id !== id);
                setQuizs(updatedQuizs);
                localStorage.setItem('quizz', JSON.stringify(updatedQuizs));
                toastr.success('Le fichier de jeu a été supprimé avec succès !');
            }
        });
    };

    const editQuiz = (quiz: ListQuiz) => {
        navigate('/create', { state: { quiz } });
    };

    const handleQuizSelect = (id: string) => {
        const selectedQuiz = quizs.find((quiz) => quiz.id === id);

        if (selectedQuiz) {
            const existingGame = localStorage.getItem('game');
            let playerList = [];

            if (existingGame) {
                const parsedGame = JSON.parse(existingGame);
                playerList = parsedGame.PlayerList || [];
            }

            const game = {
                QuizId: selectedQuiz.id,
                PlayerList: playerList,
                Score: {}
            };

            localStorage.setItem('game', JSON.stringify(game));
        }
    };

    return (
        <div className='flex gap-8'>
            <div>
                <div className='text-slate-200 w-full text-center pb-4 text-lg'>Liste de vos quizz</div>
                <table className='w-[600px] text-sm text-left rtl:text-right text-slate-200 dark:text-slate-400'>
                    <thead className='text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-400 dark:text-slate-700'>
                        <tr>
                            <th className='px-6 py-3 text-center'></th>
                            <th className='px-6 py-3 text-center'>ID</th>
                            <th className='px-6 py-3 text-center'>Date</th>
                            <th className='px-6 py-3 text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizs.length > 0 ? (
                            quizs.map((quiz) => (
                                <tr className='odd:bg-white odd:dark:bg-slate-600 even:bg-slate-50 even:dark:bg-slate-400 border-b dark:border-slate-700' key={quiz.id}>
                                    <td className='px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white'>
                                        <input
                                            type="radio"
                                            name="quizzChose"
                                            onClick={() => handleQuizSelect(quiz.id)}
                                        />
                                    </td>
                                    <td className='px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white'>{quiz.id}</td>
                                    <td className='px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white'>{new Date(quiz.timestamp).toLocaleString()}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                        <button
                                            className='text-red-800 hover:text-red-900 dark:text-red-600 dark:hover:text-red-800'
                                            onClick={() => confirmAndDelete(quiz.id)}
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                        <button
                                            className='text-blue-800 hover:text-blue-900 dark:text-blue-600 dark:hover:text-blue-800 ml-4'
                                            onClick={() => editQuiz(quiz)}
                                        >
                                            <FaEdit size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className='text-center' colSpan={4}>Aucun fichier de jeu disponible</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
