import { DailyAnalytics, IDailyAnalytics } from '../models/DailyAnalytics.js';
import { VendorAnalytics, IVendorAnalytics } from '../models/VendorAnalytics.js';
import { logger } from '../utils/logger.js';

export class AnalyticsService {
  /**
   * Helper to format current date string (YYYY-MM-DD)
   */
  private static getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Records order creation metrics
   */
  public static async recordOrderCreated(data: { orderId: string; items?: any[] }): Promise<void> {
    const today = this.getTodayDateString();
    const itemCount = data.items ? data.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 1;

    await DailyAnalytics.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          totalOrders: 1,
          itemsSold: itemCount
        }
      },
      { upsert: true, new: true }
    );

    logger.info(`Recorded order created metric for date: ${today}`);
  }

  /**
   * Records payment completion and aggregates revenue
   */
  public static async recordPaymentCompleted(data: {
    amount: number;
    vendorId?: string;
  }): Promise<void> {
    const today = this.getTodayDateString();
    const amount = Number(data.amount) || 0;

    await DailyAnalytics.findOneAndUpdate(
      { date: today },
      {
        $inc: {
          totalRevenue: amount,
          successfulPayments: 1
        }
      },
      { upsert: true, new: true }
    );

    if (data.vendorId) {
      await VendorAnalytics.findOneAndUpdate(
        { vendorId: data.vendorId },
        {
          $inc: {
            totalSales: 1,
            totalRevenue: amount
          },
          $set: { lastOrderAt: new Date() }
        },
        { upsert: true, new: true }
      );
    }

    logger.info(`Recorded payment completed metric: +$${amount} on ${today}`);
  }

  /**
   * Records payment failure metric
   */
  public static async recordPaymentFailed(data: { orderId: string }): Promise<void> {
    const today = this.getTodayDateString();

    await DailyAnalytics.findOneAndUpdate(
      { date: today },
      {
        $inc: { failedPayments: 1 }
      },
      { upsert: true, new: true }
    );

    logger.info(`Recorded payment failure metric on date: ${today}`);
  }

  /**
   * Records low stock alert for vendor
   */
  public static async recordLowStockAlert(data: { vendorId?: string; productId: string }): Promise<void> {
    if (data.vendorId) {
      await VendorAnalytics.findOneAndUpdate(
        { vendorId: data.vendorId },
        { $inc: { lowStockCount: 1 } },
        { upsert: true, new: true }
      );
    }
  }

  /**
   * Platform-wide high-level dashboard metrics summary
   */
  public static async getOverviewMetrics(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    successfulPayments: number;
    failedPayments: number;
    itemsSold: number;
    conversionRate: number;
  }> {
    const result = await DailyAnalytics.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalRevenue' },
          totalOrders: { $sum: '$totalOrders' },
          successfulPayments: { $sum: '$successfulPayments' },
          failedPayments: { $sum: '$failedPayments' },
          itemsSold: { $sum: '$itemsSold' }
        }
      }
    ]);

    if (!result || result.length === 0) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        successfulPayments: 0,
        failedPayments: 0,
        itemsSold: 0,
        conversionRate: 0
      };
    }

    const aggregated = result[0];
    const totalAttempts = aggregated.successfulPayments + aggregated.failedPayments;
    const conversionRate = totalAttempts > 0 ? Math.round((aggregated.successfulPayments / totalAttempts) * 100) : 0;

    return {
      totalRevenue: Math.round(aggregated.totalRevenue * 100) / 100,
      totalOrders: aggregated.totalOrders,
      successfulPayments: aggregated.successfulPayments,
      failedPayments: aggregated.failedPayments,
      itemsSold: aggregated.itemsSold,
      conversionRate
    };
  }

  /**
   * Retrieves performance metrics for a specific vendor
   */
  public static async getVendorMetrics(vendorId: string): Promise<IVendorAnalytics> {
    let vendorData = await VendorAnalytics.findOne({ vendorId });
    if (!vendorData) {
      vendorData = await VendorAnalytics.create({
        vendorId,
        totalSales: 0,
        totalRevenue: 0,
        lowStockCount: 0
      });
    }
    return vendorData;
  }

  /**
   * Generates time-series daily revenue & order data for frontend charts
   */
  public static async getRevenueChartData(days = 30): Promise<IDailyAnalytics[]> {
    return DailyAnalytics.find().sort({ date: -1 }).limit(days);
  }

  /**
   * Returns paginated daily analytics logs for Admin overview
   */
  public static async getAllDailyLogs(page = 1, limit = 20): Promise<{ logs: IDailyAnalytics[]; total: number }> {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      DailyAnalytics.find().sort({ date: -1 }).skip(skip).limit(limit),
      DailyAnalytics.countDocuments()
    ]);
    return { logs, total };
  }
}
