import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getStudentsByCarNumber, addToQueue } from '../services/firebase';
import { Student } from '../types';

const CheckInScreen: React.FC = () => {
  const [carNumber, setCarNumber] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

  const handleSearch = async () => {
    const result = await getStudentsByCarNumber(Number(carNumber));
    setStudents(result as Student[]);
  };

  const handleCheckIn = async () => {
    if (students.length === 0) return;
    await addToQueue({
      carNumber: Number(carNumber),
      studentIds: students.map((s) => s.id),
      studentNames: students.map((s) => `${s.firstName} ${s.lastName}`),
    });
    setStudents([]);
    setCarNumber('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Car Number"
        value={carNumber}
        onChangeText={setCarNumber}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Search" onPress={handleSearch} />
      {students.map((s) => (
        <Text key={s.id}>{`${s.firstName} ${s.lastName}`}</Text>
      ))}
      <Button title="Check In" onPress={handleCheckIn} disabled={students.length === 0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 },
});

export default CheckInScreen;
