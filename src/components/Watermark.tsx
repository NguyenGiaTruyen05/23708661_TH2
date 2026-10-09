import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { WATERMARK } from '@constants/student';
import { COLORS } from '@constants/theme';

export function Watermark() {
    return (
        <View style={styles.container}>
            <Text
                style={styles.text}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.65}>
                {WATERMARK}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        fontSize: 9,
        lineHeight: 12,
        color: COLORS.textLight,
        textAlign: 'center',
        fontWeight: '500',
    },
});