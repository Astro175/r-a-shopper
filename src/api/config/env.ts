type ConfigType = {
    baseUrl: string;
    environment: "development" | "production"
    timeout: number
}

export const config: ConfigType = {
  baseUrl: process.env.EXPO_PUBLIC_URL ?? "",
  environment:
    process.env.EXPO_PUBLIC_ENV !== "development" &&
    process.env.EXPO_PUBLIC_ENV !== "production"
      ? "development"
      : process.env.EXPO_PUBLIC_ENV,
  timeout: process.env.EXPO_PUBLIC_ENV === "development" ? 15000 : 10000
};
