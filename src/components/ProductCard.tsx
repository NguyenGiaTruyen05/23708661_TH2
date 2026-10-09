import React from 'react';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import HapticFeedback from 'react-native-haptic-feedback';

import { Product } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';

import {
    COLORS,
    RADIUS,
    SPACING,
    TYPOGRAPHY,
} from '@constants/theme';

import {
    PRICE_MULTIPLIER,
    VARIANT,
} from '@constants/student';

type ProductCardProps = {
    product: Product;
    onPress: () => void;
};

export function ProductCard({
    product,
    onPress,
}: ProductCardProps) {
    const addItem = useCartStore(
        state => state.addItem,
    );

    const price = Math.round(
        product.price * PRICE_MULTIPLIER,
    );

    const handleAddToCart = () => {
        addItem(product);

        if (VARIANT.hapticOnAdd === 'selection') {
            HapticFeedback.trigger('selection', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
            });
        } else {
            HapticFeedback.trigger('impactMedium', {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
            });
        }
    };

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}>

            {/* ================= IMAGE ================= */}
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri: product.thumbnail,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            {/* ================= NAME ================= */}
            <Text
                style={styles.title}
                numberOfLines={2}>
                {product.title}
            </Text>

            {/* ================= PRICE ================= */}
            <Text style={styles.price}>
                {price.toLocaleString('vi-VN')} đ
            </Text>

            {/* ================= ADD ================= */}
            <Pressable
                onPress={handleAddToCart}
                hitSlop={8}
                style={({ pressed }) => [
                    styles.addButton,
                    pressed && styles.addButtonPressed,
                ]}>
                <Text style={styles.addButtonText}>
                    +
                </Text>
            </Pressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        height: 190,
        marginHorizontal: 4,
        marginBottom: 8,
        padding: 7,
        backgroundColor: COLORS.surface,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    cardPressed: {
        opacity: 0.9,
    },

    imageContainer: {
        width: '100%',
        height: 88,
        borderRadius: 7,
        overflow: 'hidden',
        backgroundColor: COLORS.background,
    },

    image: {
        width: '100%',
        height: '100%',
    },

    title: {
        marginTop: 6,
        paddingRight: 30,
        height: 34,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '600',
        color: COLORS.text,
    },

    price: {
        marginTop: 5,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '700',
        color: COLORS.primary,
    },

    addButton: {
        position: 'absolute',
        right: 7,
        bottom: 7,
        width: 27,
        height: 27,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    addButtonPressed: {
        opacity: 0.7,
        transform: [
            {
                scale: 0.94,
            },
        ],
    },

    addButtonText: {
        fontSize: 20,
        lineHeight: 22,
        fontWeight: '700',
        color: COLORS.white,
    },
});