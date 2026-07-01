import { Category, SortBy } from "@/api/types/product";
import ProductCard from "@/components/ProductCard";
import { Colors } from "@/constants/colors";
import { useProducts } from "@/hooks/useProducts";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.chipContainer}>
        {items.map((item) => {
          const isSelected = selected === item;

          return (
            <Pressable
              key={item}
              onPress={() => onSelect(item)}
              style={[styles.chip, isSelected && styles.chipSelected]}
            >
              <Text
                style={[styles.chipText, isSelected && styles.chipTextSelected]}
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
  const [searchQuery, setSearchQuery] = useState("");
  const [draftFilters, setDraftFilters] = useState<Filters>();
  const [appliedFilters, setAppliedFilters] = useState<Filters>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [debouncedQuery, debouncer] = useDebouncedValue(searchQuery, {
    wait: 500,
  });
  const { data, error, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useProducts({
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

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges");
  }, []);

  const handleApply = () => {
    setAppliedFilters(draftFilters);
    bottomSheetModalRef.current?.dismiss();
  };

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Something went wrong. Please try again.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TextInput value={searchQuery} onChangeText={setSearchQuery} />
        <View style={styles.filterContainer}>
          <Pressable
            onPress={handlePresentModalPress}
            style={styles.filterTrigger}
          >
            <Text style={styles.filterTriggerText}>Filter</Text>
            <Ionicons name="funnel-outline" color={Colors.secondary} />
          </Pressable>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            snapPoints={["90%"]}
          >
            <BottomSheetView>
              <FilterChipGroup
                selected={draftFilters?.category}
                title="Category"
                items={CATEGORIES}
                onSelect={(category) =>
                  setDraftFilters((prev) => ({ ...prev, category }))
                }
              />
              <FilterChipGroup
                items={SORTBY}
                title="Sort By"
                selected={draftFilters?.sortBy}
                onSelect={(sortBy) =>
                  setDraftFilters((prev) => ({ ...prev, sortBy }))
                }
              />
              <View style={styles.ratingRow}>
                <Text style={styles.sectionTitle}>Ratings</Text>
                <View style={styles.section}>
                  {RATINGS.map((rating) => (
                    <Pressable
                      key={rating}
                      style={styles.ratingItem}
                      onPress={() =>
                        setDraftFilters((prev) => ({ ...prev, rating }))
                      }
                    >
                      <View style={styles.stars}>
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
                        style={[
                          styles.radio,
                          rating === draftFilters?.rating &&
                            styles.radioSelected,
                        ]}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
              <Pressable style={styles.filterButton} onPress={handleApply}>
                <Text style={styles.filterButtonText}>Apply Now</Text>
              </Pressable>
            </BottomSheetView>
          </BottomSheetModal>
        </View>
        <FlashList
          keyExtractor={(item) => item.id}
          data={products}
          numColumns={2}
          contentContainerStyle={{ gap: 16, padding: 16 }}
          onEndReachedThreshold={0.7}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              variant="grid"
              onPress={() =>
                router.push({
                  pathname: "/(buyer)/product/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          ListFooterComponent={() => {
            if (!isFetchingNextPage) {
              return null;
            }
            return <ActivityIndicator size="large" />;
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  filterContainer: {
    justifyContent: "flex-end",
  },
  filterTrigger: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.secondary,
    flexDirection: "row",
    gap: 4,
  },
  filterTriggerText: {
    fontFamily: "Lato_400Regular",
    fontSize: 12,
    color: Colors.text,
  },
  sectionTitle: {
    fontFamily: "Lato_700Bold",
    color: Colors.text,
  },
  chipContainer: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  section: {
    marginTop: 10,
    padding: 10,
  },
  chip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontFamily: "Lato_400Regular",
    fontSize: 12,
    color: Colors.primary,
  },
  chipTextSelected: {
    color: Colors.background,
  },
  ratingRow: {
    marginTop: 10,
  },
  ratingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
  },
  radioSelected: {
    backgroundColor: Colors.primary,
  },
  listColumn: {
    gap: 16,
  },
  listContent: {
    gap: 16,
    padding: 16,
  },
  filterButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  filterButtonText: {
    color: Colors.background,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
});

export default MarketScreen;
