import { Colors } from "@/constants/colors";
import { Text, TextInput, TextInputProps, View } from "react-native";

type InputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  errorMessage?: string;
  label?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoComplete?: TextInputProps["autoComplete"];
  autoCapitalize?: TextInputProps['autoCapitalize'] 
};

const Input = ({
  value,
  onChangeText,
  placeholder,
  errorMessage,
  label,
  autoComplete,
  secureTextEntry,
  keyboardType,
  autoCapitalize
}: InputProps) => {
  return (
    <View>
      {label && <Text className="font-lato-bold text-[#1D1E20]">{label}</Text>}
      <TextInput
        className="bg-secondary rounded-xl p-4"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
      />
      {errorMessage && (
        <Text className="text-error font-lato-bold">{errorMessage}</Text>
      )}
    </View>
  );
};

export default Input;
