import { useState, useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addNewWord } from '../store/slices/vocabularySlice';

export const useWordCollection = () => {
    const dispatch = useAppDispatch();
    const [collectingWords, setCollectingWords] = useState<string[]>([]);

    const collectWord = useCallback(async (word: string) => {
        setCollectingWords(prev => [...prev, word]);
        await dispatch(addNewWord(word));
        setCollectingWords(prev => prev.filter(w => w !== word));
    }, [dispatch]);

    return {
        collectingWords,
        collectWord
    };
};