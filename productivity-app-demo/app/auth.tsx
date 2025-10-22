// File: app/auth.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { supabase } from '../src/lib/supabase'; // Make sure this path is correct

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>AcademiGit</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={'none'}
                />
                <TouchableOpacity style={styles.button} onPress={signInWithEmail} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={signUpWithEmail} disabled={loading}>
                    <Text style={[styles.buttonText, styles.signUpButtonText]}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f5' },
    content: { flex: 1, justifyContent: 'center', padding: 20 },
    header: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
    input: { height: 50, backgroundColor: '#fff', marginBottom: 12, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: '#e4e4e7' },
    button: { height: 50, backgroundColor: '#007aff', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    signUpButton: { backgroundColor: '#e4e4e7' },
    signUpButtonText: { color: '#18181b' },
});