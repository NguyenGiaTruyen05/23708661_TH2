import React from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    useNavigation,
    useRoute,
} from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';

import HapticFeedback from 'react-native-haptic-feedback';

import { addItem } from '@stores/cartStore';
import { Product } from '@services/productApi';

import {
    COLORS,
    RADIUS,
    SPACING,
    TYPOGRAPHY,
} from '@constants/theme';

import {
    PRICE_MULTIPLIER,
    STUDENT_ID,
    VARIANT,
} from '@constants/student';

import { Watermark } from '@components/Watermark';

import {
    ShopStackParamList,
} from '@navigation/ShopStack';

type DetailRoute = ReturnType<
    typeof useRoute
> & {
    params: {
        id: string;
    };
};

type DetailNavigationProp =
    NativeStackNavigationProp<
        ShopStackParamList,
        'Detail'
    >;

function findProductInCache(
    queryClient: ReturnType<typeof useQueryClient>,
    id: number,
): Product | undefined {
    const queries =
        queryClient.getQueriesData<Product[]>({
            queryKey: ['products'],
        });

    for (const [, data] of queries) {
        if (!data) {
            continue;
        }

        const product = data.find(
            item => item.id === id,
        );

        if (product) {
            return product;
        }
    }

    return undefined;
}

export function DetailScreen() {
    const navigation =
        useNavigation<DetailNavigationProp>();

    const route = useRoute<DetailRoute>();

    const queryClient = useQueryClient();

    const productId = Number(route.params.id);

    const cachedProduct = findProductInCache(
        queryClient,
        productId,
    );

    const {
        data: product,
        isPending,
        isError,
    } = useQuery({
        queryKey: ['product', productId],

        queryFn: async () => {
            const cached =
                findProductInCache(
                    queryClient,
                    productId,
                );

            if (!cached) {
                throw new Error(
                    'Không tìm thấy món trong cache.',
                );
            }

            return cached;
        },

        initialData: cachedProduct,

        staleTime: Infinity,
    });

    // ================= ADD TO CART =================

    const handleAddToCart = () => {
        if (!product) {
            return;
        }

        addItem(product);

        // Haptic theo VARIANT
        if (
            VARIANT.hapticOnAdd === 'selection'
        ) {
            HapticFeedback.trigger(
                'selection',
                {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                },
            );
        } else {
            HapticFeedback.trigger(
                'impactMedium',
                {
                    enableVibrateFallback: true,
                    ignoreAndroidSystemSettings: false,
                },
            );
        }

        // Alert bắt buộc có MSSV
        Alert.alert(
            'Đã thêm vào giỏ hàng',
            `${product.title}\n\nMSSV: ${STUDENT_ID}`,
        );
    };

    // ================= LOADING =================

    if (isPending) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.screen}>

                    <View style={styles.topBar}>
                        <Pressable
                            onPress={() =>
                                navigation.goBack()
                            }
                            style={styles.backButton}>
                            <Text style={styles.backText}>
                                ‹
                            </Text>
                        </Pressable>

                        <Text style={styles.topTitle}>
                            Chi tiết
                        </Text>

                        <View style={styles.topRight} />
                    </View>

                    <View style={styles.centerState}>
                        <ActivityIndicator
                            size="large"
                            color={COLORS.primary}
                        />

                        <Text style={styles.loadingText}>
                            Đang tải chi tiết...
                        </Text>
                    </View>

                    <Watermark />
                </View>
            </SafeAreaView>
        );
    }

    // ================= ERROR =================

    if (isError || !product) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.screen}>

                    <View style={styles.topBar}>
                        <Pressable
                            onPress={() =>
                                navigation.goBack()
                            }
                            style={styles.backButton}>
                            <Text style={styles.backText}>
                                ‹
                            </Text>
                        </Pressable>

                        <Text style={styles.topTitle}>
                            Chi tiết
                        </Text>

                        <View style={styles.topRight} />
                    </View>

                    <View style={styles.centerState}>

                        <Text style={styles.errorTitle}>
                            Không thể tải sản phẩm
                        </Text>

                        <Text style={styles.errorMssv}>
                            MSSV: {STUDENT_ID}
                        </Text>

                        <Text style={styles.errorMessage}>
                            Không tìm thấy món trong danh sách
                            đã tải.
                        </Text>

                        <Pressable
                            style={({ pressed }) => [
                                styles.retryButton,
                                pressed && styles.pressed,
                            ]}
                            onPress={() =>
                                navigation.goBack()
                            }>
                            <Text style={styles.retryText}>
                                Quay lại
                            </Text>
                        </Pressable>

                    </View>

                    <Watermark />
                </View>
            </SafeAreaView>
        );
    }

    // ================= PRICE =================

    const displayPrice = Math.round(
        product.price * PRICE_MULTIPLIER,
    );

    // ================= DETAIL =================

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.screen}>

                {/* ================= TOP BAR ================= */}

                <View style={styles.topBar}>

                    <Pressable
                        onPress={() =>
                            navigation.goBack()
                        }
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.pressed,
                        ]}>
                        <Text style={styles.backText}>
                            ‹
                        </Text>
                    </Pressable>

                    <Text style={styles.topTitle}>
                        Chi tiết
                    </Text>

                    <View style={styles.topRight} />

                </View>

                {/* ================= CONTENT ================= */}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={
                        styles.scrollContent
                    }>

                    {/* IMAGE CARD */}

                    <View style={styles.imageCard}>
                        <Image
                            source={{
                                uri: product.thumbnail,
                            }}
                            style={styles.productImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* PRODUCT INFO */}

                    <View style={styles.infoCard}>

                        <Text style={styles.category}>
                            {product.category}
                        </Text>

                        <Text style={styles.productName}>
                            {product.title}
                        </Text>

                        <Text style={styles.price}>
                            {displayPrice.toLocaleString(
                                'vi-VN',
                            )}{' '}
                            đ
                        </Text>

                        <Text style={styles.description}>
                            {product.description}
                        </Text>

                        {/* ADD TO CART */}

                        <Pressable
                            style={({ pressed }) => [
                                styles.addButton,
                                pressed && styles.pressed,
                            ]}
                            onPress={handleAddToCart}>

                            <Text style={styles.addButtonText}>
                                Thêm vào giỏ
                            </Text>

                        </Pressable>

                    </View>

                </ScrollView>

                {/* ================= WATERMARK ================= */}

                <View style={styles.watermarkArea}>
                    <Watermark />
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // ================= SCREEN =================

    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // ================= TOP BAR =================

    topBar: {
        height: 56,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },

    backButton: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },

    backText: {
        fontSize: 34,
        lineHeight: 38,
        color: COLORS.text,
        fontWeight: '400',
    },

    topTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.text,
        textAlign: 'left',
        marginLeft: 2,
    },

    topRight: {
        width: 42,
    },

    // ================= CONTENT =================

    scrollContent: {
        padding: 12,
        paddingBottom: 20,
    },

    // ================= IMAGE =================

    imageCard: {
        width: '100%',
        height: 250,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    productImage: {
        width: '100%',
        height: '100%',
    },

    // ================= INFO =================

    infoCard: {
        marginTop: 12,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 16,
    },

    category: {
        fontSize: 12,
        color: COLORS.secondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 6,
    },

    productName: {
        fontSize: 23,
        lineHeight: 29,
        color: COLORS.text,
        fontWeight: '800',
    },

    price: {
        marginTop: 10,
        fontSize: 21,
        lineHeight: 27,
        color: COLORS.primary,
        fontWeight: '800',
    },

    description: {
        marginTop: 14,
        fontSize: 14,
        lineHeight: 21,
        color: COLORS.textLight,
    },

    // ================= BUTTON =================

    addButton: {
        marginTop: 20,
        height: 50,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    addButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '800',
    },

    pressed: {
        opacity: 0.75,
    },

    // ================= STATES =================

    centerState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: COLORS.textLight,
    },

    errorTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: COLORS.error,
        textAlign: 'center',
    },

    errorMssv: {
        marginTop: 8,
        fontSize: 13,
        color: COLORS.textLight,
    },

    errorMessage: {
        marginTop: 6,
        fontSize: 13,
        color: COLORS.textLight,
        textAlign: 'center',
    },

    retryButton: {
        marginTop: 16,
        minWidth: 110,
        height: 42,
        paddingHorizontal: 18,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    retryText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '700',
    },

    // ================= WATERMARK =================

    watermarkArea: {
        minHeight: 27,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: 8,
    },
});