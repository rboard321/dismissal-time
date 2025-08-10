import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Student } from '../types';

interface Props {
  getStudentsForCar: (carNumber: number) => Promise<Student[]>;
  addToQueue: (carNumber: number) => Promise<boolean>;
}

const CheckInScreen: React.FC<Props> = ({ getStudentsForCar, addToQueue }) => {
  const [carNumber, setCarNumber] = useState('');
  const [preview, setPreview] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleCarNumberChange = async (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setCarNumber(numericValue);

    if (numericValue && numericValue.length > 0) {
      setLoading(true);
      try {
        const students = await getStudentsForCar(parseInt(numericValue));
        setPreview(students);
      } catch (error) {
        console.error('Error getting students:', error);
        setPreview([]);
      } finally {
        setLoading(false);
      }
    } else {
      setPreview([]);
    }
  };

  const handleCheckIn = async () => {
    if (!carNumber) {
      Alert.alert('Error', 'Please enter a car number');
      return;
    }

    if (preview.length === 0) {
      Alert.alert(
        'No Students Found',
        `No students are assigned to car #${carNumber}. Would you like to check in anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Check In', onPress: () => proceedWithCheckIn() },
        ]
      );
      return;
    }

    proceedWithCheckIn();
  };

  const proceedWithCheckIn = async () => {
    setChecking(true);
    try {
      const success = await addToQueue(parseInt(carNumber));
      if (success) {
        Alert.alert(
          'Success!',
          `Car #${carNumber} has been added to the dismissal queue.`,
          [{ text: 'OK', onPress: clearForm }]
        );
      } else {
        Alert.alert('Error', 'Failed to add car to queue. Please try again.');
      }
    } catch (error) {
      console.error('Check in error:', error);
      Alert.alert('Error', 'Failed to check in car. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const clearForm = () => {
    setCarNumber('');
    setPreview([]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Check In Cars</Text>
        <Text style={styles.subtitle}>Enter a car number to add to dismissal queue</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Car Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter car number (e.g., 20)"
          value={carNumber}
          onChangeText={handleCarNumberChange}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleCheckIn}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={styles.loadingText}>Looking up students...</Text>
          </View>
        )}

        {!loading && carNumber && preview.length > 0 && (
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Students in Car #{carNumber}:</Text>
            {preview.map((student, index) => (
              <Text key={student.id} style={styles.studentName}>
                • {student.firstName} {student.lastName}
              </Text>
            ))}
          </View>
        )}

        {!loading && carNumber && preview.length === 0 && (
          <View style={styles.noStudents}>
            <Text style={styles.noStudentsText}>
              No students assigned to car #{carNumber}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, (!carNumber || checking) && styles.buttonDisabled]}
          onPress={handleCheckIn}
          disabled={!carNumber || checking}
        >
          {checking ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Add to Dismissal Queue</Text>
          )}
        </TouchableOpacity>

        {carNumber && (
          <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    flexGrow: 1,
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
  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#6b7280',
  },
  preview: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 2,
  },
  noStudents: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fbbf24',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  noStudentsText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CheckInScreen;

