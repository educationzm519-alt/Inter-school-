import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 34 : 84 + insets.bottom;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const MENU_ITEMS = [
    { label: 'System Settings', icon: 'settings-outline' as const, color: '#1B4F8A' },
    { label: 'Firebase Console', icon: 'cloud-outline' as const, color: '#2E8B57' },
    { label: 'Community Moderation', icon: 'shield-checkmark-outline' as const, color: '#D4770A' },
    { label: 'Announcements', icon: 'megaphone-outline' as const, color: '#6B2D99' },
    { label: 'System Logs', icon: 'list-outline' as const, color: '#1A8BB8' },
    { label: 'Backup Data', icon: 'save-outline' as const, color: '#2E8B57' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#D4770A', '#F5A623']} style={[styles.header, { paddingTop: topPad + 20 }]}>
        <View style={styles.avatar}>
          <Ionicons name="shield-checkmark" size={36} color="#D4770A" />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <View style={styles.rolePill}>
          <Ionicons name="shield-outline" size={12} color="rgba(255,255,255,0.9)" />
          <Text style={styles.roleText}>System Administrator</Text>
        </View>
        <Text style={styles.email}>{user?.email}</Text>
      </LinearGradient>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {MENU_ITEMS.map((item, i, arr) => (
          <React.Fragment key={item.label}>
            <TouchableOpacity style={styles.menuRow} onPress={() => Alert.alert(item.label, `Opening ${item.label}...`)} activeOpacity={0.7}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
            {i < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
          </React.Fragment>
        ))}
      </View>

      <TouchableOpacity style={[styles.logoutBtn, { borderColor: colors.destructive }]} onPress={handleLogout} activeOpacity={0.8}>
        <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
        <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24, gap: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  rolePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  roleText: { color: 'rgba(255,255,255,0.95)', fontSize: 13, fontFamily: 'Inter_500Medium' },
  email: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' },
  section: { margin: 16, borderRadius: 14, borderWidth: 1, padding: 16, gap: 4 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  divider: { height: 1, marginVertical: 4 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, height: 52, borderRadius: 14, borderWidth: 2, marginBottom: 8 },
  logoutText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
});
