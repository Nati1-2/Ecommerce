"""
RabbitMQ event consumer for the Recommendation Service.
Listens to product and order events to update recommendation data.
"""

import os
import json
import logging
import asyncio
import aio_pika
from typing import Optional

from ..database import get_db

logger = logging.getLogger(__name__)

_connection: Optional[aio_pika.abc.AbstractRobustConnection] = None
_channel: Optional[aio_pika.abc.AbstractChannel] = None


async def start_consumer():
    """Start consuming events from RabbitMQ."""
    global _connection, _channel

    rabbitmq_url = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672")

    try:
        _connection = await aio_pika.connect_robust(rabbitmq_url)
        _channel = await _connection.channel()
        await _channel.set_qos(prefetch_count=1)

        exchange = await _channel.declare_exchange(
            "ecommerce_events", aio_pika.ExchangeType.TOPIC, durable=True
        )

        # Create queue for recommendation service
        queue = await _channel.declare_queue(
            "recommendation_service_queue", durable=True
        )

        # Bind to relevant events
        await queue.bind(exchange, routing_key="product.created")
        await queue.bind(exchange, routing_key="product.updated")
        await queue.bind(exchange, routing_key="product.deleted")
        await queue.bind(exchange, routing_key="order.created")
        await queue.bind(exchange, routing_key="payment.completed")

        await queue.consume(process_message)
        logger.info("RabbitMQ consumer started")

    except Exception as e:
        logger.error(f"Failed to connect to RabbitMQ: {e}")
        # Schedule retry
        asyncio.get_event_loop().call_later(5, lambda: asyncio.ensure_future(start_consumer()))


async def process_message(message: aio_pika.abc.AbstractIncomingMessage):
    """Process incoming RabbitMQ messages."""
    async with message.process():
        try:
            body = json.loads(message.body.decode())
            event_type = body.get("type", "")

            logger.info(f"Received event: {event_type}")

            if event_type == "product.created":
                await handle_product_created(body.get("data", {}))
            elif event_type == "product.updated":
                await handle_product_updated(body.get("data", {}))
            elif event_type == "product.deleted":
                await handle_product_deleted(body.get("data", {}))
            elif event_type == "order.created":
                await handle_order_created(body.get("data", {}))
            elif event_type == "payment.completed":
                await handle_payment_completed(body.get("data", {}))

        except Exception as e:
            logger.error(f"Error processing message: {e}")


async def handle_product_created(data: dict):
    """Store product data for recommendation lookups."""
    db = get_db()
    await db.products.update_one(
        {"product_id": data.get("productId", "")},
        {
            "$set": {
                "product_id": data.get("productId", ""),
                "name": data.get("name", ""),
                "price": data.get("price", 0),
                "category": data.get("category", ""),
                "description": data.get("description", ""),
                "images": data.get("images", []),
                "seller_id": data.get("sellerId", ""),
                "is_active": True,
            }
        },
        upsert=True,
    )
    logger.info(f"Product indexed for recommendations: {data.get('productId')}")


async def handle_product_updated(data: dict):
    """Update product data in recommendation store."""
    db = get_db()
    update_fields = {k: v for k, v in data.items() if k != "productId"}
    if update_fields:
        await db.products.update_one(
            {"product_id": data.get("productId", "")},
            {"$set": update_fields},
        )
        logger.info(f"Product updated in recommendations: {data.get('productId')}")


async def handle_product_deleted(data: dict):
    """Mark product as inactive in recommendation store."""
    db = get_db()
    await db.products.update_one(
        {"product_id": data.get("productId", "")},
        {"$set": {"is_active": False}},
    )
    logger.info(f"Product deactivated in recommendations: {data.get('productId')}")


async def handle_order_created(data: dict):
    """Track purchase interactions for collaborative filtering."""
    db = get_db()
    user_id = data.get("userId", "")
    items = data.get("items", [])

    from datetime import datetime

    for item in items:
        await db.interactions.insert_one({
            "user_id": user_id,
            "product_id": item.get("productId", ""),
            "interaction_type": "purchase",
            "category": "",
            "price": item.get("price", 0),
            "timestamp": datetime.utcnow(),
        })

    logger.info(f"Tracked {len(items)} purchase interactions for user {user_id}")


async def handle_payment_completed(data: dict):
    """Log payment completion for analytics."""
    logger.info(f"Payment completed for order: {data.get('orderId')}")


async def stop_consumer():
    """Stop RabbitMQ consumer."""
    global _connection
    if _connection:
        await _connection.close()
        logger.info("RabbitMQ consumer stopped")
