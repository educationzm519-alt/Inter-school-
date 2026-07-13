import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { QuizCard } from '@/components/QuizCard';
import { loadQuizzes } from '@/utils/storage';
import type { QuizSet } from '@/data/mockData';

const SUBJECTS = ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'Civic Education'];

export default function QuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 34 : 84 + insets.bottom;
  const [activeSubject, setActiveSubject] = useState('All');
  const [quizzes, setQuizzes] = useState<QuizSet[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuizzes = async () => {
    const data = await loadQuizzes();
    setQuizzes(data);
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQuizzes();
    setRefreshing(false);
  };

  const filtered = activeSubject === 'All' ? quizzes : quizzes.filter(q => q.subject === activeSubject);

  // Group by subject+grade for display header
  const grouped = filtered.reduce<Record<string, QuizSet[]>>((acc, q) => {
    const key = `${q.subject} · Grade ${q.grade}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={['#2E8B57', '#3DAF6A']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.headerTitle}>Quiz Centre</Text>
        <Text style={styles.headerSub}>Quizzes created by your school's teachers</Text>
        <View style={styles.statsRow}>
          {[
            { label: 'Available', val: quizzes.length.toString() },
            { label: 'Subjects', val: [...new Set(quizzes.map(q => q.subject))].length.toString() },
            { label: 'Questions', val: quizzes.reduce((s, q) => s + q.questionCount, 0).toString() },
          ].map(s => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.val}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Subject Filter */}
      <View style={[styles.filterBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {SUBJECTS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.filterChip, { backgroundColor: activeSubject === s ? colors.secondary : colors.muted, borderColor: activeSubject === s ? colors.secondary : colors.border }]}
              onPress={() => setActiveSubject(s)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, { color: activeSubject === s ? '#fff' : colors.foreground }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <QuizCard quiz={item} onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: item.id } })} />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="school-outline" size={64} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Quizzes Yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Quizzes created by your school's teachers will appear here. Each quiz has 10 questions per part.
            </Text>
            <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>Pull down to refresh</Text>
          </View>
        }
        ListHeaderComponent={
          filtered.length > 0 ? (
            <Text style={[styles.sectionLabel, { color: colors.foreground }]}>
              {activeSubject === 'All' ? 'All Quizzes' : activeSubject} ({filtered.length})
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 6 },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 12, paddingVertical: 12 },
  statItem: { alignItems: 'center', gap: 2 },
  statValue: { color: '#fff', fontSize: 20, fontFamily: 'Inter_700Bold' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontFamily: 'Inter_400Regular' },
  filterBar: { borderBottomWidth: 1 },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  filterChipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  sectionLabel: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 8 },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32, gap: 10 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', marginTop: 8 },
  emptyText: { fontSize: 16, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 24 },
  emptyHint: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4 },
});
