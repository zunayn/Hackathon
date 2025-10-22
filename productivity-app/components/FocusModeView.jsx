// File: src/components/FocusModeView.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform } from 'react-native';

const FocusModeView = ({ task, onExit }) => {
    const FOCUS_DURATION = 25 * 60; // 25 minutes
    const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.content}>
                <Text style={styles.focusingOnText}>Focusing on:</Text>
                <Text style={styles.taskTitle}>{task.text}</Text>
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                </View>
                 <Text style={styles.etaText}>Estimated time: {task.eta}h</Text>
                <TouchableOpacity 
                    style={styles.exitButton}
                    onPress={onExit}
                >
                    <Text style={styles.exitButtonText}>End Session</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(24, 24, 27, 0.95)',
        zIndex: 50,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    focusingOnText: {
        fontSize: 18,
        color: '#a1a1aa',
        marginBottom: 8,
    },
    taskTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        maxWidth: '90%',
    },
    timerContainer: {
        marginVertical: 48,
    },
    timerText: {
        fontSize: 96,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    },
    etaText: {
        fontSize: 16,
        color: '#d4d4d8',
        marginBottom: 20,
    },
    exitButton: {
        marginTop: 32,
        paddingHorizontal: 32,
        paddingVertical: 12,
        backgroundColor: '#dc2626',
        borderRadius: 999,
    },
    exitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FocusModeView;

