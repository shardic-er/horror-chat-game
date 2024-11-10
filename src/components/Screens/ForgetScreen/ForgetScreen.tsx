// src/components/Screens/ForgetScreen/ForgetScreen.tsx

import React, { useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectMistakeProgress } from '../../../store/slices/vocabularySlice';
import { recoverWord } from '../../../store/slices/memoryRecoverySlice';
import TrashInput from '../../game/TrashInput/TrashInput';
import MemoryRecovery from '../../game/MemoryRecovery/MemoryRecovery';
import ProgressBar from '../../game/ProgressBar/ProgressBar';
import forgetImage from '../../../assets/images/IWantToForget.webp';
import rememberImage from '../../../assets/images/IWantToRemember.webp';
import './ForgetScreen.styles.css';

const ForgetScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const mistakeProgress = useAppSelector(selectMistakeProgress);
    const completedDeletions = useAppSelector(state =>
        state.game.currentUser?.progressFlags.completedDeletions ?? false
    );
    const forgottenWords = useAppSelector(state => state.vocabulary.forgottenWords);
    const targetWords = useAppSelector(state => state.memoryRecovery.targetWords);

    // Handle direct word selection from MemoryRecovery component
    const handleWordSelect = useCallback((word: string) => {
        dispatch(recoverWord(word));
    }, [dispatch]);

    // Listen for words being forgotten via TrashInput that match target words
    useEffect(() => {
        const handleWordForgotten = (event: CustomEvent<{ words: string[] }>) => {
            const forgottenWords = event.detail.words.map(w => w.toLowerCase());
            const matchedTargetWord = targetWords.find(tw =>
                !tw.recovered && forgottenWords.includes(tw.word.toLowerCase())
            );

            if (matchedTargetWord) {
                dispatch(recoverWord(matchedTargetWord.word));
            }
        };

        window.addEventListener('wordForgotten', handleWordForgotten as EventListener);
        return () => {
            window.removeEventListener('wordForgotten', handleWordForgotten as EventListener);
        };
    }, [dispatch, targetWords]);

    return (
        <div className="forget-screen">
            <div
                className="forget-background"
                style={{
                    backgroundImage: `url(${completedDeletions ? rememberImage : forgetImage})`
                }}
            />
            <div className="forget-content">
                {!mistakeProgress.isComplete && (
                    <div className="progress-section">
                        <h2>Mistakes Cleared</h2>
                        <ProgressBar
                            current={mistakeProgress.current}
                            max={mistakeProgress.max}
                            variant={completedDeletions ? 'success' : 'default'}
                        />
                        <p className="progress-text">
                            {mistakeProgress.current} / {mistakeProgress.max} mistakes cleared
                        </p>
                    </div>
                )}

                <div className="interaction-section">
                    {completedDeletions ? (
                        <>
                            <div className="recovery-interface">
                                <MemoryRecovery onWordSelect={handleWordSelect} />
                            </div>
                            <div className="trash-section">
                                <TrashInput />
                            </div>
                        </>
                    ) : (
                        <div className="trash-section">
                            <TrashInput />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgetScreen;