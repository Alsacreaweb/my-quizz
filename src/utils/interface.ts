export enum GameStage {
    CHOOSE_QUIZZ,
    PLAYER_LIST,
    PLAY_GAME,
    SCORE
}

export interface Players {
    id: string;
    name: string;
    categories: string[];
    difficulties: string[];
    questions: Question[];
}

export interface Question {
    id: string;
    questionText: string;
    answer: string | boolean | number;
    category: string;
    points: number;
    type: 'string' | 'boolean' | 'number';
    difficulty: 'facile' | 'moyen' | 'difficile';
}

export interface ListQuiz {
    id: string;
    content: Question[];
    timestamp: string;
}