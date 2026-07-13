import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/AuthContext';
import { useColors } from '@/hooks/useColors';
import { savePaper, saveNote, saveVideo } from '@/utils/storage';
import { SUBJECTS } from '@/data/mockData';

const GRADES = ['7', '9', '12'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

type UploadType = 'paper' | 'notes' | 'video';

const TYPE_CONFIG = {
  paper: { label: 'Past Paper', color: '#1B4F8A', icon: 'document-attach-outline' as const },
  notes: { label: 'Study Notes', color: '#D4770A', icon: 'book-outline' as const },
  video: { label: 'Video Lesson', color: '#6B2D99', icon: 'videocam-outline' as const },
};

export default function UploadScreen() {
  const { type: typeParam } = useLocalSearchParams<{ type?: string }>();
  const uploadType: UploadType = (typeParam as UploadType) ?? 'paper';
  const config = TYPE_CONFIG[uploadType] ?? TYPE_CONFIG.paper;

  const { user } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [grade, setGrade] = useState('12');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('2024');
  const [paperNumber, setPaperNumber] = useState('1');
  const [duration, setDuration] = useState('');
  const [pages, setPages] = useState('');
  const [pickedUri, setPickedUri] = useState<string | null>(null);
  const [pickedName, setPickedName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const pickFile = async () => {
    if (uploadType === 'video') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        setPickedUri(result.assets[0].uri);
        setPickedName(result.assets[0].fileName ?? 'video');
      }
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        setPickedUri(result.assets[0].uri);
        setPickedName(result.assets[0].fileName ?? 'file');
      }
    }
  };

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Missing Title', 'Please enter a title.'); return; }
    if (!subject) { Alert.alert('Missing Subject', 'Please select a subject.'); return; }

    setSaving(true);
    try {
      const now = new Date().toISOString().split('T')[0];
      const id = `${uploadType}_${Date.now()}`;

      if (uploadType === 'paper') {
        await savePaper({
          id,
          grade: grade as '7' | '9' | '12',
          subject,
          year: parseInt(year) || 2024,
          paperNumber: parseInt(paperNumber) || 1,
          fileSize: pickedUri ? '—' : 'N/A',
          downloads: 0,
          uploadedBy: user?.name ?? 'Teacher',
          school: user?.school ?? '',
          uploadedAt: now,
          fileUri: pickedUri ?? undefined,
        });
      } else if (uploadType === 'notes') {
        await saveNote({
          id,
          title: title.trim(),
          subject,
          grade,
          description: description.trim(),
          pages: parseInt(pages) || 0,
          uploadedBy: user?.name ?? 'Teacher',
          school: user?.school ?? '',
          date: now,
          fileUri: pickedUri ?? undefined,
        });
      } else if (uploadType === 'video') {
        await saveVideo({
          id,
          title: title.trim(),
          subject,
          grade,
          duration: duration.trim() || '—',
          teacher: user?.name ?? 'Teacher',
          school: user?.school ?? '',
          views: 0,
          thumbnail: '',
          uploadedAt: now,
          fileUri: pickedUri ?? undefined,
        });
      }

      Alert.alert('Uploaded! ✓', `"${title}" has been saved and is now visible to students.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient colors={[config.color, config.color + 'CC']} style={[styles.header, { paddingTop: topPad + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Upload {config.label}</Text>
            <Text style={styles.headerSub}>Fill in the details and pick a file from your phone</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: bottomPad + 100 }} showsVerticalScrollIndicator={false}>

        {/* File Picker */}
        <TouchableOpacity
          style={[styles.filePicker, { backgroundColor: pickedUri ? config.color + '15' : colors.muted, borderColor: pickedUri ? config.color : colors.border }]}
          onPress={pickFile}
          activeOpacity={0.8}
        >
          <Ionicons name={pickedUri ? 'checkmark-circle' : 'attach-outline'} size={32} color={pickedUri ? config.color : colors.mutedForeground} />
          <Text style={[styles.filePickerLabel, { color: pickedUri ? config.color : colors.mutedForeground }]}>
            {pickedUri ? (pickedName ?? 'File selected ✓') : `Tap to pick ${uploadType === 'video' ? 'a video' : 'a file'} from your phone`}
          </Text>
          {pickedUri && (
            <TouchableOpacity onPress={() => { setPickedUri(null); setPickedName(null); }} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Title */}
        <Text style={[styles.label, { color: colors.foreground }]}>Title *</Text>
        <TextInput
          style={[styles.input, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
          placeholder="e.g. Mathematics Paper 1 2024"
          placeholderTextColor={colors.mutedForeground}
          value={title}
          onChangeText={setTitle}
        />

        {/* Subject */}
        <Text style={[styles.label, { color: colors.foreground }]}>Subject *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {SUBJECTS.slice(0, 7).map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, { backgroundColor: subject === s ? config.color : colors.muted, borderColor: subject === s ? config.color : colors.border }]}
              onPress={() => setSubject(s)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, { color: subject === s ? '#fff' : colors.foreground }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grade */}
        <Text style={[styles.label, { color: colors.foreground }]}>Grade *</Text>
        <View style={styles.gradeRow}>
          {GRADES.map(g => (
            <TouchableOpacity
              key={g}
              style={[styles.gradeBtn, { backgroundColor: grade === g ? config.color : colors.muted, borderColor: grade === g ? config.color : colors.border }]}
              onPress={() => setGrade(g)}
              activeOpacity={0.7}
            >
              <Text style={[styles.gradeBtnText, { color: grade === g ? '#fff' : colors.foreground }]}>Grade {g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Paper-specific fields */}
        {uploadType === 'paper' && (
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: colors.foreground }]}>Year</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
                placeholder="2024"
                placeholderTextColor={colors.mutedForeground}
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={[styles.label, { color: colors.foreground }]}>Paper No.</Text>
              <TextInput
                style={[styles.input, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
                placeholder="1"
                placeholderTextColor={colors.mutedForeground}
                value={paperNumber}
                onChangeText={setPaperNumber}
                keyboardType="numeric"
                maxLength={1}
              />
            </View>
          </View>
        )}

        {/* Notes-specific */}
        {uploadType === 'notes' && (
          <>
            <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.multiline, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
              placeholder="Brief description of what these notes cover..."
              placeholderTextColor={colors.mutedForeground}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
            <Text style={[styles.label, { color: colors.foreground }]}>Number of Pages</Text>
            <TextInput
              style={[styles.input, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
              placeholder="e.g. 24"
              placeholderTextColor={colors.mutedForeground}
              value={pages}
              onChangeText={setPages}
              keyboardType="numeric"
            />
          </>
        )}

        {/* Video-specific */}
        {uploadType === 'video' && (
          <>
            <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.multiline, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
              placeholder="What topics does this video cover?"
              placeholderTextColor={colors.mutedForeground}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
            <Text style={[styles.label, { color: colors.foreground }]}>Duration (e.g. 18:30)</Text>
            <TextInput
              style={[styles.input, { color: colors.foreground, backgroundColor: colors.muted, borderColor: colors.border }]}
              placeholder="18:30"
              placeholderTextColor={colors.mutedForeground}
              value={duration}
              onChangeText={setDuration}
            />
          </>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: config.color, opacity: saving ? 0.7 : 1 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <>
                <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Save &amp; Upload</Text>
              </>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 16, gap: 0 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_400Regular' },
  filePicker: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 14, borderWidth: 2, borderStyle: 'dashed',
    padding: 16, marginBottom: 20,
  },
  filePickerLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium', lineHeight: 20 },
  label: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 8, marginTop: 4 },
  input: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  multiline: { minHeight: 90, textAlignVertical: 'top', paddingTop: 12 },
  chipRow: { marginBottom: 12 },
  chip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8 },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  gradeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  gradeBtn: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 10, alignItems: 'center' },
  gradeBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 56, borderRadius: 14, marginTop: 12,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontFamily: 'Inter_700Bold' },
});
