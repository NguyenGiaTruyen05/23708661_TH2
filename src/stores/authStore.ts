import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
    examStamp,
    STUDENT_ID,
    VARIANT,
} from '@constants/student';

type AuthState = {
    isLoggedIn: boolean;
    phone: string;
    token: string;
    login: (phone: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            isLoggedIn: false,
            phone: '',
            token: '',

            login: phone =>
                set({
                    isLoggedIn: true,
                    phone,
                    token: `ktxgo-${STUDENT_ID}-${examStamp()}`,
                }),

            logout: () =>
                set({
                    isLoggedIn: false,
                    phone: '',
                    token: '',
                }),
        }),
        {
            name: `ktxgo-auth-${STUDENT_ID}`,
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);