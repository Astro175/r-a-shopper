import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "secondary";
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  icon?: ReactNode;
};

const Button = ({
  label,
  variant,
  isLoading,
  isDisabled,
  className,
  icon,
  onPress,
}: ButtonProps) => {
  const baseClasses = "rounded-xl py-3.5 items-center justify-center flex-row gap-2";
  const variantClasses = {
    primary: "bg-primary ",
    outline: "bg-white border-primary border",
    secondary: "bg-white",
  };
  const textClasses = {
    primary: "text-white text-lg font-lato",
    outline: "text-primary font-lato text-lg",
    secondary: "text-primary font-lato text-lg",
  };
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant ?? "primary"]} ${className ?? ""} ${isDisabled ? "opacity-50" : ""}`}
    >
      {!isLoading ? (
        <Text className={`${textClasses[variant ?? "primary"]}`}>{label}</Text>
      ) : (
        <ActivityIndicator
          color={variant === "primary" ? "#FFFFFF" : "#004AAD"}
          size="large"
        />
      )}
      {icon && icon}
    </Pressable>
  );
};

export default Button;
