import { logger } from "@/lib/logger";

export interface UserBehaviorEvent {
  userId: string;
  productId: string;
  category: string;
  action: "VIEW" | "ADD_TO_CART" | "PURCHASE" | "WISHLIST";
  timestamp: string;
}

const userInteractions: UserBehaviorEvent[] = [];

export const recommendationEngine = {
  trackInteraction: (event: Omit<UserBehaviorEvent, "timestamp">) => {
    const fullEvent: UserBehaviorEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };
    userInteractions.push(fullEvent);
    if (userInteractions.length > 500) userInteractions.shift();

    logger.info(`Tracked recommendation behavior [${event.action}]`, {
      meta: { userId: event.userId, productId: event.productId },
    });
  },

  getRecommendedProducts: <T extends { id: string; category: string }>(
    allProducts: T[],
    userId?: string,
    limit = 4
  ): T[] => {
    if (!userId) {
      return allProducts.slice(0, limit);
    }

    const userEvents = userInteractions.filter((e) => e.userId === userId);
    const categoryScores: Record<string, number> = {};

    userEvents.forEach((e) => {
      const weight = e.action === "PURCHASE" ? 5 : e.action === "ADD_TO_CART" ? 3 : 1;
      categoryScores[e.category] = (categoryScores[e.category] || 0) + weight;
    });

    const topCategory = Object.keys(categoryScores).sort(
      (a, b) => categoryScores[b] - categoryScores[a]
    )[0];

    if (topCategory) {
      const categoryMatches = allProducts.filter((p) => p.category === topCategory);
      if (categoryMatches.length >= limit) {
        return categoryMatches.slice(0, limit);
      }
    }

    return allProducts.slice(0, limit);
  },
};
