import { connectDB } from "@/lib/mongodb";
import { TransactionLedger, LedgerTransactionType } from "@/models/TransactionLedger";
import { logger } from "@/lib/logger";

export interface RecordLedgerRequest {
  type: LedgerTransactionType;
  amount: number;
  currency?: string;
  orderId?: string;
  vendorId?: string;
}

export const ledgerService = {
  recordTransaction: async (req: RecordLedgerRequest) => {
    try {
      await connectDB();
      const transactionId = `led_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const ledgerEntry = await TransactionLedger.create({
        transactionId,
        type: req.type,
        amount: req.amount,
        currency: req.currency || "USD",
        orderId: req.orderId,
        vendorId: req.vendorId,
        status: "COMPLETED",
      });

      logger.info(`[LEDGER SERVICE] Immutable ledger entry recorded [${req.type}]`, {
        meta: { transactionId, amount: req.amount, vendorId: req.vendorId },
      });

      return ledgerEntry;
    } catch (err: any) {
      logger.error("Failed to record ledger entry", { meta: { error: err.message } });
      return null;
    }
  },

  getVendorBalance: async (vendorId: string) => {
    try {
      await connectDB();
      const entries = await TransactionLedger.find({ vendorId, status: "COMPLETED" });
      let totalEarnings = 0;
      let totalPayouts = 0;

      entries.forEach((e) => {
        if (e.type === "PAYMENT" || e.type === "COMMISSION_CUT") totalEarnings += e.amount;
        if (e.type === "VENDOR_PAYOUT") totalPayouts += e.amount;
      });

      return {
        totalEarnings: Number(totalEarnings.toFixed(2)),
        paidOut: Number(totalPayouts.toFixed(2)),
        availableBalance: Number(Math.max(0, totalEarnings - totalPayouts).toFixed(2)),
      };
    } catch {
      return { totalEarnings: 0, paidOut: 0, availableBalance: 0 };
    }
  },
};
