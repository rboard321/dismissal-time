import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Student } from '../types';
import { addStudent } from '../services/firebase';

interface Props {
  students: Student[];
}

const StudentsScreen: React.FC<Props> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;

    const term = searchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  const seedDemoStudents = async () => {
    const demoStudents = [
      { firstName: 'John', lastName: 'Doe', carNumber: 20 },
      { firstName: 'Jane', lastName: 'Doe', carNumber: 20 },
      { firstName: 'Alice', lastName: 'Smith', carNumber: 15 },
      { firstName: 'Bob', lastName: 'Johnson', carNumber: 32 },
      { firstName: 'Emma', lastName: 'Wilson', carNumber: 7 },
      { firstName: 'Liam', lastName: 'Brown', carNumber: 7 },
      { firstName: 'Olivia', lastName: 'Davis', carNumber: 45 },
      { firstName: 'Noah', lastName: 'Miller', carNumber: 12 },
      { firstName: 'Sophia', lastName: 'Garcia', carNumber: 28 },
      { firstName: 'Mason', lastName: 'Martinez', carNumber: 33 },
    ];

    try {
      for (const student of demoStudents) {
        await addStudent(student);
      }
      Alert.alert('Success', 'Demo students added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add demo students');
    }
  };

  const renderStudent = ({ item, index }: { item: Student; index: number }) => (
    <View
      style={[
        styles.studentCard,
        index === filteredStudents.length - 1 && styles.lastCard,
      ]}
    >
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>
          {item.firstName} {item.lastName}
        </Text>
      </View>
      <View style={styles.carBadge}>
        <Text style={styles.carNumber}>#{item.carNumber}</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>👥</Text>
      <Text style={styles.emptyTitle}>
        {searchTerm ? `No students found for "${searchTerm}"` : 'No students yet'}
      </Text>
      {!searchTerm && (
        <TouchableOpacity style={styles.seedButton} onPress={seedDemoStudents}>
          <Text style={styles.seedButtonText}>Add Demo Students</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Students Directory</Text>
        <Text style={styles.subtitle}>
          {filteredStudents.length} of {students.length} students
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by first or last name..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  lastCard: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  carBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  carNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  seedButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  seedButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default StudentsScreen;

