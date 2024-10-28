import React, { useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';

const VocabularyList: React.FC = () => {
    const knownWords = useAppSelector((state) => state.vocabulary.knownWords);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWords = useMemo(() => {
        return knownWords.filter(word =>
            word.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort();
    }, [knownWords, searchTerm]);

    const handleWordClick = (word: string) => {
        alert(`Selected word: ${word}`);
        // This will be connected to the chat input later
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4 max-w-md">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search vocabulary..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                />
            </div>

            <div className="h-48 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                    {filteredWords.map((word, index) => (
                        <button
                            key={index}
                            onClick={() => handleWordClick(word)}
                            className="text-left px-2 py-1 hover:bg-gray-700 rounded transition-colors"
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VocabularyList;