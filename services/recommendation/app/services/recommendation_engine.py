"""
Recommendation engine with multiple strategies.
Designed to be AI-ready for future ML model integration.
"""

import logging
from typing import Optional
from collections import Counter
from datetime import datetime, timedelta

from ..database import get_db

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """
    Multi-strategy recommendation engine.
    
    Current strategies:
    1. Collaborative filtering (users who bought X also bought Y)
    2. Content-based (same category/tags)
    3. Popularity-based (most viewed/purchased)
    4. Recently viewed (user history)
    
    Future ML extensions:
    - TensorFlow/PyTorch embedding models
    - Matrix factorization
    - Deep learning-based recommendations
    """

    @staticmethod
    async def get_related_products(
        product_id: str,
        limit: int = 10
    ) -> list[dict]:
        """
        Get products related to a given product.
        Uses collaborative filtering: finds users who interacted with this product,
        then finds other products those users interacted with.
        """
        db = get_db()

        # Find users who interacted with this product
        interactions = await db.interactions.find(
            {"product_id": product_id}
        ).to_list(length=100)

        if not interactions:
            # Fallback: return popular products from the same category
            product = await db.products.find_one({"product_id": product_id})
            if product:
                return await RecommendationEngine.get_products_by_category(
                    product.get("category", ""), limit, exclude_id=product_id
                )
            return []

        user_ids = list(set(i["user_id"] for i in interactions))

        # Find other products these users interacted with
        pipeline = [
            {
                "$match": {
                    "user_id": {"$in": user_ids},
                    "product_id": {"$ne": product_id},
                }
            },
            {
                "$group": {
                    "_id": "$product_id",
                    "score": {"$sum": 1},
                    "category": {"$first": "$category"},
                }
            },
            {"$sort": {"score": -1}},
            {"$limit": limit},
        ]

        results = await db.interactions.aggregate(pipeline).to_list(length=limit)

        recommendations = []
        for r in results:
            product = await db.products.find_one({"product_id": r["_id"]})
            recommendations.append({
                "product_id": r["_id"],
                "name": product.get("name", "") if product else "",
                "price": product.get("price", 0) if product else 0,
                "category": r.get("category", ""),
                "image": product.get("images", [""])[0] if product and product.get("images") else "",
                "score": r["score"],
                "reason": "Customers who viewed this also viewed",
            })

        return recommendations

    @staticmethod
    async def get_recently_viewed(
        user_id: str,
        limit: int = 10
    ) -> list[dict]:
        """Get recently viewed products for a user."""
        db = get_db()

        views = await db.interactions.find(
            {"user_id": user_id, "interaction_type": "view"}
        ).sort("timestamp", -1).limit(limit).to_list(length=limit)

        seen = set()
        products = []
        for view in views:
            pid = view["product_id"]
            if pid in seen:
                continue
            seen.add(pid)

            product = await db.products.find_one({"product_id": pid})
            products.append({
                "product_id": pid,
                "name": product.get("name", "") if product else "",
                "price": product.get("price", 0) if product else 0,
                "category": view.get("category", ""),
                "image": product.get("images", [""])[0] if product and product.get("images") else "",
                "score": 0,
                "reason": "Recently viewed",
            })

        return products

    @staticmethod
    async def get_popular_products(
        limit: int = 10,
        days: int = 30,
        category: Optional[str] = None
    ) -> list[dict]:
        """
        Get most popular products based on view and purchase counts.
        Weighted scoring: purchases count 3x more than views.
        """
        db = get_db()
        cutoff = datetime.utcnow() - timedelta(days=days)

        match_filter: dict = {"timestamp": {"$gte": cutoff}}
        if category:
            match_filter["category"] = category

        pipeline = [
            {"$match": match_filter},
            {
                "$group": {
                    "_id": "$product_id",
                    "view_count": {
                        "$sum": {"$cond": [{"$eq": ["$interaction_type", "view"]}, 1, 0]}
                    },
                    "purchase_count": {
                        "$sum": {"$cond": [{"$eq": ["$interaction_type", "purchase"]}, 1, 0]}
                    },
                    "category": {"$first": "$category"},
                }
            },
            {
                "$addFields": {
                    "popularity_score": {
                        "$add": ["$view_count", {"$multiply": ["$purchase_count", 3]}]
                    }
                }
            },
            {"$sort": {"popularity_score": -1}},
            {"$limit": limit},
        ]

        results = await db.interactions.aggregate(pipeline).to_list(length=limit)

        products = []
        for r in results:
            product = await db.products.find_one({"product_id": r["_id"]})
            products.append({
                "product_id": r["_id"],
                "name": product.get("name", "") if product else "",
                "price": product.get("price", 0) if product else 0,
                "category": r.get("category", ""),
                "image": product.get("images", [""])[0] if product and product.get("images") else "",
                "view_count": r["view_count"],
                "purchase_count": r["purchase_count"],
            })

        return products

    @staticmethod
    async def get_products_by_category(
        category: str,
        limit: int = 10,
        exclude_id: Optional[str] = None
    ) -> list[dict]:
        """Get products in the same category."""
        db = get_db()

        query: dict = {"category": category, "is_active": True}
        if exclude_id:
            query["product_id"] = {"$ne": exclude_id}

        products = await db.products.find(query).limit(limit).to_list(length=limit)

        return [
            {
                "product_id": p["product_id"],
                "name": p.get("name", ""),
                "price": p.get("price", 0),
                "category": p.get("category", ""),
                "image": p.get("images", [""])[0] if p.get("images") else "",
                "score": 0,
                "reason": "Similar products",
            }
            for p in products
        ]

    @staticmethod
    async def track_interaction(
        user_id: str,
        product_id: str,
        interaction_type: str,
        category: str = "",
        price: float = 0.0,
    ):
        """Track a user-product interaction."""
        db = get_db()
        await db.interactions.insert_one({
            "user_id": user_id,
            "product_id": product_id,
            "interaction_type": interaction_type,
            "category": category,
            "price": price,
            "timestamp": datetime.utcnow(),
        })
        logger.info(f"Tracked {interaction_type} for user {user_id} on product {product_id}")
