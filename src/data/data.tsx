import type {
  ICategory,
  IFood,
  IOrder,
  IPromotion,
  ITestimonial,
} from "../types/food";
import type { IDemoUser } from "../types/auth";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

export const foods: IFood[] = [
  {
    id: "f1",
    name: "Classic Cheeseburger",
    category: "burger",
    price: 9.99,
    image: img("photo-1568901346375-23c9450c58cd"),
    description:
      "Juicy beef patty, melted cheddar, fresh lettuce and our signature house sauce on a toasted brioche bun.",
    rating: 4.8,
    reviews: 214,
    tags: ["beef", "cheese", "classic"],
    available: true,
    featured: true,
  },
  {
    id: "f2",
    name: "Double Smash Burger",
    category: "burger",
    price: 12.49,
    image: img("photo-1550547660-d9450f859349"),
    description:
      "Two crispy-edged smash patties, American cheese, pickles and secret smash sauce.",
    rating: 4.9,
    reviews: 167,
    tags: ["beef", "smash", "double"],
    available: true,
    featured: true,
  },
  {
    id: "f3",
    name: "Grilled Chicken Burger",
    category: "burger",
    price: 10.99,
    image: img("photo-1571091718767-18b5b1457add"),
    description:
      "Flame-grilled chicken fillet, lettuce, tomato and garlic aioli on a soft sesame bun.",
    rating: 4.6,
    reviews: 98,
    tags: ["chicken", "grilled"],
    available: true,
    featured: false,
  },
  {
    id: "f4",
    name: "Margherita Pizza",
    category: "pizza",
    price: 14.99,
    image: img("photo-1574071318508-1cdbab80d002"),
    description:
      "Wood-fired base with San Marzano tomato, fresh mozzarella and basil.",
    rating: 4.7,
    reviews: 143,
    tags: ["vegetarian", "classic"],
    available: true,
    featured: true,
  },
  {
    id: "f5",
    name: "Pepperoni Feast Pizza",
    category: "pizza",
    price: 16.49,
    image: img("photo-1628840042765-356cda07504e"),
    description:
      "Double pepperoni, mozzarella and a rich tomato sauce on a crispy thin crust.",
    rating: 4.8,
    reviews: 189,
    tags: ["pepperoni", "meat"],
    available: true,
    featured: false,
  },
  {
    id: "f6",
    name: "Veggie Supreme Pizza",
    category: "pizza",
    price: 15.49,
    image: img("photo-1513104890138-7c749659a591"),
    description:
      "Bell peppers, red onion, mushrooms, olives and sweetcorn with mozzarella.",
    rating: 4.5,
    reviews: 76,
    tags: ["vegetarian", "veggie"],
    available: true,
    featured: false,
  },
  {
    id: "f7",
    name: "Grilled Chicken Caesar Salad",
    category: "salad",
    price: 11.99,
    image: img("photo-1546069901-ba9599a7e63c"),
    description:
      "Crisp romaine, grilled chicken, parmesan shavings, croutons and creamy caesar dressing.",
    rating: 4.6,
    reviews: 121,
    tags: ["chicken", "healthy"],
    available: true,
    featured: true,
  },
  {
    id: "f8",
    name: "Garden Fresh Salad",
    category: "salad",
    price: 8.99,
    image: img("photo-1512621776951-a57141f2eefd"),
    description:
      "Mixed greens, cherry tomatoes, cucumber, carrots and a light balsamic vinaigrette.",
    rating: 4.4,
    reviews: 64,
    tags: ["vegetarian", "healthy"],
    available: true,
    featured: false,
  },
  {
    id: "f9",
    name: "Greek Salad",
    category: "salad",
    price: 10.49,
    image: img("photo-1540420773420-3366772f4999"),
    description:
      "Tomato, cucumber, red onion, kalamata olives and feta with oregano dressing.",
    rating: 4.5,
    reviews: 88,
    tags: ["vegetarian", "mediterranean"],
    available: true,
    featured: false,
  },
  {
    id: "f10",
    name: "Crispy Fried Chicken",
    category: "chicken",
    price: 13.49,
    image: img("photo-1626645738196-c2a7c87a8f58"),
    description:
      "Golden, crunchy fried chicken pieces marinated in our spiced buttermilk blend.",
    rating: 4.7,
    reviews: 152,
    tags: ["fried", "crispy"],
    available: true,
    featured: true,
  },
  {
    id: "f11",
    name: "BBQ Chicken Wings",
    category: "chicken",
    price: 9.99,
    image: img("photo-1608039755401-742074f0548d"),
    description:
      "Sticky glazed wings tossed in smoky BBQ sauce, served with ranch dip.",
    rating: 4.6,
    reviews: 134,
    tags: ["bbq", "wings"],
    available: true,
    featured: false,
  },
  {
    id: "f12",
    name: "Chicken Alfredo Pasta",
    category: "chicken",
    price: 15.99,
    image: img("photo-1621996346565-e3dbc646d9a9"),
    description:
      "Fettuccine tossed in a rich parmesan cream sauce with grilled chicken.",
    rating: 4.7,
    reviews: 107,
    tags: ["pasta", "creamy"],
    available: true,
    featured: false,
  },
  {
    id: "f13",
    name: "Chocolate Lava Cake",
    category: "dessert",
    price: 6.99,
    image: img("photo-1606313564200-e75d5e30476c"),
    description:
      "Warm chocolate cake with a molten centre, served with vanilla ice cream.",
    rating: 4.9,
    reviews: 203,
    tags: ["chocolate", "dessert"],
    available: true,
    featured: true,
  },
  {
    id: "f14",
    name: "Fresh Fruit Bowl",
    category: "dessert",
    price: 7.49,
    image: img("photo-1511688878353-3a2f5be94cd7"),
    description:
      "Seasonal fruits, granola, honey and a sprinkle of mint. Light and refreshing.",
    rating: 4.5,
    reviews: 59,
    tags: ["fruit", "healthy"],
    available: true,
    featured: false,
  },
  {
    id: "f15",
    name: "Classic Cold Brew",
    category: "drinks",
    price: 4.99,
    image: img("photo-1517701604599-bb29b565090c"),
    description:
      "Slow-steeped cold brew coffee, smooth and bold. Served over ice.",
    rating: 4.6,
    reviews: 91,
    tags: ["coffee", "cold"],
    available: true,
    featured: false,
  },
  {
    id: "f16",
    name: "Fresh Orange Juice",
    category: "drinks",
    price: 3.99,
    image: img("photo-1613478223719-2ab802602423"),
    description:
      "Squeezed-to-order oranges, 100% natural with zero added sugar.",
    rating: 4.7,
    reviews: 78,
    tags: ["juice", "fresh"],
    available: true,
    featured: false,
  },
];

