import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
  }),
  meals: defineTable({
    name: v.string(),
    description: v.string(),
    image: v.string(),
    time: v.string(),
    prep: v.string(),
    price: v.string(),
    category: v.string(),
    calories: v.string(),
    difficulty: v.string(),
    serving: v.string(),
    allergens: v.optional(v.string()),
    ingredients: v.array(
      v.object({ name: v.string(), amount: v.string(), unit: v.string() })
    ),
    notIncluded: v.array(
      v.object({ name: v.string(), amount: v.string(), unit: v.string() })
    ),
    utensils: v.array(v.string()),
    nutrition: v.array(v.object({ label: v.string(), value: v.string() })),
    published: v.boolean(),
    featured: v.optional(v.boolean()),
  }),
  users: defineTable({
    username: v.string(),
    phone: v.string(),
    password: v.string(), // In a real app, this should be hashed
  }).index("by_username", ["username"]),
  orders: defineTable({
    userId: v.id("users"),
    total: v.string(),
    status: v.string(), // "Pending", "Approved", "Preparing", "Delivering", "Delivered", "Cancelled"
    address: v.string(),
    phone: v.string(),
    paymentMethod: v.string(), // "Cash"
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
  orderItems: defineTable({
    orderId: v.id("orders"),
    mealId: v.id("meals"),
    quantity: v.number(),
    price: v.string(),
    name: v.string(),
    image: v.string(),
  }).index("by_orderId", ["orderId"]),
});
