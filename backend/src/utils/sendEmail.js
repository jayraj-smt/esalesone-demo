// import nodemailer from 'nodemailer'
// import dotenv from 'dotenv'

// dotenv.config()

// const transporter = nodemailer.createTransport({
//   host: 'smtp.mailtrap.io',
//   port: 587,
//   auth: {
//     user: process.env.MAILTRAP_USER,
//     pass: process.env.MAILTRAP_PASS,
//   },
// })

// export const sendEmail = async ({ to, subject, html }) =>
//   transporter.sendMail({
//     from: '"eCommerce Store" <noreply@ecommerce.com>',
//     to,
//     subject,
//     html,
//   })

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
    const {
      email,
      orderNumber,
      name,
      productId,
      variantSelected,
      quantity,
      total,
    } = order
    console.log('Preparing to send approved email for order:', order)
    const mailOptions = {
      from: '"Shoe Store" <no-reply@ecommerce.com>',
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      // html: `<h3>Hi ${name},</h3>
      //   <p>Your order <strong>${orderNumber}</strong> was approved successfully!</p>
      //   <p>Product: ${productId}</p>
      //   <p>Variant: ${variantSelected}</p>
      //   <p>Quantity: ${quantity}</p>
      //   <p>Total Paid: Rs.${total}</p>
      //   <p>Thank you for shopping with us!</p>`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2E86C1;">✅ Thank you for your order, ${name}!</h2>
          <p style="font-size: 16px;">We're happy to let you know that your order <strong>#${orderNumber}</strong> has been <strong>successfully confirmed</strong>.</p>

          <hr style="margin: 20px 0;" />

          <h3 style="color: #555;">🛒 Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr>
              <td><strong>Variant:</strong></td>
              <td>${variantSelected}</td>
            </tr>
            <tr>
              <td><strong>Quantity:</strong></td>
              <td>${quantity}</td>
            </tr>
            <tr>
              <td><strong>Total Paid:</strong></td>
              <td>Rs. ${total}</td>
            </tr>
          </table>

          <hr style="margin: 20px 0;" />

          <p style="font-size: 16px;">🧾 We’ll notify you once your order ships. For any queries, feel free to reply to this email.</p>

          <p style="font-size: 14px; color: #888;">Shoe Store<br/>no-reply@ecommerce.com</p>
        </div>
      `,
    }

    console.log('Sending approved email to:', mailOptions)

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
      // html: `<h3>Hi ${name},</h3>
      //   <p>Unfortunately, your order <strong>${orderNumber}</strong> could not be processed.</p>
      //   <p>Please try again or contact support.</p>`,
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
  } catch (error) {
    console.error('Error sending failed email:', error)
    throw new Error('Failed to send failed email')
  }
}
