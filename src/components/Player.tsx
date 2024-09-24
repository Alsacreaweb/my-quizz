import { useState } from "react";
import type { Players } from "../utils/interface";

interface PlayerProps {
    player: Players;
    categories: string[];
    difficulties: string[];
    updatePlayerName: (id: string, name: string) => void;
    updatePlayerCategories: (id: string, categories: string[]) => void;
    updatePlayerDifficulties: (id: string, difficulties: string[]) => void;
}

export default function Player({ player, categories, difficulties, updatePlayerName, updatePlayerCategories, updatePlayerDifficulties }: PlayerProps) {
    const [name, setName] = useState(player.name);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(player.categories);
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(player.difficulties);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        updatePlayerName(player.id, e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
        const updatedCategories = e.target.checked
            ? [...selectedCategories, category]
            : selectedCategories.filter(cat => cat !== category);

        setSelectedCategories(updatedCategories);
        updatePlayerCategories(player.id, updatedCategories);
    };

    const handleDifficultyChange = (e: React.ChangeEvent<HTMLInputElement>, difficulty: string) => {
        const updatedDifficulties = e.target.checked
            ? [...selectedDifficulties, difficulty]
            : selectedDifficulties.filter(diff => diff !== difficulty);

        setSelectedDifficulties(updatedDifficulties);
        updatePlayerDifficulties(player.id, updatedDifficulties);
    };

    const categoryFormatting = (category: string) => {
        const formattedCategory = category.replace(/_/g, ' ');
        return formattedCategory.charAt(0).toUpperCase() + formattedCategory.slice(1);
    };

    return (
        <div className="p-4 border-gray-50 border rounded-lg text-center space-y-4">
            <input
                type="text"
                value={name}
                onChange={handleNameChange}
                className="p-2 rounded bg-gray-300"
                placeholder="Nom du joueur"
            />

            <p className="text-gray-300 mt-2">Sélectionnez les catégories :</p>
            <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => (
                    <label key={category} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={(e) => handleCategoryChange(e, category)}
                            className="bg-gray-300 p-2 rounded"
                        />
                        <span className="text-gray-300">{categoryFormatting(category)}</span>
                    </label>
                ))}
            </div>

            <p className="text-gray-300 mt-2">Sélectionnez les niveaux de difficulté :</p>
            <div className="grid grid-cols-3 gap-2">
                {difficulties.map((difficulty) => (
                    <label key={difficulty} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedDifficulties.includes(difficulty)}
                            onChange={(e) => handleDifficultyChange(e, difficulty)}
                            className="bg-gray-300 p-2 rounded"
                        />
                        <span className="text-gray-300 capitalize">{difficulty}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
