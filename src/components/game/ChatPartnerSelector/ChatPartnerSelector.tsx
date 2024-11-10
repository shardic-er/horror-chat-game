import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createSelector } from '@reduxjs/toolkit';
import { setCurrentPartner, resetChatHistory } from '../../../store/slices/gameSlice';
import { CHAT_PARTNERS, ChatPartner } from '../../../config/aiPartners';
import { ProgressFlag } from '../../../types/gameTypes';
import { RootState } from '../../../types/store.types';
import { ReactComponent as ResetChatIcon } from '../../../assets/images/ResetChatIcon.svg';
import './ChatPartnerSelector.styles.css';

// Memoized selectors
const selectCurrentPartnerId = (state: RootState) => state.game.currentPartnerId;
const selectUserProgressFlags = (state: RootState) => state.game.currentUser?.progressFlags;
const selectProgressFlags = createSelector(
    [selectUserProgressFlags],
    (flags): Record<ProgressFlag, boolean> =>
        flags || Object.values(ProgressFlag).reduce(
            (acc, flag) => ({ ...acc, [flag]: false }),
            {} as Record<ProgressFlag, boolean>
        )
);

type PartnerAvailability = 'available' | 'locked' | 'hidden';

const ChatPartnerSelector: React.FC = () => {
    const dispatch = useAppDispatch();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const currentPartnerId = useAppSelector(selectCurrentPartnerId);
    const progressFlags = useAppSelector(selectProgressFlags);

    const checkPartnerAvailability = useCallback((partner: ChatPartner): PartnerAvailability => {
        if (!partner.requirements) return 'available';

        if (partner.requirements.visibilityFlag &&
            !progressFlags[partner.requirements.visibilityFlag]) {
            return 'hidden';
        }

        if (partner.requirements.unlockFlags) {
            const { flags, operation } = partner.requirements.unlockFlags;
            const flagStatuses = flags.map(flag => progressFlags[flag]);

            const isUnlocked = operation === 'AND'
                ? flagStatuses.every(Boolean)
                : flagStatuses.some(Boolean);

            if (!isUnlocked) {
                return 'locked';
            }
        }

        return 'available';
    }, [progressFlags]);

    const getPartnerTooltip = useCallback((partner: ChatPartner): string => {
        if (!partner.requirements) return partner.description;

        const status = checkPartnerAvailability(partner);
        if (status === 'locked') {
            const requirements: string[] = [];

            if (partner.requirements.unlockFlags) {
                const { flags, operation } = partner.requirements.unlockFlags;
                const flagNames = flags.map(flag => {
                    return flag.split(/(?=[A-Z])/)
                        .map(word => word.toLowerCase())
                        .join(' ');
                });
                requirements.push(`Requires ${operation === 'AND' ? 'all of' : 'any of'}: ${flagNames.join(', ')}`);
            }

            return `Locked - ${requirements.join('. ')}`;
        }

        return partner.description;
    }, [checkPartnerAvailability]);

    // Memoize visible partners
    const visiblePartners = useMemo(() =>
            CHAT_PARTNERS
                .filter(partner => checkPartnerAvailability(partner) !== 'hidden')
                .sort((a, b) => {
                    const aStatus = checkPartnerAvailability(a);
                    const bStatus = checkPartnerAvailability(b);
                    return aStatus === 'available' ? -1 : bStatus === 'available' ? 1 : 0;
                }),
        [checkPartnerAvailability]
    );

    const handlePartnerSelect = useCallback((partner: ChatPartner) => {
        const availability = checkPartnerAvailability(partner);
        if (availability === 'available') {
            dispatch(setCurrentPartner(partner.id));
        }
    }, [dispatch, checkPartnerAvailability]);

    const scroll = useCallback((direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    }, []);

    const updateArrows = useCallback(() => {
        const container = scrollContainerRef.current;
        if (container) {
            setShowLeftArrow(container.scrollLeft > 0);
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth
            );
        }
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateArrows);
            updateArrows();
            return () => container.removeEventListener('scroll', updateArrows);
        }
    }, [updateArrows]);

    return (
        <div className="chat-partner-selector">
            {showLeftArrow && (
                <button
                    className="scroll-button left"
                    onClick={() => scroll('left')}
                    aria-label="Scroll left"
                >
                    ‹
                </button>
            )}

            <div className="partners-container" ref={scrollContainerRef}>
                {visiblePartners.map(partner => {
                    const availability = checkPartnerAvailability(partner);

                    return (
                        <button
                            key={partner.id}
                            className={`partner-button ${availability} ${
                                currentPartnerId === partner.id ? 'active' : ''
                            }`}
                            onClick={() => handlePartnerSelect(partner)}
                            disabled={availability === 'locked'}
                            title={getPartnerTooltip(partner)}
                            style={{
                                '--partner-bg': partner.style.backgroundColor,
                                '--partner-text': partner.style.textColor,
                                '--partner-accent': partner.style.accentColor,
                            } as React.CSSProperties}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="partner-icon"
                            >
                                <path d={partner.icon} />
                            </svg>
                            <span className="partner-name">{partner.name}</span>
                            {availability === 'locked' && (
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lock-icon"
                                >
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>

            <button
                className="reset-button"
                onClick={() => currentPartnerId && dispatch(resetChatHistory(currentPartnerId))}
                aria-label="Reset chat history"
                title="Reset conversation"
            >
                <ResetChatIcon className="partner-icon" />
            </button>

            {showRightArrow && (
                <button
                    className="scroll-button right"
                    onClick={() => scroll('right')}
                    aria-label="Scroll right"
                >
                    ›
                </button>
            )}
        </div>
    );
};

export default React.memo(ChatPartnerSelector);