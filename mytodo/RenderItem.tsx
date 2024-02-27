import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles';
import {Task} from './App';

interface ItemProps {
  item: Task;
  markDone: (task: Task) => void;
  deleteFunction: (task: Task) => void;
}

export default function RenderItem({
  item,
  markDone,
  deleteFunction,
}: ItemProps) {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => markDone(item)}>
        <Text style={item.done ? styles.textDone : styles.text}>
          {item.title}
        </Text>
        <Text style={item.done ? styles.textDone : styles.text}>
          {new Date(item.date).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: 'America/Bogota',
          })}
        </Text>
      </TouchableOpacity>
      {item.done && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => deleteFunction(item)}>
          <Text style={styles.whiteText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
