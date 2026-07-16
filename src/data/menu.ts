import jollof from "@/assets/dish-jollof.jpg";
import egusi from "@/assets/dish-egusi.jpg";
import suya from "@/assets/dish-suya.jpg";
import pasta from "@/assets/dish-pasta.jpg";
import friesClassic from "@/assets/fries-classic.jpg";
import friesCheese from "@/assets/fries-cheese.jpg";
import friesSweet from "@/assets/fries-sweet.jpg";
import friesPeri from "@/assets/fries-peri.jpg";
import chapman from "@/assets/drink-chapman.jpg";
import zobo from "@/assets/drink-zobo.jpg";
import orange from "@/assets/drink-orange.jpg";
import coffee from "@/assets/drink-coffee.jpg";

export type Category = "dishes" | "fries" | "drinks";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
};

export const CATEGORIES: { id: Category; label: string; image: string; blurb: string }[] = [
  { id: "dishes", label: "Dishes", image: jollof, blurb: "Hearty mains, cooked to order." },
  { id: "fries", label: "Fries", image: friesCheese, blurb: "Crispy, golden, and loaded." },
  { id: "drinks", label: "Drinks", image: chapman, blurb: "Cold-pressed, fresh, refreshing." },
];

export const MENU: MenuItem[] = [
  // Dishes (6)
  { id: "d1", name: "Jollof Rice & Chicken", price: 4500, category: "dishes", image: jollof },
  { id: "d2", name: "Egusi & Pounded Yam", price: 5000, category: "dishes", image: egusi },
  { id: "d3", name: "Suya Beef Platter", price: 6000, category: "dishes", image: suya },
  { id: "d4", name: "Creamy Alfredo Pasta", price: 5500, category: "dishes", image: pasta },
  { id: "d5", name: "Fried Rice & Turkey", price: 5200, category: "dishes", image: jollof },
  { id: "d6", name: "Ofada Rice & Ayamase", price: 5800, category: "dishes", image: egusi },

  // Fries (6)
  { id: "f1", name: "Classic Fries", price: 1500, category: "fries", image: friesClassic },
  { id: "f2", name: "Cheese & Bacon Fries", price: 3000, category: "fries", image: friesCheese },
  { id: "f3", name: "Sweet Potato Fries", price: 2500, category: "fries", image: friesSweet },
  { id: "f4", name: "Peri-Peri Fries", price: 2200, category: "fries", image: friesPeri },
  { id: "f5", name: "Loaded Chilli Fries", price: 3200, category: "fries", image: friesCheese },
  { id: "f6", name: "Garlic Parmesan Fries", price: 2600, category: "fries", image: friesClassic },

  // Drinks (6)
  { id: "b1", name: "Chapman", price: 1800, category: "drinks", image: chapman },
  { id: "b2", name: "Zobo Punch", price: 1200, category: "drinks", image: zobo },
  { id: "b3", name: "Fresh Orange Juice", price: 1500, category: "drinks", image: orange },
  { id: "b4", name: "Iced Coffee Latte", price: 2000, category: "drinks", image: coffee },
  { id: "b5", name: "Pineapple Cooler", price: 1600, category: "drinks", image: orange },
  { id: "b6", name: "Hibiscus Iced Tea", price: 1400, category: "drinks", image: zobo },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
