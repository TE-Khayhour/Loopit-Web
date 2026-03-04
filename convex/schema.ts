import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
    ingredients: v.array(v.string()),
    nutrition: v.array(v.object({ label: v.string(), value: v.string() })),
    published: v.boolean(),
  }),
});
