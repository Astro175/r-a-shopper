import { Colors } from "@/constants/colors";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  errorMessage?: string;
  label?: string;
  isPassword?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoComplete?: TextInputProps["autoComplete"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
};

const Input = ({
  value,
  onChangeText,
  placeholder,
  errorMessage,
  label,
  autoComplete,
  isPassword,
  keyboardType,
  autoCapitalize,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <View>
      {label && (
        <Text className="font-lato-bold text-[#1D1E20] mb-2">{label}</Text>
      )}
      {isPassword ? (
        <View className="flex-row items-center justify-center px-4 bg-secondary rounded-xl">
          {showPassword ? (
            <Pressable onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons name="eye-off-outline" size={20} color="#1D1E20" />
            </Pressable>
          ) : (
            <Pressable onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons name="eye-outline" size={20} color="#1D1E20" />
            </Pressable>
          )}
          <TextInput
            className="flex-1 p-4 bg-secondary rounded-xl text-[#1D1E20]"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={Colors.placeholder}
            secureTextEntry={showPassword}
            keyboardType={keyboardType}
            autoComplete={autoComplete}
            autoCapitalize={autoCapitalize}
          />
        </View>
      ) : (
        <TextInput
          className="p-4 bg-secondary rounded-xl"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          secureTextEntry={showPassword}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
        />
      )}
      {errorMessage && (
        <Text className="text-error font-lato-bold">{errorMessage}</Text>
      )}
    </View>
  );
};

export default Input;
