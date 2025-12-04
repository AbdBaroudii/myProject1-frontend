# React Native Login Implementation Guide

This guide provides a complete, working React Native login implementation that integrates with your Laravel API.

## Installation

First, install the required dependencies:

```bash
npm install axios @react-native-async-storage/async-storage
```

For iOS, you may also need to install pods:
```bash
cd ios && pod install
```

## Important: Network Configuration

### For Android (Android Emulator)
If you're using Android emulator, `localhost` won't work. Use:
- `http://10.0.2.2:8000/api` (Android emulator)
- Or use your computer's IP address: `http://192.168.1.X:8000/api`

### For iOS (iOS Simulator)
- `http://localhost:8000/api` should work
- Or use your computer's IP address: `http://192.168.1.X:8000/api`

### For Physical Devices
Use your computer's local IP address:
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Use: `http://YOUR_IP:8000/api`

## Usage

### Option 1: Simple Login Component

Use the complete `LoginScreen` component from `react-native-login-example.js`:

```javascript
import LoginScreen from './react-native-login-example';

function App() {
  const handleLoginSuccess = (data) => {
    console.log('Login successful!', data);
    // Navigate to your main app screen
  };

  return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
}
```

### Option 2: Using the API Service

Use the `authAPI` from `react-native-api-service.js`:

```javascript
import { authAPI } from './react-native-api-service';

// In your component
const handleLogin = async () => {
  const result = await authAPI.login(email, password);
  
  if (result.success) {
    console.log('Login successful!', result.data);
    // Navigate to main app
  } else {
    console.error('Login failed:', result.error);
    // Show error to user
  }
};
```

## Complete Example

Here's a minimal working example:

```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { authAPI } from './react-native-api-service';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await authAPI.login(email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Login successful!');
      // Navigate to your main screen
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
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{ backgroundColor: '#007AFF', padding: 15, alignItems: 'center' }}
      >
        <Text style={{ color: 'white' }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## Common Issues and Solutions

### 1. Network Error / Connection Refused

**Problem**: `Network error. Please check your connection.`

**Solutions**:
- Make sure your Laravel server is running
- Check the API URL (use `10.0.2.2` for Android emulator)
- Verify CORS is configured in Laravel
- Check firewall settings

### 2. CORS Errors

**Problem**: CORS policy blocking requests

**Solution**: Make sure your Laravel backend has CORS configured for your React Native app. In `config/cors.php`:

```php
'allowed_origins' => ['*'], // Or specific origins
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
```

### 3. Token Not Persisting

**Problem**: User gets logged out after app restart

**Solution**: Make sure `@react-native-async-storage/async-storage` is properly installed and linked.

### 4. 401 Unauthorized Errors

**Problem**: Getting 401 even with valid credentials

**Solutions**:
- Check token format: Should be `Bearer {token}`
- Verify token is being sent in Authorization header
- Check if token expired (Laravel tokens don't expire by default, but check your config)

## Testing

Test with the demo credentials:
- Email: `john@example.com`
- Password: `password`

## API Response Format

The login endpoint should return:
```json
{
  "message": "Login successful",
  "user": {
    "id": 37,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-11-23 13:05:47"
  },
  "token": "18|G9zjqssncnJlTO3zlkihzF5IVgzbBNrwWq1xlgZwcedfc98b"
}
```

The implementation handles this format correctly and stores both the token and user data.

## Next Steps

1. After successful login, navigate to your main app screen
2. Use `authAPI.getCurrentUser()` to check if user is logged in on app start
3. Use `authAPI.logout()` when user logs out
4. Use the `tasksAPI` for task management operations

