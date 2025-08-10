import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ensureAnonSignIn, watchAuth } from '../firebase'
import { router } from 'expo-router'

export default function Login() {
  const [ready, setReady] = useState(false)
  const [name, setName] = useState('Teacher')
  useEffect(() => { const unsub = watchAuth(() => setReady(true)); return () => unsub() }, [])
  const enter = async () => {
    await ensureAnonSignIn()
    // @ts-ignore
    globalThis.__teacherName = name
    router.replace('/(tabs)/checkin')
  }
  return (
    <View style={styles.container}>
      <Image source={require('../assets/school.png')} style={styles.logo} />
      <Text style={styles.title}>Dismissal App (Prototype)</Text>
      <Text style={styles.subtitle}>Anonymous sign-in. Enter a display name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ms. Alvarez" />
      <TouchableOpacity style={[styles.btn, styles.primary]} onPress={enter} disabled={!ready}>
        <Text style={styles.btnText}>{ready ? 'Enter as Teacher' : 'Loading...'}</Text>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#e6f0ff' },
  logo: { width: 160, height: 160, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#334155', marginBottom: 12 },
  input: { width: '100%', backgroundColor: '#fff', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  btn: { width: '100%', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: '#2563eb' },
  btnText: { color: '#fff', fontWeight: '600' },
})
