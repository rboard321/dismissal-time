import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { listenToStudents } from '../services/firebase';
import { Student } from '../types';

const StudentsScreen: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const unsubscribe = listenToStudents((data) => setStudents(data as Student[]));
    return unsubscribe;
  }, []);

  const renderItem = ({ item }: { item: Student }) => (
    <Text style={styles.item}>{`${item.firstName} ${item.lastName} (${item.carNumber})`}</Text>
  );

  return (
    <View style={styles.container}>
      <FlatList data={students} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { fontSize: 16, marginBottom: 8 },
});

export default StudentsScreen;
