import React from 'react';
import {
    Linking,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAuthStore } from '@stores/authStore';
import {
    STUDENT_ID,
    STUDENT_NAME,
    ROOM_LABEL,
} from '@constants/student';
import {
    COLORS,
    RADIUS,
    SPACING,
    TYPOGRAPHY,
} from '@constants/theme';
import { Watermark } from '@components/Watermark';
import { useCampusLocation } from '@hooks/useCampusLocation';

export function MeScreen() {
    const phone = useAuthStore(state => state.phone);
    const logout = useAuthStore(state => state.logout);

    const {
        permissionStatus,
        distanceKm,
        shippingFee,
        error,
        requestLocation,
    } = useCampusLocation();

    const permissionText = {
        idle: 'Chưa lấy vị trí',
        loading: 'Đang lấy vị trí...',
        granted: 'Đã cấp quyền Location',
        denied: 'Quyền Location bị từ chối',
        blocked: 'Quyền Location đang bị chặn',
        error: 'Không thể lấy vị trí',
    }[permissionStatus];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>
                        Thông tin cá nhân
                    </Text>

                    <Text style={styles.label}>Sinh viên</Text>
                    <Text style={styles.value}>
                        {STUDENT_NAME}
                    </Text>

                    <Text style={styles.label}>MSSV</Text>
                    <Text style={styles.value}>
                        {STUDENT_ID}
                    </Text>

                    <Text style={styles.label}>
                        Số điện thoại
                    </Text>
                    <Text style={styles.value}>
                        {phone || 'Chưa đăng nhập'}
                    </Text>

                    <Text style={styles.label}>Phòng</Text>
                    <Text style={styles.value}>
                        {ROOM_LABEL}
                    </Text>
                </View>

                <View style={styles.locationCard}>
                    <Text style={styles.sectionTitle}>
                        Vị trí & phí giao hàng
                    </Text>

                    <View style={styles.statusBox}>
                        <Text style={styles.statusLabel}>
                            Trạng thái Location
                        </Text>

                        <Text style={styles.statusValue}>
                            {permissionText}
                        </Text>
                    </View>

                    {permissionStatus === 'granted' &&
                        distanceKm !== null &&
                        shippingFee !== null ? (
                        <>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>
                                    Khoảng cách
                                </Text>

                                <Text style={styles.infoValue}>
                                    {distanceKm.toFixed(2)} km
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>
                                    Phí ship
                                </Text>

                                <Text style={styles.shippingFee}>
                                    {shippingFee.toLocaleString('vi-VN')}{' '}
                                    đ
                                </Text>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.locationHint}>
                            Cần quyền Location để tính khoảng cách
                            và phí giao hàng.
                        </Text>
                    )}

                    {permissionStatus !== 'loading' && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.locationButton,
                                pressed && styles.pressed,
                            ]}
                            onPress={
                                permissionStatus === 'blocked'
                                    ? () => Linking.openSettings()
                                    : requestLocation
                            }>
                            <Text style={styles.locationButtonText}>
                                {permissionStatus === 'blocked'
                                    ? 'Mở Cài đặt'
                                    : permissionStatus === 'granted'
                                        ? 'Cập nhật vị trí'
                                        : 'Lấy vị trí tính ship'}
                            </Text>
                        </Pressable>
                    )}

                    {!!error && (
                        <Text style={styles.errorText}>
                            {error}
                        </Text>
                    )}
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.pressed,
                    ]}
                    onPress={logout}>
                    <Text style={styles.logoutText}>
                        Đăng xuất
                    </Text>
                </Pressable>

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
        padding: SPACING.lg,
    },

    card: {
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    title: {
        marginBottom: SPACING.lg,
        color: COLORS.text,
        fontSize: TYPOGRAPHY.heading,
        fontWeight: '700',
    },

    label: {
        marginTop: SPACING.md,
        color: COLORS.muted,
        fontSize: TYPOGRAPHY.caption,
    },

    value: {
        marginTop: SPACING.xs,
        color: COLORS.text,
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
    },

    locationCard: {
        marginTop: SPACING.md,
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    sectionTitle: {
        marginBottom: SPACING.md,
        color: COLORS.text,
        fontSize: TYPOGRAPHY.heading,
        fontWeight: '700',
    },

    statusBox: {
        padding: SPACING.sm,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.background,
        marginBottom: SPACING.md,
    },

    statusLabel: {
        color: COLORS.muted,
        fontSize: TYPOGRAPHY.caption,
    },

    statusValue: {
        marginTop: SPACING.xs,
        color: COLORS.text,
        fontSize: TYPOGRAPHY.body,
        fontWeight: '700',
    },

    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },

    infoLabel: {
        color: COLORS.textLight,
        fontSize: TYPOGRAPHY.body,
    },

    infoValue: {
        color: COLORS.text,
        fontSize: TYPOGRAPHY.body,
        fontWeight: '700',
    },

    shippingFee: {
        color: COLORS.secondary,
        fontSize: TYPOGRAPHY.body,
        fontWeight: '800',
    },

    locationHint: {
        color: COLORS.textLight,
        fontSize: TYPOGRAPHY.body,
        lineHeight: 22,
    },

    locationButton: {
        marginTop: SPACING.md,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
    },

    locationButtonText: {
        color: COLORS.white,
        fontSize: TYPOGRAPHY.body,
        fontWeight: '700',
    },

    errorText: {
        marginTop: SPACING.sm,
        color: COLORS.error,
        fontSize: TYPOGRAPHY.caption,
    },

    logoutButton: {
        marginTop: SPACING.md,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.danger,
    },

    pressed: {
        opacity: 0.8,
    },

    logoutText: {
        color: COLORS.white,
        fontSize: TYPOGRAPHY.body,
        fontWeight: '700',
    },
});