import { UserData } from '../types/gameTypes';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const USER_COOKIE_KEY = 'horror_game_user';

const initialVocabulary = ['the', 'a', 'is', 'in', 'it', 'you', 'i', 'to', 'and', 'of'];

export const createNewUser = (): UserData => ({
    id: uuidv4(),
    vocabulary: initialVocabulary,
    progressFlags: {
        completedTutorial: false
    },
    isRegistered: false,
});

export const saveUser = (userData: UserData): void => {
    Cookies.set(USER_COOKIE_KEY, JSON.stringify(userData), { expires: 365 });
};

export const loadUser = (): UserData | null => {
    const savedUser = Cookies.get(USER_COOKIE_KEY);
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        // Convert stored dates back to Date objects
        userData.lastLoginDate = new Date(userData.lastLoginDate);
        userData.createdAt = new Date(userData.createdAt);
        return userData;
    }
    return null;
};

export const updateUser = (updates: Partial<UserData>): UserData => {
    const currentUser = loadUser();
    if (!currentUser) throw new Error('No user found');

    const updatedUser = {
        ...currentUser,
        ...updates,
        lastLoginDate: new Date()
    };

    saveUser(updatedUser);
    return updatedUser;
};