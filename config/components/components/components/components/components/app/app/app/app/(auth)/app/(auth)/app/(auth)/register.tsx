import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, type UserRole, type RegisterData } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';
import * as Haptics from 'expo-haptics';

const GRADES = ['7', '8', '9', '10', '11', '12'];
const SUBJECTS = ['Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'Civic Education', 'History', 'Geography'];
const SCHOOLS = ['Lusaka Boys Secondary', 'Northmead Secondary', 'Matero Girls', 'Kabulonga Boys', 'Chongwe Secondary', 'Ndola Secondary', 'Kitwe Boys', 'Other'];

const ROLES: { value: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap; desc: string; color: string }[] = [
  { value: 'student', label: 'Student', icon: 'person-outline', desc: 'Prepare for ECZ exams', color: '#1B4F8A' },
  { value: 'teacher', label: 'Teacher', icon: 'school-outline', desc: 'Manage and teach students', color: '#2E8B57' },
  { value: 'admin', label: 'Admin', icon: 'shield-outline', desc: 'Administer the platform', color: '#D4770A' },
];

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [grade, setGrade] = useState('12');
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!name.trim()) { Alert.alert('Required', 'Please enter your name.'); return; }
    if (!email.trim() || !email.includes('@')) { Alert.alert('Required', 'Please enter a valid email.'); return; }
    if (password.length < 6) { Alert.alert('Required', 'Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { Alert.alert('Mismatch', 'Passwords do not match.'); return; }
    setStep(2);
  };

  const handleRegister = async () => {
    setLoading(true);
    const data: RegisterData = { name, email, password, role, grade: role === 'student' ? grade : undefined, school: school || undefined, subject: role === 'teacher' ? subject : undefined };
    const result = await register(data);
    setLoading(false);
    if (!result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Registration Failed', result.error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={['#1B4F8A', '#2E6DB4']} style={[styles.header, { paddingTop: topPad + 16 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => step === 1 ? router.back() : setStep(1)}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.stepIndicator}>
          <View style={[styles.step, { backgroundColor: '#fff' }]}><Text style={[styles.stepText, { color: '#1B4F8A' }]}>1</Text></View>
          <View style={[styles.stepLine, { backgroundColor: step === 2 ? '#fff' : 'rgba(255,255,255,0.4)' }]} />
          <View style={[styles.step, { backgroundColor: step === 2 ? '#fff' : 'rgba(255,255,255,0.3)' }]}>
            <Text style={[styles.stepText, { color: step === 2 ? '#1B4F8A' : '#fff' }]}>2</Text>
          </View>
        </View>
        <Text style={styles.stepLabel}>{step === 1 ? 'Personal Information' : 'Account Type & Details'}</Text>
      </LinearGradient>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {step === 1 ? (
          <>
            <Field icon="person-outline" placeholder="Full Name" value={name} onChangeText={setName} colors={colors} />
            <Field icon="mail-outline" placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" colors={colors} />
            <Field icon="lock-closed-outline" placeholder="Password (min. 6 chars)" value={password} onChangeText={setPassword} secure={!showPassword} colors={colors}
              rightIcon={<TouchableOpacity onPress={() => setShowPassword(!showPassword)}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.mutedForeground} /></TouchableOpacity>}
            />
            <Field icon="lock-closed-outline" placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secure={!showPassword} colors={colors} />
            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.primaryBtnText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>I am a...</Text>
            <View style={styles.roleGrid}>
              {ROLES.map(r => (
                <TouchableOpacity
                  key={r.value}
                  style={[styles.roleCard, { borderColor: role === r.value ? r.color : colors.border, backgroundColor: role === r.value ? r.color + '12' : colors.muted }]}
                  onPress={() => setRole(r.value)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={r.icon} size={26} color={role === r.value ? r.color : colors.mutedForeground} />
                  <Text style={[styles.roleLabel, { color: role === r.value ? r.color : colors.foreground }]}>{r.label}</Text>
                  <Text style={[styles.roleDesc, { color: colors.mutedForeground }]}>{r.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {role === 'student' && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Grade</Text>
                <View style={styles.gradeRow}>
                  {GRADES.map(g => (
                    <TouchableOpacity key={g} style={[styles.gradeChip, { backgroundColor: grade === g ? colors.primary : colors.muted, borderColor: grade === g ? colors.primary : colors.border }]} onPress={() => setGrade(g)} activeOpacity={0.7}>
                      <Text style={[styles.gradeChipText, { color: grade === g ? '#fff' : colors.foreground }]}>Gr {g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {role === 'teacher' && (
              <>
                <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Main Subject</Text>
                <View style={styles.subjectGrid}>
                  {SUBJECTS.slice(0, 6).map(s => (
                    <TouchableOpacity key={s} style={[styles.subjectChip, { backgroundColor: subject === s ? colors.secondary : colors.muted, borderColor: subject === s ? colors.secondary : colors.border }]} onPress={() => setSubject(s)} activeOpacity={0.7}>
                      <Text style={[styles.subjectChipText, { color: subject === s ? '#fff' : colors.foreground }]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>School (Optional)</Text>
            <View style={styles.schoolGrid}>
              {SCHOOLS.map(s => (
                <TouchableOpacity key={s} style={[styles.schoolChip, { backgroundColor: school === s ? colors.primary + '15' : colors.muted, borderColor: school === s ? colors.primary : colors.border }]} onPress={() => setSchool(s)} activeOpacity={0.7}>
                  <Text style={[styles.schoolChipText, { color: school === s ? colors.primary : colors.foreground }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: colors.secondary, opacity: loading ? 0.7 : 1 }]} onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text style={styles.primaryBtnText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} activeOpacity={0.7}>
          <Text style={[styles.loginLink, { color: colors.mutedForeground }]}>
            Already have an account? <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 20 }} />
    </ScrollView>
  );
}

function Field({ icon, placeholder, value, onChangeText, keyboardType, autoCapitalize, secure, rightIcon, colors }: any) {
  return (
    <View style={[styles.inputContainer, { backgroundColor: colors.muted, borderColor: colors.border }]}>
      <Ionicons name={icon} size={20} color={colors.mutedForeground} />
      <TextInput
        style={[styles.input, { color: colors.foreground }]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'words'}
        secureTextEntry={secure ?? false}
        autoCorrect={false}
      />
      {rightIcon}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 24, gap: 8 },
  backBtn: { alignSelf: 'flex-start', padding: 4, marginBottom: 4 },
  headerTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#fff' },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', gap: 0, marginTop: 8 },
  step: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  stepLine: { width: 40, height: 2 },
  stepLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter_500Medium' },
  card: {
    margin: 16, borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5,
    gap: 14,
  },
  sectionLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', marginBottom: -4 },
  roleGrid: { flexDirection: 'row', gap: 8 },
  roleCard: { flex: 1, borderRadius: 12, borderWidth: 2, padding: 12, alignItems: 'center', gap: 4 },
  roleLabel: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  roleDesc: { fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  gradeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gradeChip: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
  gradeChipText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  subjectGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjectChip: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  subjectChipText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  schoolGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  schoolChip: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  schoolChipText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, height: 54,
  },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 56, borderRadius: 14, marginTop: 4,
  },
  primaryBtnText: { color: '#fff', fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  loginLink: { textAlign: 'center', fontSize: 14, fontFamily: 'Inter_400Regular' },
});
