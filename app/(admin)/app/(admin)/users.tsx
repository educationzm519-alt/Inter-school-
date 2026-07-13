import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { STUDENT_RECORDS } from '@/data/mockData';

const ALL_USERS = [
  ...STUDENT_RECORDS.map(s => ({ ...s, role: 'student' as const })),
  { id: 'teacher_demo', name: 'Mrs. Esther Banda', grade: '-', school: 'Lusaka Boys Secondary', quizzesCompleted: 0, avgScore: 0, lastActive: 'Today', role: 'teacher' as const },
  { id: 'admin_demo', name: 'System Administrator', grade: '-', school: 'ECZ HQ', quizzesCompleted: 0, avgScore: 0, lastActive: 'Today', role: 'admin' as const },
];

const ROLE_COLORS = { student: '#1B4F8A', teacher: '#2E8B57', admin: '#D4770A' };
const ROLE_ICONS = { student: 'person-outline', teacher: 'school-outline', admin: 'shield-outline' };

export default function UsersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 34 : 84 + insets.bottom;
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');

  const filtered = ALL_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>User Management</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{ALL_USERS.length} registered users</Text>
        <View style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
          <TextInput style={[styles.searchInput, { color: colors.foreground }]} placeholder="Search users..." placeholderTextColor={colors.mutedForeground} value={search} onChangeText={setSearch} />
        </View>
        <View style={styles.roleFilter}>
          {(['all', 'student', 'teacher', 'admin'] as const).map(r => (
            <TouchableOpacity key={r} style={[styles.roleChip, { backgroundColor: roleFilter === r ? (r === 'all' ? colors.primary : ROLE_COLORS[r]) : colors.muted, borderColor: roleFilter === r ? (r === 'all' ? colors.primary : ROLE_COLORS[r]) : colors.border }]} onPress={() => setRoleFilter(r)} activeOpacity={0.7}>
              <Text style={[styles.roleChipText, { color: roleFilter === r ? '#fff' : colors.foreground }]}>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const roleColor = ROLE_COLORS[item.role];
          return (
            <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.avatar, { backgroundColor: roleColor + '20' }]}>
                <Text style={[styles.avatarText, { color: roleColor }]}>{item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.userName, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.userMeta, { color: colors.mutedForeground }]}>{item.school}</Text>
                <View style={[styles.rolePill, { backgroundColor: roleColor + '15', borderColor: roleColor + '40' }]}>
                  <Text style={[styles.rolePillText, { color: roleColor }]}>{item.role}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => Alert.alert('Edit User', `Edit details for ${item.name}`)} activeOpacity={0.7}>
                  <Ionicons name="create-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('Remove User', `Are you sure you want to remove ${item.name}?`)} activeOpacity={0.7}>
                  <Ionicons name="trash-outline" size={20} color={colors.destructive} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12, gap: 8, borderBottomWidth: 1 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, height: 44 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  roleFilter: { flexDirection: 'row', gap: 8 },
  roleChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6 },
  roleChipText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  userCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  userName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  userMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  rolePill: { alignSelf: 'flex-start', borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  rolePillText: { fontSize: 11, fontFamily: 'Inter_600SemiBold', textTransform: 'capitalize' },
  actions: { flexDirection: 'row', gap: 14 },
});
