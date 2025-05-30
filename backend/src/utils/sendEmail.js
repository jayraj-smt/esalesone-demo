import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
})

export const sendApprovedEmail = async (order) => {
  try {
    const { email, orderNumber, name, total, cartItems } = order
    const itemsHtml = cartItems
      .map((item) => {
        return `
          <tr>
            <td>${item?.product?.title || 'Unknown Product'}</td>
            <td>${item?.variantSelected}</td>
            <td>${item?.quantity}</td>
            <td>Rs. ${(item.quantity * item.price).toFixed(2)}</td>
          </tr>
        `
      })
      .join('')
    const mailOptions = {
      from: '"Shoe Store" <no-reply@ecommerce.com>',
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2E86C1;">✅ Thank you for your order, ${name}!</h2>
          <p style="font-size: 16px;">Your order <strong>#${orderNumber}</strong> has been <strong>confirmed</strong>.</p>

          <hr style="margin: 20px 0;" />

          <h3 style="color: #555;">🛒 Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px; border: 1px solid #ccc;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th align="left" style="padding: 8px;">Product</th>
                <th align="left" style="padding: 8px;">Variant</th>
                <th align="left" style="padding: 8px;">Qty</th>
                <th align="left" style="padding: 8px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <p style="font-size: 16px; margin-top: 20px;"><strong>Total Paid:</strong> Rs. ${total}</p>

          <p style="font-size: 16px;">🧾 We’ll notify you once your order ships.</p>

          <p style="font-size: 14px; color: #888;">Shoe Store<br/>no-reply@ecommerce.com</p>
        </div>
      `,
    }

    const sent = await transporter.sendMail(mailOptions)
    console.log('Approved email sent successfully:', sent)
  } catch (error) {
    console.error('Error sending approved email:', error)
    throw new Error('Failed to send approved email')
  }
}

export const sendFailedEmail = async (order) => {
  try {
    const { email, orderNumber, name } = order
    const mailOptions = {
      from: '"Shoe Store" <no-reply@ecommerce.com>',
      to: email,
      subject: `Order Failed - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f5c6cb; padding: 20px; border-radius: 10px; background-color: #f8d7da;">
          <h3>Hi ${name},</h3>
          <h2 style="color: #721c24;">❌ Payment Failed</h2>
          <p style="font-size: 16px;">We're sorry — your order <strong>#${orderNumber}</strong> could not be processed.</p>

          <p style="font-size: 15px;">This might be due to a payment gateway issue or card decline.</p>

          <p style="font-size: 15px;">🔁 <strong>Please try placing your order again.</strong></p>

          <p style="font-size: 15px;">Need help? Contact us at <a href="mailto:support@example.com" style="color: #721c24;">support@example.com</a></p>

          <p style="font-size: 14px; color: #555;">Thank you for your interest!</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Failed email sent successfully')
  } catch (error) {
    console.error('Error sending failed email:', error)
    throw new Error('Failed to send email')
  }
}
