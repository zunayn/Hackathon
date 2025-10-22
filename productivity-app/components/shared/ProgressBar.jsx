// File: src/components/shared/ProgressBar.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ value }) => {
    return (
        <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${value}%` }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    progressBarBackground: {
        height: 6,
        backgroundColor: '#e4e4e7',
        borderRadius: 3,
    },
    progressBarFill: {
        height: 6,
        backgroundColor: '#007aff',
        borderRadius: 3,
    },
});

export default ProgressBar;

