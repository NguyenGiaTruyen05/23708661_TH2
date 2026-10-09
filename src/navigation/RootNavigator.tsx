import React from 'react';
import { useAuthStore } from '@stores/authStore';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

export function RootNavigator() {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);

    return isLoggedIn ? <MainTabs /> : <AuthStack />;
}

export default RootNavigator;