import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
    PRICE_MULTIPLIER,
    STUDENT_ID,
} from '@constants/student';

import { Product } from '@services/productApi';
export type CartItem = {
    product: Product;
    quantity: number;
};

type CartState = {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    changeQty: (productId: number, quantity: number) => void;
    totalQuantity: () => number;
    totalAmount: () => number;
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: product =>
                set(state => {
                    const existing = state.items.find(
                        item => item.product.id === product.id,
                    );

                    if (existing) {
                        return {
                            items: state.items.map(item =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item,
                            ),
                        };
                    }

                    return {
                        items: [...state.items, { product, quantity: 1 }],
                    };
                }),

            removeItem: productId =>
                set(state => ({
                    items: state.items.filter(
                        item => item.product.id !== productId,
                    ),
                })),

            changeQty: (productId, quantity) =>
                set(state => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter(
                                item => item.product.id !== productId,
                            ),
                        };
                    }

                    return {
                        items: state.items.map(item =>
                            item.product.id === productId
                                ? { ...item, quantity }
                                : item,
                        ),
                    };
                }),

            totalQuantity: () =>
                get().items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                ),

            totalAmount: () =>
                get().items.reduce(
                    (total, item) =>
                        total +
                        Math.round(item.product.price * PRICE_MULTIPLIER) *
                        item.quantity,
                    0,
                ),
        }),
        {
            name: `ktxgo-cart-${STUDENT_ID}`,
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);