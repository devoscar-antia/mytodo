import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import styles from './Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderItem from './RenderItem';

export interface Task {
  title: string;
  done: boolean;
  date: Date;
}

export default function App() {
  const [text, setText] = useState('');
  const [tasks, setTaks] = useState<Task[]>([]);

  const storeData = async (value: Task[]) => {
    try {
      await AsyncStorage.setItem('my-todo-tasks', JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('my-todo-tasks');
      if (value !== null) {
        const tasksLocal = JSON.parse(value);
        setTaks(tasksLocal);
      }
    } catch (e) {
      // error reading value //
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const addTask = () => {
    if (tasks.some(task => task.title === text)) {
      Alert.alert('Tarea duplicada', '¡Esta tarea ya existe!');
      return;
    }
    const tmp = [...tasks];
    const newTask = {
      title: text,
      done: false,
      date: new Date(),
    };
    tmp.push(newTask);
    setTaks(tmp);
    storeData(tmp);
    setText('');
  };
  const markDone = (task: Task) => {
    const tmp = [...tasks];
    const index = tmp.findIndex(el => el.title === task.title);
    const todo = tmp[index];
    todo.done = !todo.done;
    setTaks(tmp);
    storeData(tmp);
  };

  const deleteFunction = (task: Task) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const tmp = [...tasks];
            const index = tmp.findIndex(el => el.title === task.title);
            tmp.splice(index, 1);
            setTaks(tmp);
            storeData(tmp);
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas por realizar</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Agregar una nueva tarea"
          onChangeText={(t: string) => setText(t)}
          value={text}
          style={styles.TextInput}
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Text style={styles.whiteText}>Agregar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.scrollContainer}>
        <FlatList
          renderItem={({item}) => (
            <RenderItem
              item={item}
              deleteFunction={deleteFunction}
              markDone={markDone}
            />
          )}
          data={tasks}
        />
      </View>
    </View>
  );
}
