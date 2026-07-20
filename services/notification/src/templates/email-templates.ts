/**
 * Simple HTML email templates.
 * Each function returns a complete HTML string ready for nodemailer.
 */

export const welcomeEmailTemplate = (email: string): { subject: string; html: string } => ({
  subject: 'Welcome to Our E-Commerce Platform!',
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
    </head>
    <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
      <div style="max-width:600px; margin:0 auto; padding:20px;">
        <div style="background-color:#ffffff; border-radius:8px; padding:40px; text-align:center;">
          <h1 style="color:#333333; margin-bottom:20px;">Welcome! 🎉</h1>
          <p style="color:#666666; font-size:16px; line-height:1.6;">
            Thank you for joining our e-commerce platform. We're excited to have you on board!
          </p>
          <p style="color:#666666; font-size:14px;">
            Your account (<strong>${email}</strong>) has been created successfully.
          </p>
          <a href="#" style="display:inline-block; margin-top:20px; padding:12px 30px; background-color:#4CAF50; color:#ffffff; text-decoration:none; border-radius:5px; font-size:16px;">
            Start Shopping
          </a>
          <p style="color:#999999; font-size:12px; margin-top:30px;">
            If you did not create this account, please contact our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
});

export const orderConfirmationTemplate = (
  orderId: string,
  totalAmount: number,
  items: Array<{ productId: string; quantity: number; price: number }>
): { subject: string; html: string } => ({
  subject: `Order Confirmation - #${orderId}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
      <div style="max-width:600px; margin:0 auto; padding:20px;">
        <div style="background-color:#ffffff; border-radius:8px; padding:40px;">
          <h1 style="color:#333333; margin-bottom:10px;">Order Confirmed! ✅</h1>
          <p style="color:#666666; font-size:16px;">
            Your order <strong>#${orderId}</strong> has been placed successfully.
          </p>
          <hr style="border:none; border-top:1px solid #eeeeee; margin:20px 0;">
          <h3 style="color:#333333;">Order Details</h3>
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr style="background-color:#f8f8f8;">
                <th style="text-align:left; padding:10px; border-bottom:1px solid #eee;">Product</th>
                <th style="text-align:center; padding:10px; border-bottom:1px solid #eee;">Qty</th>
                <th style="text-align:right; padding:10px; border-bottom:1px solid #eee;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td style="padding:10px; border-bottom:1px solid #eee;">${item.productId}</td>
                  <td style="text-align:center; padding:10px; border-bottom:1px solid #eee;">${item.quantity}</td>
                  <td style="text-align:right; padding:10px; border-bottom:1px solid #eee;">$${item.price.toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <div style="text-align:right; margin-top:15px; font-size:18px; color:#333;">
            <strong>Total: $${totalAmount.toFixed(2)}</strong>
          </div>
          <p style="color:#999999; font-size:12px; margin-top:30px;">
            You will receive another email when your order ships.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
});

export const paymentSuccessTemplate = (
  orderId: string,
  amount: number,
  paymentIntentId: string
): { subject: string; html: string } => ({
  subject: `Payment Received - Order #${orderId}`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Success</title>
    </head>
    <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
      <div style="max-width:600px; margin:0 auto; padding:20px;">
        <div style="background-color:#ffffff; border-radius:8px; padding:40px; text-align:center;">
          <h1 style="color:#333333; margin-bottom:10px;">Payment Successful! 💳</h1>
          <p style="color:#666666; font-size:16px; line-height:1.6;">
            We've received your payment for order <strong>#${orderId}</strong>.
          </p>
          <div style="background-color:#f0f9f0; border-radius:5px; padding:20px; margin:20px 0;">
            <p style="margin:5px 0; color:#333;"><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            <p style="margin:5px 0; color:#333;"><strong>Transaction ID:</strong> ${paymentIntentId}</p>
          </div>
          <p style="color:#999999; font-size:12px; margin-top:30px;">
            Your order is now being processed and will ship soon.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
});

export const orderShippedTemplate = (
  orderId: string
): { subject: string; html: string } => ({
  subject: `Your Order #${orderId} Has Shipped! 🚚`,
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Shipped</title>
    </head>
    <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
      <div style="max-width:600px; margin:0 auto; padding:20px;">
        <div style="background-color:#ffffff; border-radius:8px; padding:40px; text-align:center;">
          <h1 style="color:#333333; margin-bottom:10px;">Your Order Has Shipped! 🚚</h1>
          <p style="color:#666666; font-size:16px; line-height:1.6;">
            Great news! Your order <strong>#${orderId}</strong> is on its way.
          </p>
          <div style="background-color:#e8f4fd; border-radius:5px; padding:20px; margin:20px 0;">
            <p style="margin:5px 0; color:#333;"><strong>Order ID:</strong> #${orderId}</p>
            <p style="margin:5px 0; color:#333;"><strong>Status:</strong> Shipped</p>
          </div>
          <p style="color:#999999; font-size:12px; margin-top:30px;">
            You'll receive a notification when your order is delivered.
          </p>
        </div>
      </div>
    </body>
    </html>
  `,
});
