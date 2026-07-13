import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { STUDENT_RECORDS } from '@/data/mockData';

export default function StudentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 34 : 84 + insets.bottom;
  const [search, setSearch] = useState('');

  const filtered = STUDENT_RECORDS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.grade.includes(search)
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>My Students</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{STUDENT_RECORDS.length} enrolled students</Text>
        <View style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search by name or grade..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.avatar, { backgroundColor: item.avgScore >= 80 ? '#2E8B5720' : item.avgScore >= 60 ? '#E0870020' : '#C0392B20' }]}>
              <Text style={[styles.avatarText, { color: item.avgScore >= 80 ? '#2E8B57' : item.avgScore >= 60 ? '#E08700' : '#C0392B' }]}>
                {item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.foreground }]}>{item.name}</Text>
              <Text style={[styles.meta, { color: colors.mutedForeground }]}>Grade {item.grade} · {item.school}</Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Ionicons name="checkmark-circle-outline" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.statText, { color: colors.mutedForeground }]}>{item.quizzesCompleted} quizzes</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="time-outline" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.statText, { color: colors.mutedForeground }]}>{item.lastActive}</Text>
                </View>
              </View>
            </View>
            <View style={styles.scoreBox}>
              <Text style={[styles.score, { color: item.avgScore >= 80 ? '#2E8B57' : item.avgScore >= 60 ? '#E08700' : '#C0392B' }]}>{item.avgScore}%</Text>
              <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>avg</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12, gap: 6, borderBottomWidth: 1 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, height: 44, marginTop: 8 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  name: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  meta: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  statText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  scoreBox: { alignItems: 'center' },
  score: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  scoreLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
});
