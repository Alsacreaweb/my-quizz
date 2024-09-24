import { useState, useEffect } from "react";
import { Question, Players } from "../utils/interface";

export function useCreateListQuestion() {
    const [playersData, setPlayersData] = useState<Players[]>([]);

    const NUMOFQUESTION = 10;

    const shuffleArray = (array: Question[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        const storedQuiz = localStorage.getItem('quizz');
        const storedGame = localStorage.getItem('game');
        if (storedQuiz && storedGame) {
            const quizzList = JSON.parse(storedQuiz);
            const game = JSON.parse(storedGame);
            const quiz = quizzList.find((q: { id: string }) => q.id === game.QuizId);
            if (quiz) {
                const updatedPlayerList = game.PlayerList.map((player: Players) => {
                    let filteredQuestions = quiz.content.filter((question: Question) =>
                        player.categories.includes(question.category) &&
                        player.difficulties.includes(question.difficulty)
                    );

                    if (filteredQuestions.length < NUMOFQUESTION) {
                        const additionalQuestions = quiz.content.filter((question: Question) =>
                            !filteredQuestions.includes(question)
                        );
                        shuffleArray(additionalQuestions);
                        filteredQuestions = filteredQuestions.concat(additionalQuestions.slice(0, 10 - filteredQuestions.length));
                    }

                    const shuffledQuestions = shuffleArray(filteredQuestions);
                    const selectedQuestions = shuffledQuestions.slice(0, 10);

                    return {
                        ...player,
                        questions: selectedQuestions
                    };
                });

                setPlayersData(updatedPlayerList);
                game.PlayerList = updatedPlayerList;
                localStorage.setItem('game', JSON.stringify(game));
            }
        }
    }, []);

    return playersData;
}