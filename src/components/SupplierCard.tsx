import { Supplier } from "@/api/types/supplier";
import { Colors } from "@/constants/colors";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

const SupplierCard = ({ supplier }: { supplier: Supplier }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: supplier.logoUrl }} style={styles.logo} />
      </View>

      <Text style={styles.name}>{supplier.name}</Text>

      <Text style={styles.location}>{supplier.location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
  },
  name: {
    fontFamily: "Lato_700Bold",
    fontSize: 12,
    color: Colors.text,
  },
  location: {
    fontFamily: "Lato_700Bold",
    fontSize: 10,
    color: Colors.textSecondary,
  },
});

export default SupplierCard;
