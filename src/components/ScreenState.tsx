import { Colors } from "@/constants/colors";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenStateProps = {
  isLoading: boolean;
  error?: unknown;
  isEmpty?: boolean;
  emptyMessage?: string;
  onClearFilters?: () => void;
  onRetry?: () => void;
  children: React.ReactNode;
};

const ScreenState = ({
  isLoading,
  error,
  isEmpty,
  emptyMessage,
  onRetry,
  onClearFilters,
  children,
}: ScreenStateProps) => {
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator color={Colors.primary} size="large" />
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Something went wrong</Text>
        <Pressable onPress={onRetry}>
          <Text>Try again</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
  if (isEmpty) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="font-lato text-xl">{emptyMessage}</Text>
        {onClearFilters && (
          <Pressable
            onPress={onClearFilters}
            className="bg-primary px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-lato-bold">Clear Filters</Text>
          </Pressable>
        )}
      </SafeAreaView>
    );
  }

  return <>{children}</>;
};

export default ScreenState;
