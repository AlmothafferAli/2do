import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { useState, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import "../global.css";
export default function Index() {
  const [tasks, setTasks] = useState<any[]>([
    { id: "1", text: "Task 1", isCompleted: false },
    { id: "2", text: "Task 2", isCompleted: true },
    { id: "3", text: "Task 3", isCompleted: false },
    { id: "4", text: "Task 4", isCompleted: true },
  ]);

  const [Task, setTask] = useState("");
  const [editingId, setEditingId] = useState<string>("");
  const [isediting, setIsediting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  useEffect(() => {
    restoreTasks();
  }, []);

  const savetasks = async (tasks: any[]) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const restoreTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error retrieving tasks:", error);
    }
  };

  const handlePress = () => {
    if (Task.trim()) {
      const newTasks = [
        ...tasks,
        { id: Date.now().toString(), text: Task, isCompleted: false },
      ];
      setTasks(newTasks);
      savetasks(newTasks);
      setTask("");
    }
  };

  const handleDelete = (id: string) => {
    const newTask = tasks.filter((task) => task.id !== id);
    setTasks(newTask);
    savetasks(newTask);
  };

  const handleEdit = (id: string, text: string) => {
    setTask(text);
    setEditingId(id);
    setIsediting(true);
  };

  const completeTask = (id: string) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    setTasks(newTasks);
    savetasks(newTasks);
  };

  const filteredTasks = useMemo(() => {
    return searchQuery.trim()
      ? tasks.filter((task) =>
          task.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : tasks;
  }, [searchQuery, tasks]);

  const handleUpdate = () => {
    if (Task.trim()) {
      if (editingId) {
        const newTasks = tasks.map((task) =>
          task.id === editingId ? { ...task, text: Task } : task
        );
        setTasks(newTasks);
        savetasks(newTasks);

        setEditingId("");
      } else {
        setTasks([...tasks, { id: Date.now().toString(), text: Task }]);
      }
    }
    setIsediting(false);
    setTask("");
  };

  return (
    <Pressable
      className="flex-1 p-4 bg-white"
      onPress={() => setSelectedTask(null)}
    >
      <TextInput
        className=" border border-gray-300 text-2xl p-4 mb-4 bg-white rounded-xl"
        placeholder="Search..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FlatList
        className="rounded-lg"
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            className="flex-row justify-between items-center   p-4 mb-2"
            onLongPress={() => {
              setSelectedTask(item);
            }}
          >
            <View className="bg-black h-full w-0.5 -m-4"></View>
            <View className="flex-row justify-between items-center w-full">
              <Text className="text-black text-lg ">{item.text}</Text>
              <View className="flex-row justify-end  ">
                {item.id === selectedTask?.id && (
                  <View className="flex-row ">
                    <TouchableOpacity
                      className="bg-red-500 rounded-full flex items-center justify-center p-4 ml-2"
                      style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)" }}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Text className="text-white text-lg">Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`bg-yellow-500 rounded-full flex items-center justify-center p-4 ml-2 ${
                        !isediting ? "opacity-50" : "opacity-100"
                      } `}
                      style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)" }}
                      onPress={() => handleEdit(item.id, item.text)}
                    >
                      <Text className="text-white text-lg">Edit</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity
                  className={`bg-green-500 rounded-full flex items-center justify-center p-4 ml-2 ${
                    item.isCompleted === false ? "opacity-50" : "opacity-100"
                  }`}
                  style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)" }}
                  onPress={() => completeTask(item.id)}
                >
                  <Text className="text-white font-bold text-lg ">
                    Complete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        )}
      />

      <TextInput
        className="border border-gray-300 p-4 mb-2 rounded-md "
        placeholder="Enter a task"
        onChange={(e) => setTask(e.nativeEvent.text)}
        value={Task}
      />

      <TouchableOpacity
        className="bg-blue-500  rounded-md mb-2 "
        style={{ boxShadow: "2px 3px 4px rgba(0, 0, 0, 0.3)" }}
        onPress={handleUpdate}
      >
        <Text className="text-white py-4 text-2xl text-center font-bold drop-shadow-2xl shadow-black">
          {isediting ? "Update" : "Add"}
        </Text>
      </TouchableOpacity>
    </Pressable>
  );
}
