import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { listenToQueue, completePickup } from '../services/firebase';
import { QueueEntry } from '../types';

const QueueScreen: React.FC = () => {
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  useEffect(() => {
    const unsubscribe = listenToQueue((data) => setQueue(data as QueueEntry[]));
    return unsubscribe;
  }, []);

  const renderItem = ({ item }: { item: QueueEntry }) => (
    <View style={styles.item}>
      <Text style={styles.carNumber}>Car {item.carNumber}</Text>
      <Text>{item.studentNames.join(', ')}</Text>
      <Button title="Complete" onPress={() => completePickup(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={queue} keyExtractor={(item) => item.id} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { marginBottom: 16 },
  carNumber: { fontWeight: 'bold' },
});

export default QueueScreen;
