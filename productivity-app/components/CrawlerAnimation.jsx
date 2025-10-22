// File: src/components/CrawlerAnimation.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrainCircuitIcon } from './shared/Icons'; // Assuming Icons.jsx is in the shared folder

// Note: This component is a simplified animation for React Native.
// For a true "ping" effect, you would need a more advanced animation library
// like react-native-reanimated.

const CrawlerAnimation = () => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <BrainCircuitIcon height={40} width={40} stroke="#fff" />
            </View>
            <Text style={styles.title}>Analyzing Professor...</Text>
            <Text style={styles.subtitle}>Crawling syllabus and RateMyProfessor for insights...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    iconContainer: {
        height: 96,
        width: 96,
        borderRadius: 48,
        backgroundColor: '#007aff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#007aff',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 4,
    },
});

export default CrawlerAnimation;

