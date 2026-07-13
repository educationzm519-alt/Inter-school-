import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';
import * as Haptics from 'expo-haptics';

const MENU_ITEMS = [
  { label: 'My Progress', icon: 'trending-up-outline' as const, color: '#1B4F8A' },
  { label: 'Saved Notes', icon: 'bookmarks-outline' as const, color: '#2E8B57' },
  { label: 'Downloaded Papers', icon: 'download-outline' as const, color: '#D4770A' },
  { label: 'Quiz History', icon: 'time-outline' as const, color: '#6B2D99' },
  { label: 'Notifications', icon: 'notifications-outline' as const, color: '#1A8BB8' },
  { label: 'Help & Support', icon: 'help-circle-outline' as const, color: '#2E8B57' },
  { label: 'About ECZ Study', icon: 'information-circle-outline' as const, color: '#9EA5AD' },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 34 : 84 + insets.bottom;

  const initials = (user?.name ?? 'S U').split(' ').map(n => n[0]).join('').slice(0, 2);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
          await logout();
          // Students can still use the app without being logged in
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  const handleTeacherLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient colors={['#1B4F8A', '#2E6DB4']} style={[styles.header, { paddingTop: topPad + 20 }]}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
        <Text style={styles.userName}>{user?.name ?? 'Student'}</Text>
        <View style={styles.rolePill}>
          <Ionicons name="person-outline" size={12} color="rgba(255,255,255,0.9)" />
          <Text style={styles.roleText}>
            {user?.role === 'student' ? `Grade ${user.grade} Student`
              : user?.role === 'teacher' ? `${user.subject ?? ''} Teacher`
              : user ? 'Administrator' : 'Guest Student'}
          </Text>
        </View>
        {user?.school ? <Text style={styles.schoolText}>{user.school}</Text> : null}
      </LinearGradient>

      {/* Stats */}
      <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { label: 'Quizzes', value: '—', icon: 'checkmark-circle-outline' as const, color: '#1B4F8A' },
          { label: 'Avg Score', value: '—', icon: 'analytics-outline' as const, color: '#2E8B57' },
          { label: 'Papers', value: '—', icon: 'document-outline' as const, color: '#D4770A' },
          { label: 'Streak', value: '—', icon: 'flame-outline' as const, color: '#C0392B' },
        ].map(s => (
          <View key={s.label} style={styles.statItem}>
            <Ionicons name={s.icon} size={20} color={s.color} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Account Info */}
      {user ? (
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Account Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
            <View>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{user.email}</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.mutedForeground} />
            <View>
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Member Since</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{user.joinedAt}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* Menu */}
      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {MENU_ITEMS.map((item, i) => (
          <React.Fragment key={item.label}>
            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
            {i < MENU_ITEMS.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
          </React.Fragment>
        ))}
      </View>

      {/* Teacher/Admin Login button */}
      {!user && (
        <TouchableOpacity
          style={[styles.teacherBtn, { backgroundColor: colors.card, borderColor: colors.primary }]}
          onPress={handleTeacherLogin}
          activeOpacity={0.8}
        >
          <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
          <Text style={[styles.teacherBtnText, { color: colors.primary }]}>Teacher / Admin Login</Text>
        </TouchableOpacity>
      )}

      {/* Logout */}
      {user && (
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.destructive }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.version, { color: colors.mutedForeground }]}>MY ECZ STUDY v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24, gap: 8 },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { color: '#fff', fontSize: 30, fontFamily: 'Inter_700Bold' },
  userName: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  rolePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
  },
  roleText: { color: 'rgba(255,255,255,0.95)', fontSize: 13, fontFamily: 'Inter_500Medium' },
  schoolText: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: 'Inter_400Regular' },
  statsCard: {
    flexDirection: 'row', margin: 16, borderRadius: 14, borderWidth: 1, padding: 16,
    justifyContent: 'space-around',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  section: {
    marginHorizontal: 16, marginBottom: 12, borderRadius: 14, borderWidth: 1, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  infoValue: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  divider: { height: 1, marginVertical: 10 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  teacherBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 12, height: 52, borderRadius: 14, borderWidth: 2,
  },
  teacherBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 12, height: 52, borderRadius: 14, borderWidth: 2,
  },
  logoutText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  version: { textAlign: 'center', fontSize: 12, fontFamily: 'Inter_400Regular', marginBottom: 20 },
});
