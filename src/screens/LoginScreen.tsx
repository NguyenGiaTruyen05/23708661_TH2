import React from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useAuthStore } from '@stores/authStore';
import { Watermark } from '@components/Watermark';
import {
    COLORS,
    RADIUS,
    SPACING,
    TYPOGRAPHY,
} from '@constants/theme';
import { STUDENT_ID, STUDENT_NAME } from '@constants/student';

export function LoginScreen() {
    const login = useAuthStore(state => state.login);

    const [phone, setPhone] = React.useState('');

    const handleLogin = () => {
        const value = phone.trim();

        if (!value) {
            Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại.');
            return;
        }

        login(value);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logo}>KTXGO</Text>

                        <Text style={styles.subtitle}>
                            Giao đồ tận phòng ký túc xá
                        </Text>
                    </View>

                    {/* Login form */}
                    <View style={styles.form}>
                        <Text style={styles.label}>Số điện thoại</Text>

                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            placeholder={`Nhập số điện thoại — ${STUDENT_ID}`}
                            placeholderTextColor={COLORS.textLight}
                            keyboardType="phone-pad"
                            autoCapitalize="none"
                            autoCorrect={false}
                            style={styles.input}
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                        />

                        <Pressable
                            onPress={handleLogin}
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed,
                            ]}>
                            <Text style={styles.buttonText}>Vào cửa hàng</Text>
                        </Pressable>
                    </View>

                    {/* Watermark - variant số cuối MSSV = 1 => ở dưới */}
                    <View style={styles.watermarkContainer}>
                        <Watermark />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    keyboardView: {
        flex: 1,
    },

    container: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        backgroundColor: COLORS.background,
    },

    header: {
        alignItems: 'center',
        marginTop: SPACING.xl,
        marginBottom: SPACING.xl,
    },

    logo: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: 1,
    },

    subtitle: {
        marginTop: SPACING.sm,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.textLight,
        textAlign: 'center',
    },

    form: {
        width: '100%',
        marginTop: SPACING.lg,
    },

    label: {
        marginBottom: SPACING.sm,
        fontSize: TYPOGRAPHY.body,
        fontWeight: '600',
        color: COLORS.text,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.md,
        fontSize: TYPOGRAPHY.body,
        color: COLORS.text,
    },

    button: {
        height: 52,
        marginTop: SPACING.md,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonPressed: {
        opacity: 0.8,
    },

    buttonText: {
        fontSize: TYPOGRAPHY.body,
        fontWeight: '700',
        color: COLORS.white,
    },

    watermarkContainer: {
        marginTop: 'auto',
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
        alignItems: 'center',
    },
});