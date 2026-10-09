import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShopStack } from './ShopStack';
import { CartScreen } from '@screens/CartScreen';
import { MeScreen } from '@screens/MeScreen';
import { useCartStore } from '@stores/cartStore';

export type MainTabParamList = {
    Shop: undefined;
    Cart: undefined;
    Me: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
    const totalQuantity = useCartStore(state => state.totalQuantity());

    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Shop"
                component={ShopStack}
                options={{
                    title: 'Shop',
                    headerShown: false,
                }}
            />

            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    title: 'Giỏ',
                    tabBarBadge: totalQuantity > 0 ? totalQuantity : undefined,
                }}
            />

            <Tab.Screen
                name="Me"
                component={MeScreen}
                options={{
                    title: 'Tôi',
                }}
            />
        </Tab.Navigator>
    );
}