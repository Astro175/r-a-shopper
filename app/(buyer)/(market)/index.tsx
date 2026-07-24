import { Category, SortBy } from "@/api/types/product";
import ProductCard from "@/components/ProductCard";
import { Colors } from "@/constants/colors";
import { useProducts } from "@/hooks/useProducts";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import ScreenState from "@/components/ScreenState";
import { FlashList } from "@shopify/flash-list";
import { SafeAreaView } from "react-native-safe-area-context";

type Filters = {
  category?: Category;
  rating?: number;
  sortBy?: SortBy;
};

const CATEGORIES: Category[] = [
  "Hand Tool",
  "Networking Equipment",
  "Safety Equipment",
  "Testing Equipment",
  "Power System",
  "General Tools",
  "Robotics and Automation",
  "Specialized Equipment",
  "Control Systems",
  "Measurement Instruments",
];

type FilterChipGroupProps<T extends string> = {
  title: string;
  items: T[];
  selected?: T;
  onSelect: (item: T) => void;
};

const SORTBY: SortBy[] = ["New Today", "New This Week", "Past 30 days"];

const RATINGS = [5, 4, 3, 2, 1];

function FilterChipGroup<T extends string>({
  title,
  items,
  selected,
  onSelect,
}: FilterChipGroupProps<T>) {
  return (
    <View className="mt-2.5">
      <Text className="font-lato-bold text-text">{title}</Text>

      <View className="mt-2.5 flex-row flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selected === item;

          return (
            <Pressable
              key={item}
              onPress={() => onSelect(item)}
              className={`rounded-2xl border px-3 py-2 ${
                isSelected
                  ? "border-primary bg-primary"
                  : "border-borderSecondary"
              }`}
            >
              <Text
                className={`font-lato text-[12px] ${
                  isSelected ? "text-background" : "text-primary"
                }`}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const MarketScreen = () => {
  const { focusSearch } = useLocalSearchParams<{ focusSearch: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);
  const [draftFilters, setDraftFilters] = useState<Filters>();
  const [appliedFilters, setAppliedFilters] = useState<Filters>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [debouncedQuery, debouncer] = useDebouncedValue(searchQuery, {
    wait: 500,
  });
  const {
    data,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    refetch,
  } = useProducts({
    limit: 20,
    category: appliedFilters?.category,
    rating: appliedFilters?.rating,
    sortBy: appliedFilters?.sortBy,
    searchKeyword: debouncedQuery,
  });
  const products = data?.pages.flatMap((page) => page.products) ?? [];

  const handlePresentModalPress = useCallback(() => {
    setDraftFilters(appliedFilters);
    bottomSheetModalRef.current?.present();
  }, [appliedFilters]);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const handleApply = () => {
    setAppliedFilters(draftFilters);
    bottomSheetModalRef.current?.dismiss();
  };

  useEffect(() => {
    if (focusSearch === "true") {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, []);

  return (
    <ScreenState
      onClearFilters={() => {
        setAppliedFilters(undefined);
        setSearchQuery("");
      }}
      isLoading={isLoading}
      error={error}
      isEmpty={products.length === 0}
      emptyMessage="No products available"
      onRetry={refetch}
    >
      <SafeAreaView className="flex-1 bg-white p-4">
        <View className="flex-1">
          <View className="my-4 flex-row items-center rounded-full bg-[#F3F4F9] p-4">
            <Ionicons name="search-outline" size={20} />

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              ref={searchInputRef}
              placeholder="Search for all your engineering supplies"
              placeholderTextColor="#86869E"
              className="flex-1 font-lato"
            />
          </View>

          {/* Filter */}
          <View className="justify-end items-end">
            <Pressable
              onPress={handlePresentModalPress}
              className="flex-row items-center gap-1 rounded-xl border border-secondary p-2"
            >
              <Text className="font-lato text-text">Filter</Text>

              <Ionicons name="funnel-outline" color="black" size={20} />
            </Pressable>

            <BottomSheetModal
              ref={bottomSheetModalRef}
              onChange={handleSheetChanges}
              snapPoints={["90%"]}
            >
              <BottomSheetView className="p-2">
                <FilterChipGroup
                  selected={draftFilters?.category}
                  title="Category"
                  items={CATEGORIES}
                  onSelect={(category) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      category,
                    }))
                  }
                />

                <FilterChipGroup
                  items={SORTBY}
                  title="Sort By"
                  selected={draftFilters?.sortBy}
                  onSelect={(sortBy) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      sortBy,
                    }))
                  }
                />
                <View className="mt-2.5">
                  <Text className="font-lato-bold text-text">Ratings</Text>

                  <View className="mt-2.5 p-2.5">
                    {RATINGS.map((rating) => (
                      <Pressable
                        key={rating}
                        className="mb-3 flex-row items-center justify-between"
                        onPress={() =>
                          setDraftFilters((prev) => ({
                            ...prev,
                            rating,
                          }))
                        }
                      >
                        <View className="flex-row gap-0.5">
                          {[...Array(5)].map((_, index) => (
                            <Ionicons
                              key={index}
                              name={index < rating ? "star" : "star-outline"}
                              size={18}
                              color={Colors.yellowPrimary}
                            />
                          ))}
                        </View>

                        <View
                          className={`h-4 w-4 rounded-full ${
                            rating === draftFilters?.rating
                              ? "bg-primary"
                              : "bg-[#D9D9D9]"
                          }`}
                        />
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Apply Button */}
                <Pressable
                  className="items-center rounded-xl bg-primary py-3.5"
                  onPress={handleApply}
                >
                  <Text className="font-lato text-[14px] text-background">
                    Apply Now
                  </Text>
                </Pressable>
              </BottomSheetView>
            </BottomSheetModal>
          </View>

          {/* Products */}
          <FlashList
            keyExtractor={(item) => item.id}
            data={products}
            numColumns={2}
            onEndReachedThreshold={0.7}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                variant="grid"
                onPress={() => {
                  router.push({
                    pathname: "/product/[id]",
                    params: { id: item.id },
                  });
                }}
              />
            )}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            ListFooterComponent={() =>
              isFetchingNextPage ? <ActivityIndicator size="large" /> : null
            }
            contentContainerClassName="gap-4"
          />
        </View>
      </SafeAreaView>
    </ScreenState>
  );
};

export default MarketScreen;
