import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const signUp = mutation({
  args: {
    username: v.string(),
    phone: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existingUser) {
      throw new Error("Username already exists");
    }

    const userId = await ctx.db.insert("users", {
      username: args.username,
      phone: args.phone,
      password: args.password,
    });

    return userId;
  },
});

export const signIn = query({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (!user || user.password !== args.password) {
      return null;
    }

    return {
      _id: user._id,
      username: user.username,
      phone: user.phone,
    };
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
