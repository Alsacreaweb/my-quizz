import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toastr from 'toastr';
import { FaTrash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Question, ListQuiz } from '../utils/interface'

const CreateQuizz: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isModified, setIsModified] = useState(false);
    const [quizId, setQuizId] = useState<string | null>(null);

    useEffect(() => {
        if (location.state && location.state.quiz) {
            const quiz = location.state.quiz;
            setQuestions(quiz.content as Question[]);
            setQuizId(quiz.id);
        }
    }, [location.state]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isModified) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isModified]);

    const addQuestion = () => {
        const newQuestion: Question = {
            id: uuidv4(),
            questionText: '',
            answer: '',
            category: '',
            points: 0,
            type: 'string',
            difficulty: 'facile'
        };
        setQuestions([...questions, newQuestion]);
        setIsModified(true);
    };

    const updateQuestion = (id: string, field: keyof Question, value: string | number | boolean) => {
        const updatedQuestions = questions.map((q) =>
            q.id === id ? { ...q, [field]: value } : q
        );
        setQuestions(updatedQuestions);
        setIsModified(true);
    };

    const deleteQuestion = (id: string) => {
        const updatedQuestions = questions.filter((q) => q.id !== id);
        setQuestions(updatedQuestions);
        setIsModified(true);
    };

    const saveQuizToLocalStorage = () => {
        if (quizId) {
            const savedQuizs = localStorage.getItem('quizz');
            const quizs: ListQuiz[] = savedQuizs ? JSON.parse(savedQuizs) : [];
            const updatedQuizs = quizs.map((quiz) => {
                if (quiz.id === quizId) {
                    return { ...quiz, content: questions, timestamp: new Date().toISOString() };
                }
                return quiz;
            });
            localStorage.setItem('quizz', JSON.stringify(updatedQuizs));
            toastr.success('Le quiz a été mis à jour avec succès dans le localStorage !');
        } else {
            const newQuiz: ListQuiz = {
                id: uuidv4(),
                content: questions,
                timestamp: new Date().toISOString()
            };
            const savedQuizs = localStorage.getItem('quizz');
            const quizs: ListQuiz[] = savedQuizs ? JSON.parse(savedQuizs) : [];
            const updatedQuizs = [...quizs, newQuiz];
            localStorage.setItem('quizz', JSON.stringify(updatedQuizs));
            toastr.success('Le quiz a été sauvegardé avec succès dans le localStorage !');
        }
        setIsModified(false);
    };


    const exportQuizAsJson = () => {
        const dataStr = JSON.stringify(questions, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'quiz.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleBackClick = () => {
        if (isModified) {
            if (window.confirm('Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir revenir en arrière ?')) {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    const renderAnswerInput = (q: Question) => {
        switch (q.type) {
            case 'boolean':
                return (
                    <div className="flex gap-4">
                        <label>
                            <input
                                type="checkbox"
                                checked={q.answer === true}
                                onChange={() => updateQuestion(q.id, 'answer', true)}
                            />
                            Vrai
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={q.answer === false}
                                onChange={() => updateQuestion(q.id, 'answer', false)}
                            />
                            Faux
                        </label>
                    </div>
                );
            case 'number':
                return (
                    <input
                        className="bg-slate-600 text-white w-full px-2 py-1"
                        type="number"
                        value={q.answer as number}
                        onChange={(e) => updateQuestion(q.id, 'answer', parseFloat(e.target.value))}
                        placeholder="Entrez un nombre"
                    />
                );
            default:
                return (
                    <input
                        className="bg-slate-600 text-white w-full px-2 py-1"
                        type="text"
                        value={q.answer as string}
                        onChange={(e) => updateQuestion(q.id, 'answer', e.target.value)}
                        placeholder="Entrez la réponse"
                    />
                );
        }
    };


    return (
        <div className="flex flex-col items-center gap-8 p-6 bg-slate-700 min-h-screen w-screen">
            <h1 className="text-slate-200 text-3xl font-bold">Renseigner ici vos questions</h1>

            <table className='min-w-full text-sm text-left rtl:text-right text-slate-200 dark:text-slate-400'>
                <thead className='text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-400 dark:text-slate-700'>
                    <tr>
                        <th className='px-6 py-3 text-center'>Type</th>
                        <th className="px-6 py-3 text-center">Question</th>
                        <th className="px-6 py-3 text-center">Réponse</th>
                        <th className="px-6 py-3 text-center">Catégorie</th>
                        <th className="px-6 py-3 text-center">Points</th>
                        <th className="px-6 py-3 text-center">Difficulté</th>
                        <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length > 0 ? (
                        questions.map((q) => (
                            <tr key={q.id}>
                                <td className='px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white'>
                                    <select
                                        className="bg-slate-600 text-white w-full px-2 py-1"
                                        value={q.type}
                                        onChange={(e) => updateQuestion(q.id, 'type', e.target.value as 'string' | 'boolean' | 'number')}
                                    >
                                        <option value="string">Texte</option>
                                        <option value="boolean">Vrai/Faux</option>
                                        <option value="number">Nombre</option>
                                    </select>
                                </td>
                                <td className='px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white'>
                                    <input
                                        className="bg-slate-600 text-white w-full px-2 py-1"
                                        type="text"
                                        value={q.questionText}
                                        onChange={(e) => updateQuestion(q.id, 'questionText', e.target.value)}
                                        placeholder="Entrez la question"
                                    />
                                </td>
                                <td className='px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white'>
                                    {renderAnswerInput(q)}
                                </td>
                                <td className='px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white'>
                                    <input
                                        className="bg-slate-600 text-white w-full px-2 py-1"
                                        type="text"
                                        value={q.category}
                                        onChange={(e) => updateQuestion(q.id, 'category', e.target.value)}
                                        placeholder="Catégorie"
                                    />
                                </td>
                                <td className='px-6 py-4 w-min font-medium text-slate-900 whitespace-nowrap dark:text-white'>
                                    <input
                                        className="bg-slate-600 text-white w-full px-2 py-1"
                                        type="number"
                                        value={q.points}
                                        onChange={(e) => updateQuestion(q.id, 'points', parseInt(e.target.value))}
                                        placeholder="Points"
                                    />
                                </td>
                                <td className='px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white'>
                                    <select
                                        className="bg-slate-600 text-white w-full px-2 py-1"
                                        value={q.difficulty}
                                        onChange={(e) => updateQuestion(q.id, 'difficulty', e.target.value as 'facile' | 'moyen' | 'difficile')}
                                    >
                                        <option value="facile">Facile</option>
                                        <option value="moyen">Moyen</option>
                                        <option value="difficile">Difficile</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                                    <button
                                        className="text-red-800 hover:text-red-900 dark:text-red-600 dark:hover:text-red-800"
                                        onClick={() => deleteQuestion(q.id)}
                                    >
                                        <FaTrash size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center py-4">Aucune question ajoutée</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="flex gap-4">
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={addQuestion}
                >
                    Ajouter une question
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleBackClick}
                >
                    Retour
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={saveQuizToLocalStorage}
                >
                    Sauvegarder le quiz
                </button>
                <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    onClick={exportQuizAsJson}
                >
                    Exporter en JSON
                </button>
            </div>
        </div>
    );
};

export default CreateQuizz;
