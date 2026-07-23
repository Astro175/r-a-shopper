import { Colors } from "@/constants/colors";
import { useOnboardingStore } from "@/stores/onboardingStore";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const ONBOARDING_DATA = [
  {
    id: "1",
    image: require("@/assets/images/onboardingImage1.png"),
    title: "Buying Made Easy",
    subtitle: `Find the engineering supplies you need fast and use
our advanced filters to quickly find exactly what
you’re looking for.`,
  },
  {
    id: "2",
    image: require("@/assets/images/onboardingImage2.png"),
    title: "Split Payment",
    subtitle: `Our Split payment allows you to divide the total cost
of your purchase with your friends which helps to
offer flexibility and convenience`,
  },
  {
    id: "3",
    image: require("@/assets/images/onboardingImage3.png"),
    title: "Escrow Payment System",
    subtitle: `We offer Escrow payment system that securely hold
funds during a transaction, releasing them to the 
seller only after all conditions are met, providing
protection for both parties`,
  },
];

const OnboardingScreen = () => {
  const { width } = Dimensions.get("window");
  const [currentIndex, setCurrentIndex] = useState(0);
  const FlatListRef = useRef<FlatList>(null);
  const setHasOnboarded = useOnboardingStore((state) => state.setHasOnboarded);
  const isLastSlide = currentIndex === ONBOARDING_DATA.length - 1;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  });

  const handleNext = () => {
    FlatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  };

  const handleGetStarted = () => {
    setHasOnboarded(true);
    router.replace("/");
  };

  const handleSkip = () => {
    FlatListRef.current?.scrollToIndex({
      index: ONBOARDING_DATA.length - 1,
      animated: true,
    });
  };

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <FlatList
        ref={FlatListRef}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        data={ONBOARDING_DATA}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        horizontal={true}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slideContainer, { width }]}>
            <View style={styles.container}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.footer}>
        {isLastSlide ? (
          <Pressable style={styles.getStartedButton} onPress={handleGetStarted}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </Pressable>
        ) : (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Pressable onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
            <Pressable
              onPress={isLastSlide ? handleGetStarted : handleNext}
              style={styles.nextButton}
            >
              <Ionicons
                name="chevron-forward-outline"
                color={Colors.background}
                size={25}
              />
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  slideContainer: {},

  image: {
    width: 300,
    height: 300,
  },

  title: {
    fontSize: 20,
    fontFamily: "Lato_400Regular",
    color: Colors.text,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "Lato_300Light",
    textAlign: "center",
    marginTop: 10,
  },

  footer: {
    paddingHorizontal: 15,
  },
  footerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  skipText: {
    fontFamily: "Lato_300Light",
    color: Colors.text,
  },

  nextButton: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  getStartedButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  getStartedButtonText: {
    color: Colors.background,
    fontFamily: "Lato_400Regular",
    fontSize: 14,
  },
});

export default OnboardingScreen;
