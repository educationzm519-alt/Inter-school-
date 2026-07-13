import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { PaperCard } from '@/components/PaperCard';
import { loadPapers } from '@/utils/storage';
import type { Paper } from '@/data/mockData';

const GRADES = ['All', '7', , '12'] as const;
const SUBJECTS_BY_GRADE: Record<string, string[]> = {
  All: ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'Civic Education', 'History', 'Geography', 'Integrated Science'],
  '7': ['All', 'Mathematics', 'English', 'Integrated Science', 'Social Studies'],
  '9': ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'Civic Education'],
  '12': ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'Civic Education', 'History', 'Geography'],
};

export default function PapersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 34 : 84 + insets.bottom;

  const [selectedGrade, setSelectedGrade] = useState<typeof GRADES[number]>('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPapers = async () => {
    const data = await loadPapers();
    setPapers(data);
  };

  useEffect(() => { fetchPapers(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPapers();
    setRefreshing(false);
  };

  const subjectOptions = SUBJECTS_BY_GRADE[selectedGrade] ?? SUBJECTS_BY_GRADE.All;

  const filtered = useMemo(() => {
    return papers.filter(p => {
      const gradeMatch = selectedGrade === 'All' || p.grade === selectedGrade;
      const subjectMatch = selectedSubject === 'All' || p.subject === selectedSubject;
      return gradeMatch && subjectMatch;
    }).sort((a, b) => b.year - a.year);
  }, [papers, selectedGrade, selectedSubject]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={['#1B4F8A', '#2E6DB4']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>ECZ Past Papers</Text>
            <Text style={styles.headerSub}>Uploaded by schools — Grades 7, 9 and 12</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{papers.length}</Text>
          </View>
        </View>
        {/* Grade Filter */}
        <View style={styles.gradeFilter}>
          {GRADES.map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.gradeTab, { backgroundColor: selectedGrade === g ? '#fff' : 'rgba(255,255,255,0.2)' }]}
              onPress={() => { setSelectedGrade(g); setSelectedSubject('All'); }}
              activeOpacity={0.7}
            >
              <Text style={[styles.gradeTabText, { color: selectedGrade === g ? '#1B4F8A' : '#fff' }]}>
                {g === 'All' ? 'All Grades' : `Grade ${g}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Subject Filter */}
      <View style={[styles.subjectBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <FlatList
          data={subjectOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.subjectPill, { backgroundColor: selectedSubject === item ? colors.primary : colors.muted, borderColor: selectedSubject === item ? colors.primary : colors.border }]}
              onPress={() => setSelectedSubject(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.subjectPillText, { color: selectedSubject === item ? '#fff' : colors.foreground }]}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
        />
      </View>

      {/* Papers List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PaperCard paper={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={64} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Papers Yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Past papers will appear here once your school's teachers upload them.
            </Text>
            <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>
              Pull down to refresh
            </Text>
          </View>
        }
        ListHeaderComponent={
          filtered.length > 0 ? (
            <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>{filtered.length} paper{filtered.length !== 1 ? 's' : ''} found</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular' },
  countBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
  countText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_700Bold' },
  gradeFilter: { flexDirection: 'row', gap: 8 },
  gradeTab: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  gradeTabText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  subjectBar: { borderBottomWidth: 1 },
  subjectPill: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  subjectPillText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  resultCount: { fontSize: 13, fontFamily: 'Inter_500Medium', marginBottom: 8 },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 32, gap: 10 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', marginTop: 8 },
  emptyText: { fontSize: 16, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 24 },
  emptyHint: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 8 },
});
