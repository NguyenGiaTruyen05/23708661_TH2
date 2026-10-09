import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@screens/HomeScreen';
import { DetailScreen } from '@screens/DetailScreen';

export type ShopStackParamList = {
    Home: undefined;
    Detail: {
        id: string;
    };
};

const Stack = createNativeStackNavigator<ShopStackParamList>();

export function ShopStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="Detail"
                component={DetailScreen}
                options={{
                    title: 'Chi tiết',
                    presentation: 'card',
                }}
            />
        </Stack.Navigator>
    );
}