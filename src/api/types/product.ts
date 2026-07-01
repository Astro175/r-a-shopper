import { Supplier } from "./supplier";

export type Category =
  | "Hand Tool"
  | "Networking Equipment"
  | "Safety Equipment"
  | "Testing Equipment"
  | "Power System"
  | "General Tools"
  | "Robotics and Automation"
  | "Specialized Equipment"
  | "Control Systems"
  | "Measurement Instruments";

export type SortBy = "New Today" | "New This Week" | "Past 30 days";

export type Seller = {
  id: string
  name: string
  logoUrl: string
  location: string
}

export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: Category;
  rating: number;
  imageUrl: string;
  createdAt: string;
  seller: {
    id: string;
    name: string;
  };
};

export type ProductDetail = {
  id: string;
  name: string;
  price: number;
  category: Category;
  rating: number;
  imageUrl: string;
  quantity: number;
  description: string;
  createdAt: string;
  seller: Seller;
};

export type ProductsResponse = {
  products: Product[];
  nextCursor: string | null;
};

export type QueryParams = {
  searchKeyword?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: SortBy;
  cursor?: string;
  limit?: number;
};
