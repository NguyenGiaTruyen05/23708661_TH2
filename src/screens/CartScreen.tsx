import React from 'react';
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '@constants/theme';
import {
    PRICE_MULTIPLIER,
    ROOM_LABEL,
} from '@constants/student';
import { useCartStore } from '@stores/cartStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { Watermark } from '@components/Watermark';

export function CartScreen() {
    const items = useCartStore(state => state.items);
    const changeQty = useCartStore(state => state.changeQty);
    const removeItem = useCartStore(state => state.removeItem);
    const totalQuantity = useCartStore(state => state.totalQuantity());
    const totalAmount = useCartStore(state => state.totalAmount());

    const {
        permissionStatus,
        distanceKm,
        shippingFee,
        error,
        requestLocation,
    } = useCampusLocation();

    const grandTotal =
        totalAmount + (shippingFee ?? 0);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>GIỎ HÀNG</Text>

                <View style={styles.roomBox}>
                    <Text style={styles.roomText}>
                        Giao tận {ROOM_LABEL}
                    </Text>
                </View>

                {items.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyTitle}>
                            Giỏ hàng đang trống
                        </Text>
                        <Text style={styles.emptyText}>
                            Hãy quay lại Shop để thêm sản phẩm.
                        </Text>
                    </View>
                ) : (
                    <>
                        <FlashList
                            data={items}
                            keyExtractor={item =>
                                String(item.product.id)
                            }
                            estimatedItemSize={130}
                            contentContainerStyle={styles.list}
                            renderItem={({ item }) => {
                                const unitPrice = Math.round(
                                    item.product.price * PRICE_MULTIPLIER,
                                );

                                const itemAmount =
                                    unitPrice * item.quantity;

                                return (
                                    <View style={styles.itemCard}>
                                        <View style={styles.itemInfo}>
                                            <Text
                                                style={styles.itemTitle}
                                                numberOfLines={2}>
                                                {item.product.title}
                                            </Text>

                                            <Text style={styles.unitPrice}>
                                                {unitPrice.toLocaleString(
                                                    'vi-VN',
                                                )}{' '}
                                                đ / sản phẩm
                                            </Text>

                                            <Text style={styles.itemAmount}>
                                                {itemAmount.toLocaleString(
                                                    'vi-VN',
                                                )}{' '}
                                                đ
                                            </Text>
                                        </View>

                                        <View style={styles.actions}>
                                            <View style={styles.quantityRow}>
                                                <Pressable
                                                    style={styles.quantityButton}
                                                    onPress={() =>
                                                        changeQty(
                                                            item.product.id,
                                                            item.quantity - 1,
                                                        )
                                                    }>
                                                    <Text
                                                        style={
                                                            styles.quantityText
                                                        }>
                                                        −
                                                    </Text>
                                                </Pressable>

                                                <Text style={styles.quantity}>
                                                    {item.quantity}
                                                </Text>

                                                <Pressable
                                                    style={styles.quantityButton}
                                                    onPress={() =>
                                                        changeQty(
                                                            item.product.id,
                                                            item.quantity + 1,
                                                        )
                                                    }>
                                                    <Text
                                                        style={
                                                            styles.quantityText
                                                        }>
                                                        +
                                                    </Text>
                                                </Pressable>
                                            </View>

                                            <Pressable
                                                onPress={() =>
                                                    removeItem(item.product.id)
                                                }>
                                                <Text style={styles.removeText}>
                                                    Xóa
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                );
                            }}
                        />

                        <View style={styles.summary}>
                            <Text style={styles.summaryTitle}>
                                Tóm tắt đơn hàng
                            </Text>

                            <View style={styles.row}>
                                <Text style={styles.label}>
                                    Số lượng
                                </Text>
                                <Text style={styles.value}>
                                    {totalQuantity}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>
                                    Tiền hàng
                                </Text>
                                <Text style={styles.value}>
                                    {totalAmount.toLocaleString(
                                        'vi-VN',
                                    )}{' '}
                                    đ
                                </Text>
                            </View>

                            <View style={styles.locationBox}>
                                <Text style={styles.locationTitle}>
                                    Phí giao hàng
                                </Text>

                                {permissionStatus === 'granted' &&
                                    distanceKm !== null &&
                                    shippingFee !== null ? (
                                    <>
                                        <Text style={styles.locationText}>
                                            Khoảng cách:{' '}
                                            {distanceKm.toFixed(2)} km
                                        </Text>

                                        <Text style={styles.shippingFee}>
                                            {shippingFee.toLocaleString(
                                                'vi-VN',
                                            )}{' '}
                                            đ
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.locationText}>
                                            Chưa có vị trí để tính phí ship.
                                        </Text>

                                        <Pressable
                                            style={styles.locationButton}
                                            onPress={requestLocation}>
                                            <Text
                                                style={
                                                    styles.locationButtonText
                                                }>
                                                Lấy vị trí tính ship
                                            </Text>
                                        </Pressable>
                                    </>
                                )}

                                {!!error && (
                                    <Text style={styles.errorText}>
                                        {error}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>
                                    Tổng cộng
                                </Text>

                                <Text style={styles.totalValue}>
                                    {grandTotal.toLocaleString('vi-VN')}{' '}
                                    đ
                                </Text>
                            </View>
                        </View>
                    </>
                )}

                <Watermark />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    container: {
        flex: 1,
        paddingHorizontal: SPACING.md,
    },

    title: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text,
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },

    roomBox: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.sm,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    roomText: {
        color: COLORS.text,
        fontWeight: '700',
    },

    list: {
        paddingBottom: SPACING.sm,
    },

    itemCard: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    itemInfo: {
        marginBottom: SPACING.sm,
    },

    itemTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '700',
    },

    unitPrice: {
        color: COLORS.textLight,
        marginTop: 4,
    },

    itemAmount: {
        color: COLORS.primary,
        fontWeight: '800',
        marginTop: 4,
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    quantityButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    quantityText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: '800',
    },

    quantity: {
        minWidth: 40,
        textAlign: 'center',
        color: COLORS.text,
        fontWeight: '700',
    },

    removeText: {
        color: COLORS.danger,
        fontWeight: '700',
    },

    summary: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.sm,
    },

    summaryTitle: {
        color: COLORS.text,
        fontSize: 17,
        fontWeight: '800',
        marginBottom: SPACING.sm,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    label: {
        color: COLORS.textLight,
    },

    value: {
        color: COLORS.text,
        fontWeight: '700',
    },

    locationBox: {
        marginTop: SPACING.sm,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },

    locationTitle: {
        color: COLORS.text,
        fontWeight: '800',
        marginBottom: 4,
    },

    locationText: {
        color: COLORS.textLight,
        marginBottom: 6,
    },

    shippingFee: {
        color: COLORS.secondary,
        fontSize: 16,
        fontWeight: '800',
    },

    locationButton: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.sm,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },

    locationButtonText: {
        color: COLORS.white,
        fontWeight: '700',
    },

    errorText: {
        color: COLORS.error,
        marginTop: 6,
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },

    totalLabel: {
        color: COLORS.text,
        fontSize: 17,
        fontWeight: '800',
    },

    totalValue: {
        color: COLORS.primary,
        fontSize: 18,
        fontWeight: '900',
    },

    emptyBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    emptyTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '800',
    },

    emptyText: {
        color: COLORS.textLight,
        marginTop: 6,
    },
});