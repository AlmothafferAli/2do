import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
export default function Login() {
  return (
    <TouchableOpacity onPress={() => router.replace("./index")}>
      <Text>login</Text>
    </TouchableOpacity>
  );
}
