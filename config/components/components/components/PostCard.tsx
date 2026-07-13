import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { CommunityPost } from '@/data/mockData';

interface PostCardProps {
  post: CommunityPost;
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#1B4F8A', Biology: '#2E8B57', Chemistry: '#D4770A',
  Physics: '#6B2D99', English: '#C0392B', 'Civic Education': '#1A8BB8',
};

export function PostCard({ post }: PostCardProps) {
  const colors = useColors();
  const [liked, setLiked] = useState(post.liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const subjectColor = SUBJECT_COLORS[post.subject] ?? colors.primary;

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(c => liked ? c - 1 : c + 1);
  };

  const initials = post.authorName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: subjectColor }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: colors.foreground }]}>{post.authorName}</Text>
          <Text style={[styles.authorMeta, { color: colors.mutedForeground }]}>
            {post.authorGrade} · {post.timestamp}
          </Text>
        </View>
        <View style={[styles.subjectChip, { backgroundColor: subjectColor + '18', borderColor: subjectColor + '40' }]}>
          <Text style={[styles.subjectChipText, { color: subjectColor }]}>{post.subject}</Text>
        </View>
      </View>
      <Text style={[styles.content, { color: colors.foreground }]}>{post.content}</Text>
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.action} onPress={handleLike} activeOpacity={0.7}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? '#C0392B' : colors.mutedForeground} />
          <Text style={[styles.actionText, { color: liked ? '#C0392B' : colors.mutedForeground }]}>{likeCount}</Text>
        </TouchableOpacity>
        <View style={styles.action}>
          <Ionicons name="chatbubble-outline" size={19} color={colors.mutedForeground} />
          <Text style={[styles.actionText, { color: colors.mutedForeground }]}>{post.replies}</Text>
        </View>
        <TouchableOpacity style={styles.action} activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={19} color={colors.mutedForeground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} activeOpacity={0.7}>
          <Ionicons name="flag-outline" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14, borderWidth: 1, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 10, gap: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_700Bold' },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  authorMeta: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  subjectChip: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 9, paddingVertical: 4 },
  subjectChipText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  content: { fontSize: 17, fontFamily: 'Inter_400Regular', lineHeight: 26, paddingHorizontal: 16, paddingBottom: 14 },
  footer: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12,
    borderTopWidth: 1, gap: 4,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4 },
  actionText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
