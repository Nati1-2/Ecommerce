"""
API routes for the Recommendation Service.
"""

from fastapi import APIRouter, Query, HTTPException
from typing import Optional

from .services.recommendation_engine import RecommendationEngine
from .models import RecommendationResponse, PopularProductResponse, ProductInteraction

router = APIRouter()


@router.get("/related/{product_id}")
async def get_related_products(
    product_id: str,
    limit: int = Query(default=10, ge=1, le=50),
):
    """Get products related to a specific product using collaborative filtering."""
    try:
        products = await RecommendationEngine.get_related_products(product_id, limit)
        return {"products": products, "count": len(products)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recently-viewed/{user_id}")
async def get_recently_viewed(
    user_id: str,
    limit: int = Query(default=10, ge=1, le=50),
):
    """Get recently viewed products for a user."""
    try:
        products = await RecommendationEngine.get_recently_viewed(user_id, limit)
        return {"products": products, "count": len(products)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/popular")
async def get_popular_products(
    limit: int = Query(default=10, ge=1, le=50),
    days: int = Query(default=30, ge=1, le=365),
    category: Optional[str] = Query(default=None),
):
    """Get most popular products based on views and purchases."""
    try:
        products = await RecommendationEngine.get_popular_products(limit, days, category)
        return {"products": products, "count": len(products)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/track")
async def track_interaction(interaction: ProductInteraction):
    """Track a user-product interaction for recommendation improvement."""
    try:
        await RecommendationEngine.track_interaction(
            user_id=interaction.user_id,
            product_id=interaction.product_id,
            interaction_type=interaction.interaction_type,
            category=interaction.category,
            price=interaction.price,
        )
        return {"status": "tracked"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/for-you/{user_id}")
async def get_personalized(
    user_id: str,
    limit: int = Query(default=20, ge=1, le=50),
):
    """
    Get personalized recommendations for a user.
    Combines recently viewed, related products, and popular items.
    """
    try:
        # Get recently viewed
        recent = await RecommendationEngine.get_recently_viewed(user_id, 5)

        # Get related products based on most recently viewed
        related = []
        if recent:
            related = await RecommendationEngine.get_related_products(
                recent[0]["product_id"], 10
            )

        # Fill remaining slots with popular products
        popular = await RecommendationEngine.get_popular_products(limit)

        # Deduplicate and merge
        seen = set()
        merged = []

        for product in related + popular:
            pid = product["product_id"]
            if pid not in seen and len(merged) < limit:
                seen.add(pid)
                merged.append(product)

        return {"products": merged, "count": len(merged)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
