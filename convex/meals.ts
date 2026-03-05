import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

const ingredientItem = v.object({
  name: v.string(),
  amount: v.string(),
  unit: v.string(),
});
const nutritionItem = v.object({ label: v.string(), value: v.string() });

const mealFields = {
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
  allergens: v.string(),
  ingredients: v.array(ingredientItem),
  notIncluded: v.array(ingredientItem),
  utensils: v.array(v.string()),
  nutrition: v.array(nutritionItem),
  published: v.boolean(),
};

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("meals")
      .filter((q) => q.eq(q.field("published"), true))
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("meals").collect();
  },
});

export const create = mutation({
  args: mealFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("meals", args);
  },
});

export const update = mutation({
  args: { id: v.id("meals"), ...mealFields },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const togglePublished = mutation({
  args: { id: v.id("meals") },
  handler: async (ctx, args) => {
    const meal = await ctx.db.get(args.id);
    if (meal) {
      await ctx.db.patch(args.id, { published: !meal.published });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("meals") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
