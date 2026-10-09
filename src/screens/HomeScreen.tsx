import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@components/ProductCard';
import { Watermark } from '@components/Watermark';

import { useDebouncedValue } from '@hooks/useDebouncedValue';

import { fetchProducts } from '@services/productApi';

import {
    COLORS,
    RADIUS,
    SPACING,
    TYPOGRAPHY,
} from '@constants/theme';

import {
    DEBOUNCE_MS,
    ROOM_LABEL,
    STALE_TIME_MS,
    STUDENT_ID,
} from '@constants/student';

import { ShopStackParamList } from '@navigation/ShopStack';

type HomeNavigationProp = NativeStackNavigationProp<
    ShopStackParamList,
    'Home'
>;

export function HomeScreen() {
    const navigation = useNavigation<HomeNavigationProp>();

    // Safe area của thiết bị
    const insets = useSafeAreaInsets();

    // ================= SEARCH =================

    const [search, setSearch] = React.useState('');

    const debouncedSearch = useDebouncedValue(
        search,
        DEBOUNCE_MS,
    );

    // ================= QUERY =================

    const {
        data,
        isPending,
        isRefetching,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['products', debouncedSearch],
        queryFn: () => fetchProducts(debouncedSearch),
        staleTime: STALE_TIME_MS,
        placeholderData: keepPreviousData,
    });

    const products = data ?? [];

    // ================= NAVIGATION =================

    const handleProductPress = (id: number) => {
        navigation.navigate('Detail', {
            id: String(id),
        });
    };

    // ================= REFRESH =================

    const handleRefresh = () => {
        void refetch();
    };

    const showInitialLoading = isPending && !data;

    // ================= UI =================

    return (
        <View
            style={[
                styles.safeArea,
                {
                    paddingTop: insets.top,
                },
            ]}>
            <View style={styles.container}>

                {/* ================= HEADER ================= */}

                <View style={styles.header}>
                    <Text style={styles.logo}>
                        KTXGO
                    </Text>

                    <Text style={styles.room}>
                        Giao tận {ROOM_LABEL}
                    </Text>
                </View>

                {/* ================= SEARCH ================= */}

                <View style={styles.searchWrapper}>
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder={`Tìm món · debounce ${DEBOUNCE_MS}ms`}
                        placeholderTextColor={COLORS.textLight}
                        style={styles.searchInput}
                        autoCorrect={false}
                        autoCapitalize="none"
                        returnKeyType="search"
                    />
                </View>

                {/* ================= PRODUCT AREA ================= */}

                <View style={styles.listContainer}>

                    {/* LOADING */}

                    {showInitialLoading && (
                        <View style={styles.centerState}>
                            <ActivityIndicator
                                size="large"
                                color={COLORS.primary}
                            />

                            <Text style={styles.stateText}>
                                Đang tải món...
                            </Text>
                        </View>
                    )}

                    {/* ERROR */}

                    {!showInitialLoading &&
                        isError &&
                        !data && (
                            <View style={styles.centerState}>
                                <Text style={styles.errorText}>
                                    Không thể tải danh sách món.
                                </Text>

                                <Text style={styles.errorDetail}>
                                    MSSV: {STUDENT_ID}
                                </Text>

                                <Text
                                    style={styles.retryText}
                                    onPress={() => {
                                        void refetch();
                                    }}>
                                    Thử lại
                                </Text>
                            </View>
                        )}

                    {/* DATA / EMPTY */}

                    {!showInitialLoading &&
                        !(isError && !data) && (
                            <FlashList
                                data={products}
                                numColumns={2}
                                estimatedItemSize={190}
                                keyExtractor={item =>
                                    `${STUDENT_ID}-${item.id}`
                                }
                                renderItem={({ item }) => (
                                    <ProductCard
                                        product={item}
                                        onPress={() =>
                                            handleProductPress(item.id)
                                        }
                                    />
                                )}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isRefetching}
                                        onRefresh={handleRefresh}
                                        tintColor={COLORS.primary}
                                    />
                                }
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={
                                    styles.listContent
                                }
                                ListEmptyComponent={
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyTitle}>
                                            Không tìm thấy món
                                        </Text>

                                        <Text style={styles.emptyText}>
                                            Không có món phù hợp với "{search}".
                                        </Text>
                                    </View>
                                }
                            />
                        )}
                </View>

                {/* ================= WATERMARK ================= */}

                <View style={styles.watermarkArea}>
                    <Watermark />
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // ================= SAFE AREA =================

    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    // ================= HEADER =================

    header: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 9,
    },

    logo: {
        fontSize: 25,
        lineHeight: 30,
        fontWeight: '700',
        color: COLORS.white,
        letterSpacing: 0,
        includeFontPadding: false,
    },

    room: {
        marginTop: 2,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500',
        color: COLORS.white,
    },

    // ================= SEARCH =================

    searchWrapper: {
        paddingHorizontal: 10,
        paddingTop: 9,
        paddingBottom: 7,
        backgroundColor: COLORS.background,
    },

    searchInput: {
        height: 44,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 9,
        backgroundColor: COLORS.surface,
        paddingHorizontal: 12,
        fontSize: 13,
        color: COLORS.text,
    },

    // ================= LIST =================

    listContainer: {
        flex: 1,
    },

    listContent: {
        paddingHorizontal: 7,
        paddingBottom: 5,
    },

    // ================= LOADING =================

    centerState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    stateText: {
        marginTop: 10,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textLight,
    },

    // ================= ERROR =================

    errorText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.error,
        textAlign: 'center',
    },

    errorDetail: {
        marginTop: 6,
        fontSize: TYPOGRAPHY.caption,
        color: COLORS.textLight,
    },

    retryText: {
        marginTop: 12,
        fontSize: TYPOGRAPHY.body,
        fontWeight: '700',
        color: COLORS.primary,
    },

    // ================= EMPTY =================

    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 70,
        paddingHorizontal: 20,
    },

    emptyTitle: {
        fontSize: TYPOGRAPHY.heading,
        fontWeight: '700',
        color: COLORS.text,
    },

    emptyText: {
        marginTop: 6,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textLight,
        textAlign: 'center',
    },

    // ================= WATERMARK =================

    watermarkArea: {
        height: 27,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: 8,
    },
});