import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { loadNotes } from '@/utils/storage';
import type { Note } from '@/data/mockData';

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#1B4F8A', Biology: '#2E8B57', Chemistry: '#D4770A',
  Physics: '#6B2D99', English: '#C0392B', 'Civic Education': '#1A8BB8',
  'Integrated Science': '#0E7A6A',
};
const SUBJECTS_FILTER = ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'Civic Education'];

export default function NotesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [filter, setFilter] = useState('All');
  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotes = async () => {
    const data = await loadNotes();
    setNotes(data);
  };

  useEffect(() => { fetchNotes(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotes();
    setRefreshing(false);
  };

  const filtered = filter === 'All' ? notes : notes.filter(n => n.subject === filter);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={['#D4770A', '#F5A623']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Study Notes</Text>
            <Text style={styles.headerSub}>{notes.length} note{notes.length !== 1 ? 's' : ''} uploaded by teachers</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {SUBJECTS_FILTER.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.filterChip, { backgroundColor: filter === s ? '#fff' : 'rgba(255,255,255,0.25)' }]}
              onPress={() => setFilter(s)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, { color: filter === s ? '#D4770A' : '#fff' }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 20 }}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={64} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Notes Yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Study notes uploaded by your school's teachers will appear here.
            </Text>
            <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>Pull down to refresh</Text>
          </View>
        }
        renderItem={({ item }) => {
          const color = SUBJECT_COLORS[item.subject] ?? '#1B4F8A';
          return (
            <TouchableOpacity
              style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => Alert.alert(item.title, `${item.description}\n\n${item.pages} pages · Uploaded by ${item.uploadedBy} · ${item.school}`)}
              activeOpacity={0.8}
            >
              <View style={[styles.noteIcon, { backgroundColor: color + '18' }]}>
                <Ionicons name="document-text" size={26} color={color} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.noteTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
                <View style={[styles.subjectTag, { backgroundColor: color + '15', borderColor: color + '40' }]}>
                  <Text style={[styles.subjectTagText, { color }]}>{item.subject} · Grade {item.grade}</Text>
                </View>
                <Text style={[styles.noteDesc, { color: colors.mutedForeground }]} numberOfLines={2}>{item.description}</Text>
                <View style={styles.noteMeta}>
                  <Ionicons name="document-outline" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.pages} pages</Text>
                  <Ionicons name="person-outline" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.uploadedBy}</Text>
                </View>
              </View>
              <View style={styles.noteActions}>
                <TouchableOpacity
                  style={[styles.iconBtn, { backgroundColor: color + '18' }]}
                  onPress={() => Alert.alert('Download', `Downloading "${item.title}"…`)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="download-outline" size={18} color={color} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular' },
  filterChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  filterChipText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  noteCard: {
    flexDirection: 'row', gap: 12, borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  noteIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  noteTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', lineHeight: 20 },
  subjectTag: { alignSelf: 'flex-start', borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  subjectTagText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  noteDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  noteMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  noteActions: { justifyContent: 'center' },
  iconBtn: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32, gap: 10 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', marginTop: 8 },
  emptyText: { fontSize: 16, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 24 },
  emptyHint: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4 },
});
