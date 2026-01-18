import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      Alert.alert("Hippo Says:", error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#2E0249', '#57C5B6']} 
      style={styles.container}
    >
      <View style={styles.glassCard}>
        {/* ✅ Image now uses the correct style defined below */}
        <Image 
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/375/375043.png' }} 
          style={styles.hippoImage}
        /> 
        <Text style={styles.title}>{isLogin ? "Welcome Back" : "Join the Herd"}</Text>
        
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>{isLogin ? "Dive In" : "Sign Up"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? "New Hippo? Create Account" : "Already have a spot? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    alignItems: 'center',
  },
  // ✅ ADDED THIS MISSING STYLE
  hippoImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  input: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  button: {
    backgroundColor: '#F806CC',
    width: '100%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#F806CC',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchText: { color: '#ddd', marginTop: 20, fontSize: 14 }
});