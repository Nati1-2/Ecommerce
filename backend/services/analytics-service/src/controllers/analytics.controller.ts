import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { AnalyticsService } from '../services/analytics.service.js';

export class AnalyticsController {
  /**
   * High-level platform dashboard overview
   */
  public static async getOverview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const overview = await AnalyticsService.getOverviewMetrics();
      res.status(200).json({ success: true, data: overview });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves performance analytics for vendor dashboard
   */
  public static async getVendorMetrics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const vendorData = await AnalyticsService.getVendorMetrics(req.user.id);
      res.status(200).json({ success: true, data: vendorData });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves time-series revenue chart data for dashboard visualization
   */
  public static async getRevenueChart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const chartData = await AnalyticsService.getRevenueChartData(days);
      res.status(200).json({ success: true, data: chartData });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Paginated daily logs list for Admin
   */
  public static async getAllLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await AnalyticsService.getAllDailyLogs(page, limit);

      res.status(200).json({
        success: true,
        data: result.logs,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
