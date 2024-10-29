// src/assets/library/images/index.tsx

import React from 'react';

export const ColorsCoverImage: React.FC = () => (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#f0f0f0"/>
        <circle cx="100" cy="150" r="40" fill="#ff0000" />
        <circle cx="200" cy="150" r="40" fill="#00ff00" />
        <circle cx="300" cy="150" r="40" fill="#0000ff" />
        <text x="200" y="250" textAnchor="middle" fill="#333" fontSize="24">Colors!</text>
    </svg>
);

export const BlueSkyImage: React.FC = () => (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" fill="#4a90e2"/>
        <rect width="400" height="100" y="200" fill="#62b6cb"/>
        <circle cx="80" cy="80" r="20" fill="#ffffff"/>
        <circle cx="150" cy="60" r="25" fill="#ffffff"/>
        <path d="M 300 80 Q 320 50, 340 80" stroke="white" strokeWidth="5" fill="none"/>
        <path d="M 320 90 Q 340 60, 360 90" stroke="white" strokeWidth="5" fill="none"/>
    </svg>
);

// Add more image components...