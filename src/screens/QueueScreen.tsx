import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { QueueEntry } from '../types';

interface Props {
  queue: QueueEntry[];
  completePickup: (queueId: string) => Promise<boolean>;
}

const QueueScreen: React.FC<Props> = ({ queue, completePickup }) => {
  const handleCompletePickup = async (entry: QueueEntry, position: number) => {
    Alert.alert(
      'Complete Pickup',
      `Mark car #${entry.carNumber} (Cone ${position}) as picked up?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            const success = await completePickup(entry.id);
            if (!success) {
              Alert.alert('Error', 'Failed to complete pickup. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';

    let date: Date;
    if (timestamp.toDate) {
      // Firestore Timestamp
      date = timestamp.toDate();
    } else {
      // JavaScript Date or timestamp
      date = new Date(timestamp);
    }

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderQueueItem = ({ item, index }: { item: QueueEntry; index: number }) => {
    const position = index + 1;

    return (
      <View style={styles.queueCard}>
        <View style={styles.cardContent}>
          <View style={styles.leftSection}>
            <View style={styles.coneContainer}>
              <Text style={styles.coneNumber}>{position}</Text>
            </View>

            <View style={styles.carInfo}>
              <Text style={styles.carNumber}>Car #{item.carNumber}</Text>
              <Text style={styles.studentNames}>
                {item.studentNames.length > 0
                  ? item.studentNames.join(', ')
                  : 'No students assigned'}
              </Text>
              <Text style={styles.timeText}>
                🕐 Checked in at {formatTime(item.createdAt)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleCompletePickup(item, position)}
          >
            <Text style={styles.completeButtonText}>✓</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🚗</Text>
      <Text style={styles.emptyTitle}>No cars in queue</Text>
      <Text style={styles.emptySubtitle}>
        Cars will appear here as they check in for dismissal
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dismissal Queue</Text>
        <Text style={styles.subtitle}>
          {queue.length} {queue.length === 1 ? 'car' : 'cars'} waiting
        </Text>
      </View>

      <FlatList
        data={queue}
        renderItem={renderQueueItem}
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
  listContainer: {
    padding: 16,
  },
  queueCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coneContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#3b82f6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  coneNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  carInfo: {
    flex: 1,
  },
  carNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  studentNames: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    lineHeight: 18,
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  completeButton: {
    width: 40,
    height: 40,
    backgroundColor: '#10b981',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default QueueScreen;

