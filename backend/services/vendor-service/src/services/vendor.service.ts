import { Vendor, IVendor } from '../models/Vendor.js';
import { Store } from '../models/Store.js';
import { Commission, ICommission } from '../models/Commission.js';
import {
  publishVendorCreated,
  publishVendorApproved
} from '../events/vendor.publisher.js';

export class VendorService {
  /**
   * Registers a new vendor for a user
   */
  static async registerVendor(
    userId: string,
    email: string,
    data: { businessName: string; phone: string; description?: string }
  ): Promise<IVendor> {
    // Check if vendor profile already exists for this user
    const existingVendor = await Vendor.findOne({ userId });
    if (existingVendor) {
      throw new Error('Vendor registration already exists for this user.');
    }

    const vendor = await Vendor.create({
      userId,
      email,
      businessName: data.businessName,
      phone: data.phone,
      description: data.description,
      status: 'ACTIVE',
      verificationStatus: 'PENDING'
    });

    // Publish VENDOR_CREATED event
    await publishVendorCreated({
      vendorId: vendor._id.toString(),
      userId: vendor.userId,
      businessName: vendor.businessName,
      createdAt: vendor.createdAt
    });

    return vendor;
  }

  /**
   * Retrieves vendor profile by userId
   */
  static async getVendorProfile(userId: string): Promise<IVendor> {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new Error('Vendor profile not found.');
    }
    return vendor;
  }

  /**
   * Retrieves vendor profile by vendorId
   */
  static async getVendorById(vendorId: string): Promise<IVendor> {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendor not found.');
    }
    return vendor;
  }

  /**
   * Updates vendor profile details
   */
  static async updateVendorProfile(
    userId: string,
    data: Partial<IVendor>
  ): Promise<IVendor> {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
      throw new Error('Vendor profile not found.');
    }

    // Only allow updating specific fields
    if (data.businessName !== undefined) vendor.businessName = data.businessName;
    if (data.phone !== undefined) vendor.phone = data.phone;
    if (data.description !== undefined) vendor.description = data.description;
    if (data.logo !== undefined) vendor.logo = data.logo;

    await vendor.save();
    return vendor;
  }

  /**
   * Admin: List all vendors
   */
  static async listVendors(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const vendors = await Vendor.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Vendor.countDocuments();

    return {
      vendors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Admin: List pending vendor approvals
   */
  static async listPendingVendors(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const query = { verificationStatus: 'PENDING' };
    const vendors = await Vendor.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Vendor.countDocuments(query);

    return {
      vendors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Admin: Approve vendor application
   */
  static async approveVendor(vendorId: string): Promise<IVendor> {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendor not found.');
    }

    vendor.verificationStatus = 'APPROVED';
    vendor.status = 'ACTIVE';
    await vendor.save();

    // Publish VENDOR_APPROVED event
    await publishVendorApproved({
      vendorId: vendor._id.toString(),
      status: vendor.status,
      approvedAt: new Date()
    });

    return vendor;
  }

  /**
   * Admin: Reject vendor application
   */
  static async rejectVendor(vendorId: string): Promise<IVendor> {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendor not found.');
    }

    vendor.verificationStatus = 'REJECTED';
    await vendor.save();

    return vendor;
  }

  /**
   * Admin: Modify vendor status (ACTIVE, SUSPENDED, BLOCKED)
   */
  static async updateVendorStatus(
    vendorId: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED'
  ): Promise<IVendor> {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      throw new Error('Vendor not found.');
    }

    vendor.status = status;
    await vendor.save();

    return vendor;
  }

  /**
   * Calculates commission amount based on total price and platform percentage
   */
  static calculateCommission(amount: number, percentage: number): number {
    const commissionVal = amount * (percentage / 100);
    return parseFloat(commissionVal.toFixed(2));
  }

  /**
   * Records vendor earnings and saves commission details
   */
  static async createVendorEarning(
    vendorId: string,
    orderId: string,
    totalAmount: number
  ): Promise<ICommission> {
    let percentage = 10; // default platform commission is 10%
    try {
      const vendor = await Vendor.findById(vendorId);
      if (vendor) {
        percentage = vendor.commissionPercentage;
      }
    } catch (err) {
      // If vendor lookup fails, proceed with default commission percentage
    }

    const commissionAmount = this.calculateCommission(totalAmount, percentage);

    const commission = await Commission.create({
      vendorId,
      orderId,
      percentage,
      amount: commissionAmount,
      status: 'PENDING'
    });

    return commission;
  }

  /**
   * Computes vendor dashboard metrics
   */
  static async getVendorDashboard(vendorId: string) {
    const store = await Store.findOne({ vendorId });
    const totalProducts = store ? store.totalProducts : 0;
    const rating = store ? store.rating : 0;

    // Aggregate commission database to find sales, revenue, and earnings
    const stats = await Commission.aggregate([
      { $match: { vendorId } },
      {
        $group: {
          _id: null,
          totalSalesCount: { $sum: 1 },
          totalCommissionAmount: { $sum: '$amount' },
          // Reconstruct original sales revenue based on amount & percentage
          totalRevenue: {
            $sum: {
              $cond: [
                { $gt: ['$percentage', 0] },
                { $divide: [{ $multiply: ['$amount', 100] }, '$percentage'] },
                '$amount' // fallback if percentage is somehow 0
              ]
            }
          }
        }
      }
    ]);

    const totalSales = stats[0]?.totalSalesCount || 0;
    const revenue = parseFloat((stats[0]?.totalRevenue || 0).toFixed(2));
    const commissionPaid = stats[0]?.totalCommissionAmount || 0;
    const earnings = parseFloat((revenue - commissionPaid).toFixed(2));

    return {
      totalSales,
      totalProducts,
      totalOrders: totalSales, // each record represents an order portion
      revenue,
      reviews: rating, // store rating serves as average rating
      earnings
    };
  }
}
