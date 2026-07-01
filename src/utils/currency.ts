export const formatNaira = (price: number | string): string => {
  const amount =
    typeof price === "string" ? Number(price.replace(/,/g, "")) : price;

  if (Number.isNaN(amount)) {
    return "₦0.00";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};