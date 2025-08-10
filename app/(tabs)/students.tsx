import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRouter } from 'expo-router';

type Student = { id: string; firstName: string; lastName: string; number: number };

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [qstr, setQstr] = useState('');
  const router = useRouter();

  useEffect(() => {
    const qcol = query(collection(db, 'students'), orderBy('lastName'));
    const unsub = onSnapshot(qcol, snap => {
      const rows: Student[] = [];
      snap.forEach(d => rows.push({ id: d.id, ...(d.data() as any) }));
      setStudents(rows);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const t = qstr.trim().toLowerCase();
    if (!t) return students;
    return students.filter(
      s => s.firstName.toLowerCase().includes(t) || s.lastName.toLowerCase().includes(t)
    );
  }, [students, qstr]);

  const seedDemoStudents = async () => {
    const firsts = ['Alice', 'Bob', 'Carlos', 'Dana', 'Eli', 'Fatima', 'George', 'Hannah', 'Ian', 'Julia'];
    const lasts = ['Anderson', 'Brown', 'Chen', 'Diaz', 'Evans', 'Foster', 'Green', 'Hughes', 'Ingram', 'Jones'];

    const demo = Array.from({ length: 30 }).map((_, i) => ({
      firstName: firsts[i % 10],
      lastName: lasts[Math.floor(i / 3) % 10], // FIXED: no `//` integer division
      number: Math.floor(i / 2) + 1
    }));

    for (const s of demo) {
      await addDoc(collection(db, 'students'), s as any);
    }
    Alert.alert('Seeded 30 demo students (two per car number).');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Search by first or last name"
          value={qstr}
          onChangeText={setQstr}
        />

        <TouchableOpacity style={styles.btn} onPress={seedDemoStudents}>
          <Text style={styles.btnText}>Seed demo students</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnScan} oonPress={() => router.push('/(tabs)/scan')}>git init
                                                                                              git add README.md
                                                                                              git commit -m "first commit"
                                                                                              git branch -M main
                                                                                              git remote add origin git@github.com:rboard321/dismissal-time.git
                                                                                              git push -u origin main
          <Text style={styles.btnText}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <FlatList
          data={filtered}
          keyExtractor={it => it.id}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.car}>#{item.number}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No students yet.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  btn: { marginTop: 8, backgroundColor: '#e2e8f0', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnScan: { marginTop: 8, backgroundColor: '#93c5fd', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  btnText: { fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 6 },
  sep: { height: 1, backgroundColor: '#f1f5f9' },
  name: { fontSize: 16 },
  car: { fontWeight: '700' },
  empty: { color: '#64748b', padding: 12, textAlign: 'center' }
});
