import { useState } from "react";
import Swal from "sweetalert2";
import { useCreateListQuestion } from "../hooks/useCreateListQuestion";

export default function PlayGame() {
    const questionList = useCreateListQuestion();
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [playerAnswer, setPlayerAnswer] = useState<string | number | boolean>("");
    const [answers, setAnswers] = useState<{ [key: string]: string | number | boolean }>({});
    const [scores, setScores] = useState<{ [name: string]: number }>({});
    const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);

    if (!questionList || questionList.length === 0) {
        return <div>Chargement des questions...</div>;
    }

    const currentPlayer = questionList[currentPlayerIndex];
    const currentQuestion = currentPlayer?.questions?.[currentQuestionIndex];
    const currentTeamName = currentPlayer.name;

    const totalQuestionsPerPlayer = currentPlayer?.questions?.length || 0;

    const checkAnswer = () => {
        const correctAnswer = currentQuestion?.answer;
        let normalizedPlayerAnswer: string | number | boolean;

        if (currentQuestion && currentQuestion.type === 'number') {
            normalizedPlayerAnswer = Number(playerAnswer);
        } else if (currentQuestion.type === 'boolean') {
            normalizedPlayerAnswer = playerAnswer;
        } else {
            normalizedPlayerAnswer = (playerAnswer as string).trim().toLowerCase();
        }

        let normalizedCorrectAnswer: string | number | boolean;
        if (currentQuestion.type === 'number') {
            normalizedCorrectAnswer = Number(correctAnswer);
        } else if (currentQuestion.type === 'boolean') {
            normalizedCorrectAnswer = correctAnswer === true;
        } else {
            normalizedCorrectAnswer = typeof correctAnswer === 'string' ? correctAnswer.trim().toLowerCase() : correctAnswer;
        }

        const isCorrect = normalizedPlayerAnswer === normalizedCorrectAnswer;

        if (isCorrect) {
            setScores((prevScores) => ({
                ...prevScores,
                [currentTeamName]: (prevScores[currentTeamName] || 0) + currentQuestion.points
            }));
            Swal.fire({
                icon: 'success',
                title: 'Correct!',
                text: 'Bonne réponse !',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Incorrect!',
                text: `Mauvaise réponse. La bonne réponse est : ${correctAnswer}`,
                timer: 5000,
                showConfirmButton: false
            });
        }
    };

    const nextQuestion = () => {
        setQuestionsAnswered((prevCount) => prevCount + 1);

        const nextPlayerIndex = (currentPlayerIndex + 1) % questionList.length;
        const isNewCycle = nextPlayerIndex === 0;

        if (isNewCycle) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }

        setCurrentPlayerIndex(nextPlayerIndex);
        setPlayerAnswer("");
        checkAnswer();
    };

    if (currentQuestionIndex >= totalQuestionsPerPlayer) {
        const sortedScores = Object.entries(scores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
            .slice(0, 3);

        return (
            <div className="flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-200 mb-4">Fin du jeu !</h2>
                <p className="text-xl text-slate-200 mb-4">Questions répondues : {questionsAnswered}/{totalQuestionsPerPlayer * questionList.length}</p>
                <div className="relative flex flex-col items-center gap-6">
                    {sortedScores.map(([teamName, score], index) => (
                        <div
                            key={teamName}
                            className={`w-80 p-4 text-center text-white font-bold rounded-lg ${index === 0 ? 'bg-yellow-500 top-0' : index === 1 ? 'bg-gray-400 top-16' : 'bg-orange-500 top-32'}`}
                            style={{ zIndex: 3 - index }}
                        >
                            <div className="text-3xl">{index + 1}°</div>
                            <div className="text-xl">Équipe : {teamName}</div>
                            <div className="text-lg">Score : {score}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const handleSubmitAnswer = () => {
        setAnswers({
            ...answers,
            [`${currentPlayer.id}-${currentQuestion.id}`]: playerAnswer,
        });
        nextQuestion();
    };

    const renderAnswerInput = () => {
        const { type } = currentQuestion;

        switch (type) {
            case "string":
                return (
                    <input
                        type="text"
                        value={playerAnswer as string}
                        onChange={(e) => setPlayerAnswer(e.target.value)}
                        className="bg-white p-2 rounded border"
                        placeholder="Entrez votre réponse"
                    />
                );
            case "number":
                return (
                    <input
                        type="number"
                        value={playerAnswer as number}
                        onChange={(e) => setPlayerAnswer(Number(e.target.value))}
                        className="bg-white p-2 rounded border"
                        placeholder="Entrez un nombre"
                    />
                );
            case "boolean":
                return (
                    <div className="flex gap-4">
                        <label className="text-white">
                            <input
                                type="radio"
                                value="true"
                                checked={playerAnswer === true}
                                onChange={() => setPlayerAnswer(true)}
                            />
                            Vrai
                        </label>
                        <label className="text-white">
                            <input
                                type="radio"
                                value="false"
                                checked={playerAnswer === false}
                                onChange={() => setPlayerAnswer(false)}
                            />
                            Faux
                        </label>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-200 mb-4">Joueur : {currentPlayer.name}</h2>
            <div className="text-lg text-slate-300 mb-2">
                <p className="text-sm text-slate-300">Catégorie : {currentQuestion.category}</p>
                <p className="text-sm text-slate-300">Difficulté : {currentQuestion.difficulty}</p>
            </div>
            <div className="text-xl text-slate-200 mb-4">
                <p className="text-xl text-slate-300 font-bold">Question : {currentQuestion.questionText}</p>
            </div>
            <div className="mt-4">{renderAnswerInput()}</div>
            <button
                onClick={handleSubmitAnswer}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
                Soumettre la réponse
            </button>
            <div className="mt-4 text-slate-200">
                <p>Questions répondues : {Math.ceil(questionsAnswered / questionList.length)}/{totalQuestionsPerPlayer}</p>
                <div className="mt-4">
                    {Object.keys(scores).map((teamName) => (
                        <p key={teamName}>Score de l'équipe {teamName} : {scores[teamName]}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
