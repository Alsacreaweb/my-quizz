import { Link } from 'react-router-dom';
import { Bibliotheque } from './Bibliotheque';
import toastr from 'toastr';
import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Question } from '../utils/interface'

export const ChoseFiles = () => {
    const [quizs, setQuizs] = useState<{ id: string; content: Question[]; timestamp: string }[]>(() => {
        const savedQuizs = localStorage.getItem('quizz');
        return savedQuizs
            ? (JSON.parse(savedQuizs) as { id: string; content: Question[]; timestamp: string | number }[])
                .map((quiz) => ({ ...quiz, timestamp: new Date(quiz.timestamp).toISOString() }))
            : [];
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const downloadFile = () => {
        const input = fileInputRef.current;
        if (!input || !input.files || input.files.length === 0) return;

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function () {
            try {
                const newQuizContent = JSON.parse(reader.result as string);
                const newQuiz = {
                    id: uuidv4(),
                    content: newQuizContent,
                    timestamp: new Date().toISOString()
                };
                const updatedQuizs = [...quizs, newQuiz];
                setQuizs(updatedQuizs);
                localStorage.setItem('quizz', JSON.stringify(updatedQuizs));
                toastr.success('Le fichier de jeu a été importé avec succès !');
            } catch (error) {
                console.error('Erreur lors de la lecture du fichier', error);
                toastr.error('Erreur lors de la lecture du fichier.');
            }
        };

        reader.readAsText(file);
    };

    return (
        <>
            <p className="text-slate-200">Veuillez sélectionner un fichier de jeu disponible dans votre bibliothèque ou créer une liste de questions !</p>
            <div className="flex gap-4">
                <input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    accept="application/json"
                    onChange={() => downloadFile()}
                />
                <Bibliotheque quizs={quizs} setQuizs={setQuizs} />
            </div>
            <div className="flex gap-4">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Importer un fichier de jeu
                </button>
                <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" to="/create">Créer un fichier de jeu</Link>
            </div >
        </>
    );
};
