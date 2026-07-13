import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Platform,
  TouchableOpacity, ScrollView, TextInput, Modal, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { PostCard } from '@/components/PostCard';
import { COMMUNITY_POSTS, CommunityPost, SUBJECTS } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const FILTER_OPTIONS = ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'Civic Education'];

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 34 : 84 + insets.bottom;

  const [posts, setPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');

  const filtered = filter === 'All' ? posts : posts.filter(p => p.subject === filter);

  const handlePost = () => {
    if (!newPost.trim()) { Alert.alert('Empty Post', 'Please write something before posting.'); return; }
    const post: CommunityPost = {
      id: Date.now().toString(),
      authorName: user?.name ?? 'Anonymous',
      authorGrade: `Grade ${user?.grade ?? '12'}`,
      subject: newSubject,
      content: newPost.trim(),
      likes: 0, replies: 0, timestamp: 'Just now', liked: false,
    };
    setPosts([post, ...posts]);
    setNewPost('');
    setShowModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={['#1A8BB8', '#2AABE8']} style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={styles.headerTitle}>Student Community</Text>
        <Text style={styles.headerSub}>Share, learn, and help each other succeed</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>248</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.stat}>
            <Text style={styles.statNum}>1.2k</Text>
            <Text style={styles.statLabel}>Answers</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filter */}
      <View style={[styles.filterBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_OPTIONS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, { backgroundColor: filter === f ? '#1A8BB8' : colors.muted, borderColor: filter === f ? '#1A8BB8' : colors.border }]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, { color: filter === f ? '#fff' : colors.foreground }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No posts yet in this subject</Text>
            <Text style={[styles.emptySubText, { color: colors.mutedForeground }]}>Be the first to start a discussion!</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#1A8BB8', bottom: bottomPad + 16 }]}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Post Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowModal(false)}>
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowModal(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>New Post</Text>
            <TouchableOpacity style={[styles.postBtn, { backgroundColor: '#1A8BB8' }]} onPress={handlePost} activeOpacity={0.8}>
              <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={[styles.modalLabel, { color: colors.foreground }]}>Subject</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectRow}>
              {SUBJECTS.slice(0, 6).map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.subjectChip, { backgroundColor: newSubject === s ? '#1A8BB8' : colors.muted, borderColor: newSubject === s ? '#1A8BB8' : colors.border }]}
                  onPress={() => setNewSubject(s)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.subjectChipText, { color: newSubject === s ? '#fff' : colors.foreground }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.modalLabel, { color: colors.foreground }]}>Your question or comment</Text>
            <TextInput
              style={[styles.postInput, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
              placeholder="Ask a question, share a tip, or help a classmate..."
              placeholderTextColor={colors.mutedForeground}
              value={newPost}
              onChangeText={setNewPost}
              multiline
              textAlignVertical="top"
              autoFocus
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 6 },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular' },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 12, paddingVertical: 10, marginTop: 6, gap: 0 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statNum: { color: '#fff', fontSize: 20, fontFamily: 'Inter_700Bold' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontFamily: 'Inter_400Regular' },
  statDiv: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
  filterBar: { borderBottomWidth: 1 },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  filterText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  emptySubText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  fab: {
    position: 'absolute', right: 20, width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  postBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  postBtnText: { color: '#fff', fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  modalBody: { padding: 16, gap: 12 },
  modalLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  subjectRow: { marginBottom: 4 },
  subjectChip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8 },
  subjectChipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  postInput: {
    borderRadius: 12, borderWidth: 1, padding: 14, minHeight: 140,
    fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 22,
  },
});
