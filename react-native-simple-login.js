// SIMPLE, WORKING REACT NATIVE LOGIN
// Copy and paste this into your React Native project

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: For Android emulator, use: http://10.0.2.2:8000/api
// For iOS simulator or physical device, use: http://localhost:8000/api or your computer's IP
const API_BASE_URL = 'http://localhost:8000/api'; // Change this if needed

/**
 * Login function - Clean, working implementation
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const login = async (email, password) => {
  try {
    // Make POST request to login endpoint
    const response = await axios.post(
      `${API_BASE_URL}/login`,
      {
        email: email.trim(),
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    // Check if response has the expected structure
    if (response.data && response.data.token && response.data.user) {
      // Store token and user data
      await AsyncStorage.setItem('auth_token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        error: 'Invalid response from server',
      };
    }
  } catch (error) {
    // Handle errors
    let errorMessage = 'Login failed. Please try again.';

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        errorMessage = data.message || 'Invalid email or password';
      } else if (status === 422) {
        // Validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          errorMessage = errorMessages.join(', ');
        } else {
          errorMessage = data.message || 'Validation error';
        }
      } else {
        errorMessage = data.message || `Error: ${status}`;
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'Network error. Please check your connection and API URL.';
    } else {
      // Something else happened
      errorMessage = error.message || 'An unexpected error occurred';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Example usage in a React Native component:
/*
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { login } from './react-native-simple-login';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Login successful!');
      // Navigate to your main screen
      // navigation.navigate('Home');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 }}
      />
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#007AFF',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen;
*/