export const categories: ICategory[] = [
  {
    id: "c1",
    name: "Burgers",
    slug: "burger",
    image: img("photo-1568901346375-23c9450c58cd"),
    description: "Juicy, flame-grilled favourites",
  },
  {
    id: "c2",
    name: "Pizza",
    slug: "pizza",
    image: img("photo-1513104890138-7c749659a591"),
    description: "Wood-fired, loaded & cheesy",
  },
  {
    id: "c3",
    name: "Salads",
    slug: "salad",
    image: img("photo-1512621776951-a57141f2eefd"),
    description: "Fresh, crisp & healthy",
  },
  {
    id: "c4",
    name: "Chicken",
    slug: "chicken",
    image: img("photo-1626645738196-c2a7c87a8f58"),
    description: "Crispy, juicy & finger-licking",
  },
  {
    id: "c5",
    name: "Desserts",
    slug: "dessert",
    image: img("photo-1606313564200-e75d5e30476c"),
    description: "Sweet endings done right",
  },
  {
    id: "c6",
    name: "Drinks",
    slug: "drinks",
    image: img("photo-1517701604599-bb29b565090c"),
    description: "Cold, fresh & refreshing",
  },
];

export const promotions: IPromotion[] = [
  {
    id: "p1",
    title: "Burger Tuesday",
    subtitle: "Buy any burger, get 50% off the second one.",
    image: img("photo-1568901346375-23c9450c58cd"),
    badge: "-50%",
    validUntil: "Ends this Tuesday",
  },
  {
    id: "p2",
    title: "Family Pizza Box",
    subtitle: "Any 2 large pizzas + 1 dessert for $29.99.",
    image: img("photo-1513104890138-7c749659a591"),
    badge: "Deal",
    validUntil: "All weekend",
  },
  {
    id: "p3",
    title: "Free Delivery",
    subtitle: "Free delivery on all orders above $25.",
    image: img("photo-1504674900247-0877df9cc836"),
    badge: "FREE",
    validUntil: "Limited time",
  },
];

export const testimonials: ITestimonial[] = [
  {
    id: "t1",
    name: "Sarah Mitchell",
    role: "Regular customer",
    message:
      "The double smash burger is the best I have had in the city. Delivery was fast and the food arrived hot.",
    rating: 5,
  },
  {
    id: "t2",
    name: "James Carter",
    role: "Food blogger",
    message:
      "Consistently fresh ingredients and bold flavours. Their wood-fired pizza is a must try.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Priya Sharma",
    role: "Local guide",
    message:
      "Great menu variety and very reliable ordering. The lava cake dessert is dangerously good.",
    rating: 4,
  },
];

export const orders: IOrder[] = [
  {
    id: "ORD-1024",
    customer: "Sarah Mitchell",
    items: 2,
    total: 22.48,
    status: "delivered",
    placedAt: "Today, 12:40 PM",
  },
  {
    id: "ORD-1023",
    customer: "James Carter",
    items: 3,
    total: 36.97,
    status: "out-for-delivery",
    placedAt: "Today, 11:15 AM",
  },
  {
    id: "ORD-1022",
    customer: "Priya Sharma",
    items: 1,
    total: 9.99,
    status: "preparing",
    placedAt: "Today, 10:05 AM",
  },
  {
    id: "ORD-1021",
    customer: "Daniel Lee",
    items: 4,
    total: 48.45,
    status: "delivered",
    placedAt: "Yesterday, 8:30 PM",
  },
  {
    id: "ORD-1020",
    customer: "Emma Wilson",
    items: 2,
    total: 27.98,
    status: "cancelled",
    placedAt: "Yesterday, 6:12 PM",
  },
];

export const demoUsers: IDemoUser[] = [
  {
    id: "u-admin",
    name: "Admin User",
    email: "admin@besteats.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "u-user",
    name: "Demo User",
    email: "user@besteats.com",
    password: "user123",
    role: "user",
  },
];

export const brand = {
  name: "Best Eats",
  tagline: "Delicious food, delivered fast.",
  phone: "1-800-BEST-EAT",
  email: "support@besteats.com",
  address: "12 Flavor Street, Food City, FC 10001",
  socials: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
};
