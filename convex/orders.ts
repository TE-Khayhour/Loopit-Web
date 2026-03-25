import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrder = mutation({
  args: {
    userId: v.id("users"),
    total: v.string(),
    address: v.string(),
    phone: v.string(),
    items: v.array(
      v.object({
        mealId: v.id("meals"),
        quantity: v.number(),
        price: v.string(),
        name: v.string(),
        image: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      total: args.total,
      address: args.address,
      phone: args.phone,
      status: "Pending",
      paymentMethod: "Cash",
      createdAt: Date.now(),
    });

    for (const item of args.items) {
      await ctx.db.insert("orderItems", {
        orderId,
        mealId: item.mealId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
      });
    }

    return orderId;
  },
});

export const listUserOrders = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
          .collect();
        return { ...order, items };
      })
    );

    return ordersWithItems;
  },
});

export const listAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const items = await ctx.db
          .query("orderItems")
          .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
          .collect();
        const user = await ctx.db.get(order.userId);
        return { ...order, items, user };
      })
    );

    return ordersWithDetails;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: args.status });
  },
});
