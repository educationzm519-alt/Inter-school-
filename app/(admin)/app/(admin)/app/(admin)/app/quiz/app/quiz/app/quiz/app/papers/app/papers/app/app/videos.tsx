import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { loadVideos } from '@/utils/storage';
import type { Video } from '@/data/mockData';

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#1B4F8A', Biology: '#2E8B57', Chemistry: '#D4770A',
  Physics: '#6B2D99', English: '#C0392B', 'Civic Education': '#1A8BB8',
};
const FILTERS = ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'Civic Education'];

export default function VideosScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const [filter, setFilter] = useState('All');
  const [videos, setVideos] = useState<Video[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVideos = async () => {
    const data = await loadVideos();
    setVideos(data);
  };

  useEffect(() => { fetchVideos(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVideos();
    setRefreshing(false);
  };

  const filtered = filter === 'All' ? videos : videos.filter(v => v.subject === filter);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={['#6B2D99', '#9B4DCA']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Video Lessons</Text>
            <Text style={styles.headerSub}>{videos.length} video{videos.length !== 1 ? 's' : ''} uploaded by teachers</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, { backgroundColor: filter === f ? '#fff' : 'rgba(255,255,255,0.25)' }]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, { color: filter === f ? '#6B2D99' : '#fff' }]}>{f}</Text>
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
            <Ionicons name="play-circle-outline" size={64} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Videos Yet</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Video lessons recorded and uploaded by your school's teachers will appear here.
            </Text>
            <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>Pull down to refresh</Text>
          </View>
        }
        renderItem={({ item }) => {
          const color = SUBJECT_COLORS[item.subject] ?? '#6B2D99';
          return (
            <TouchableOpacity
              style={[styles.videoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => Alert.alert('Play Video', `${item.title}\n\nDuration: ${item.duration}\nTeacher: ${item.teacher}\nSchool: ${item.school}`)}
              activeOpacity={0.85}
            >
              <View style={[styles.thumbnail, { backgroundColor: color }]}>
                <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.9)" />
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
              </View>
              <View style={styles.videoInfo}>
                <Text style={[styles.videoTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
                <View style={[styles.subjectTag, { backgroundColor: color + '15', borderColor: color + '40' }]}>
                  <Text style={[styles.subjectTagText, { color }]}>{item.subject} · Grade {item.grade}</Text>
                </View>
                <View style={styles.videoMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="person-outline" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.teacher}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="business-outline" size={13} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.school}</Text>
                  </View>
                </View>
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
  videoCard: {
    borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  thumbnail: { height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  durationBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  durationText: { color: '#fff', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  videoInfo: { padding: 14, gap: 6 },
  videoTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', lineHeight: 22 },
  subjectTag: { alignSelf: 'flex-start', borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  subjectTagText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  videoMeta: { flexDirection: 'row', gap: 16, marginTop: 2, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32, gap: 10 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', marginTop: 8 },
  emptyText: { fontSize: 16, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 24 },
  emptyHint: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4 },
});
