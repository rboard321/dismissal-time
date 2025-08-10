import { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'
import { router } from 'expo-router'

export default function Scan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [active, setActive] = useState(true)
  const [scannedNum, setScannedNum] = useState<string>('')
  const fired = useRef(false)

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const onScan = ({ data }: BarCodeScannerResult) => {
    if (!active || fired.current) return
    fired.current = true
    setActive(false)

    const num = (data.match(/\d+/)?.[0]) || ''
    setScannedNum(num)
  }

  const useNumberAndGo = () => {
    // hand number to Check In screen
    // @ts-ignore
    globalThis.__scannedNumber = scannedNum
    router.navigate('/(tabs)/checkin') // navigate AFTER the camera is idle
  }

  if (hasPermission === null) return <View style={styles.center}><Text>Requesting camera permission…</Text></View>
  if (hasPermission === false) return <View style={styles.center}><Text>No camera access. Enable it in Settings.</Text></View>

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <BarCodeScanner
          onBarCodeScanned={active ? onScan : undefined}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {!active ? (
        <View style={styles.actions}>
          <Text style={styles.result}>Scanned: {scannedNum || '—'}</Text>
          <TouchableOpacity style={[styles.btn, styles.primary]} onPress={useNumberAndGo} disabled={!scannedNum}>
            <Text style={styles.btnText}>Use Number & Go to Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => { fired.current = false; setScannedNum(''); setActive(true) }}>
            <Text style={styles.btnText}>Scan Another</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.hint}>Tip: codes like “CAR-20” work — it grabs 20.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  box: { flex: 1, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000' },
  actions: { gap: 8 },
  result: { textAlign: 'center', fontWeight: '600', marginTop: 8 },
  btn: { backgroundColor: '#e2e8f0', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: '#2563eb' },
  btnText: { color: '#111827', fontWeight: '700' },
  hint: { textAlign: 'center', color: '#64748b', marginTop: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
})
