import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, KeyboardAvoidingView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';
import * as Haptics from 'expo-haptics';

const DEMO_ACCOUNTS = [
  { label: 'Student Demo', email: 'student@ecz.zm', password: 'student123', color: '#1B4F8A' },
  { label: 'Teacher Demo', email: 'teacher@ecz.zm', password: 'teacher123', color: '#2E8B57' },
  { label: 'Admin Demo', email: 'admin@ecz.zm', password: 'admin123', color: '#D4770A' },
];

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (!result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Login Failed', result.error ?? 'Please check your credentials.');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    }
  };

  const handleDemoLogin = async (demo: typeof DEMO_ACCOUNTS[0]) => {
    setLoading(true);
    await login(demo.email, demo.password);
    setLoading(false);
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Gradient */}
        <LinearGradient colors={['#1B4F8A', '#2E6DB4']} style={[styles.header, { paddingTop: topPad + 20 }]}>
          <View style={styles.logoBox}>
            <Ionicons name="school" size={48} color="#fff" />
          </View>
          <Text style={styles.appName}>MY ECZ STUDY</Text>
          <Text style={styles.tagline}>Zambia's Premier Exam Preparation Platform</Text>
        </LinearGradient>

        {/* Login Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Welcome Back</Text>
          <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>Sign in to continue your studies</Text>

          {/* Email */}
          <View style={[styles.inputContainer, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={20} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Email address"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password */}
          <View style={[styles.inputContainer, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Password"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <Text style={styles.loginBtnText}>Signing in...</Text>
            ) : (
              <>
                <Ionicons name="log-in-outline" size={22} color="#fff" />
                <Text style={styles.loginBtnText}>Sign In</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Register link */}
          <TouchableOpacity onPress={() => router.push('/(auth)/register')} activeOpacity={0.7}>
            <Text style={[styles.registerLink, { color: colors.mutedForeground }]}>
              Don't have an account?{' '}
              <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>Register here</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo Accounts */}
        <View style={styles.demoSection}>
          <Text style={[styles.demoTitle, { color: colors.mutedForeground }]}>Quick Demo Login</Text>
          <View style={styles.demoRow}>
            {DEMO_ACCOUNTS.map(demo => (
              <TouchableOpacity
                key={demo.email}
                style={[styles.demoBtn, { backgroundColor: demo.color + '15', borderColor: demo.color + '40' }]}
                onPress={() => handleDemoLogin(demo)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={demo.label.includes('Student') ? 'person-outline' : demo.label.includes('Teacher') ? 'school-outline' : 'shield-outline'}
                  size={18}
                  color={demo.color}
                />
                <Text style={[styles.demoBtnText, { color: demo.color }]}>{demo.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 40, gap: 8 },
  logoBox: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  appName: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#fff', letterSpacing: 1 },
  tagline: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  card: {
    margin: 16, borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
    gap: 14,
  },
  cardTitle: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  cardSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: -6 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 54,
  },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  loginBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 56, borderRadius: 14,
  },
  loginBtnText: { color: '#fff', fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  registerLink: { textAlign: 'center', fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 4 },
  demoSection: { paddingHorizontal: 16, gap: 10, marginBottom: 8 },
  demoTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textAlign: 'center', letterSpacing: 0.5 },
  demoRow: { flexDirection: 'row', gap: 8 },
  demoBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderRadius: 12, borderWidth: 1, paddingVertical: 12,
  },
  demoBtnText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
});
