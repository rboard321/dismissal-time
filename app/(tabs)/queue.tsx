import { useEffect, useMemo, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { collection, onSnapshot, query, where, orderBy, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'
type Checkin = { id: string; number: number; studentIds: string[]; studentNames: string[]; createdAt: number; active: boolean }
export default function Queue() {
  const [items, setItems] = useState<Checkin[]>([])
  useEffect(()=>{
    const unsub = onSnapshot(query(collection(db,'checkins'), where('active','==', true), orderBy('createdAt')), snap=>{
      const rows:any[]=[]; snap.forEach(d=>rows.push({id:d.id, ...(d.data() as any)})); setItems(rows as Checkin[])
    }); return () => unsub()
  },[])
  const sorted = useMemo(()=> [...items].sort((a,b)=>a.createdAt-b.createdAt), [items])
  const clear = async (id:string)=>{ await updateDoc(doc(db,'checkins', id), { active:false }) }
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Live Dismissal Queue</Text>
        <FlatList data={sorted} keyExtractor={it=>it.id} ItemSeparatorComponent={()=> <View style={styles.sep}/>}
          ListEmptyComponent={<Text style={styles.empty}>No active cars in queue.</Text>}
          renderItem={({item,index}) => (
            <View style={styles.row}>
              <Text style={styles.cell}>Cone {index+1}</Text>
              <Text style={styles.cell}>#{item.number}</Text>
              <Text style={[styles.cell,{flex:1}]}>{item.studentNames.join(', ') || '—'}</Text>
              <Text style={styles.cellSmall}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
              <TouchableOpacity style={styles.clear} onPress={()=>clear(item.id)}><Text style={styles.clearText}>Clear</Text></TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container:{flex:1,padding:16},
  card:{backgroundColor:'#fff',borderRadius:12,padding:12,borderWidth:1,borderColor:'#e2e8f0'},
  title:{fontWeight:'700',marginBottom:8},
  row:{flexDirection:'row',alignItems:'center',paddingVertical:8},
  cell:{width:80,fontWeight:'600'},
  cellSmall:{width:110,color:'#475569',fontSize:12},
  clear:{borderWidth:1,borderColor:'#e2e8f0',paddingHorizontal:10,paddingVertical:6,borderRadius:8},
  clearText:{fontWeight:'600'},
  sep:{height:1,backgroundColor:'#f1f5f9'},
  empty:{color:'#64748b',padding:12,textAlign:'center'}
})
