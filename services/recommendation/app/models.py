"""
Pydantic models for the Recommendation Service.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProductView(BaseModel):
    """Tracks when a user views a product."""
    user_id: str
    product_id: str
    category: str = ""
    viewed_at: datetime = Field(default_factory=datetime.utcnow)


class ProductInteraction(BaseModel):
    """Tracks user interactions with products."""
    user_id: str
    product_id: str
    interaction_type: str  # 'view', 'cart', 'purchase', 'wishlist'
    category: str = ""
    price: float = 0.0
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class RecommendationResponse(BaseModel):
    """Response model for recommendations."""
    product_id: str
    name: str = ""
    price: float = 0.0
    category: str = ""
    image: str = ""
    score: float = 0.0
    reason: str = ""


class PopularProductResponse(BaseModel):
    """Response model for popular products."""
    product_id: str
    name: str = ""
    price: float = 0.0
    category: str = ""
    image: str = ""
    view_count: int = 0
    purchase_count: int = 0
