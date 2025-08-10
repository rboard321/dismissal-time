import { useCallback, useEffect, useState } from 'react'
import { FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { collection, onSnapshot, query, where, addDoc, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import { useFocusEffect } from 'expo-router'

type Student = { id: string; firstName: string; lastName: string; number: number }
type Checkin = { id: string; number: number; studentIds: string[]; studentNames: string[]; createdAt: number; active: boolean }

export default function CheckIn() {
  const [number, setNumber] = useState('')
  const [matches, setMatches] = useState<Student[]>([])
  const [recent, setRecent] = useState<Checkin[]>([])

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'checkins'), where('active','==', true), orderBy('createdAt')), snap => {
      const rows: any[] = []
      snap.forEach(d => rows.push({ id: d.id, ...(d.data() as any) }))
      setRecent(rows as Checkin[])
    })
    return () => unsub()
  }, [])

  useFocusEffect(useCallback(() => {
    // @ts-ignore
    const s = globalThis.__scannedNumber as string | undefined
    if (s) {
      setNumber(s)
      // @ts-ignore
      globalThis.__scannedNumber = undefined
    }
  }, []))

  const findStudents = async (n: number) => {
    const snap = await getDocs(query(collection(db,'students'), where('number','==', n)))
    const rows: Student[] = []
    snap.forEach(d => rows.push({ id: d.id, ...(d.data() as any) }))
    return rows
  }

  const handleLookup = async () => {
    const n = parseInt(number, 10)
    if (!n || n < 0) return
    const rows = await findStudents(n)
    setMatches(rows)
    Keyboard.dismiss()
  }

  const handleCheckIn = async () => {
    const n = parseInt(number, 10)
    if (!n || n < 0) return
    const rows = matches.length ? matches : await findStudents(n)
    await addDoc(collection(db,'checkins'), {
      number: n,
      studentIds: rows.map(r => r.id),
      studentNames: rows.map(r => `${r.firstName} ${r.lastName}`),
      createdAt: Date.now(),
      active: true
    } as any)
    setNumber('')
    setMatches([])
    Keyboard.dismiss()
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Enter car number</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            inputMode="numeric"
            placeholder="e.g. 20"
            value={number}
            onChangeText={t => setNumber(t.replace(/\D/g,''))}
          />
          <TouchableOpacity style={styles.btn} onPress={handleLookup}>
            <Text style={styles.btnText}>Lookup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.primary]} onPress={handleCheckIn}>
            <Text style={[styles.btnText, styles.primaryText]}>Check In</Text>
          </TouchableOpacity>
        </View>
        {matches.length > 0 && (
          <Text style={styles.matches}>Matches: {matches.map(s => s.firstName + ' ' + s.lastName).join(', ')}</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Active Queue (most recent last)</Text>
        <FlatList
          data={recent}
          keyExtractor={it => it.id}
          renderItem={({item, index}) => (
            <View style={styles.qrow}>
              <View>
                <Text style={styles.qtitle}>Car #{item.number} • {item.studentNames.join(', ') || 'No matching students'}</Text>
                <Text style={styles.qtime}>Checked in at {new Date(item.createdAt).toLocaleTimeString()}</Text>
              </View>
              <Text style={styles.pos}>Position: {index + 1}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No active check-ins yet.</Text>}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  btn: { paddingHorizontal: 12, backgroundColor: '#e2e8f0', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontWeight: '600' },
  primary: { backgroundColor: '#2563eb' },
  primaryText: { color: '#fff' },
  matches: { marginTop: 8, color: '#475569' },
  heading: { fontWeight: '700', marginBottom: 8 },
  qrow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  qtitle: { fontWeight: '600' },
  qtime: { color: '#64748b', fontSize: 12 },
  pos: { fontWeight: '700' },
  sep: { height: 1, backgroundColor: '#f1f5f9' },
  empty: { color: '#64748b', padding: 12, textAlign: 'center' }
})
