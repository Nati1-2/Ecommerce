export interface CommissionBreakdown {
  grossAmount: number;
  platformFeeRatePercent: number;
  platformFeeAmount: number;
  vendorNetEarnings: number;
}

const DEFAULT_COMMISSION_RATE = 8.5; // 8.5% platform commission cut

export const commissionEngine = {
  calculateEarnings: (grossAmount: number, customFeeRate?: number): CommissionBreakdown => {
    const feeRate = customFeeRate !== undefined ? customFeeRate : DEFAULT_COMMISSION_RATE;
    const platformFeeAmount = Number(((grossAmount * feeRate) / 100).toFixed(2));
    const vendorNetEarnings = Number((grossAmount - platformFeeAmount).toFixed(2));

    return {
      grossAmount,
      platformFeeRatePercent: feeRate,
      platformFeeAmount,
      vendorNetEarnings,
    };
  },
};
