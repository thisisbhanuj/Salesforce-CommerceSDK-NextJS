import { sendEmail } from './aws';

/**
 * Options for sending an email.
 */
type emailOptions = {
  source: string;
  destination: string[];
  message: {
    subject: string;
    body: {
      html: string;
      text?: string;
    };
  };
};

/**
 * Sends a welcome email to a user.
 * @param email - The email address of the recipient.
 * @param firstName - The first name of the recipient.
 * @returns A promise that resolves when the email is sent successfully.
 */
export async function sendWelcomeEmail(email: string, firstName: string) {
  const params: emailOptions = {
    source: process.env.AWS_SANDBOX_SES_SOURCE_EMAIL!,
    destination: [process.env.AWS_SANDBOX_SES_TO_EMAIL!],
    message: {
      subject: 'Welcome to our community 🎉',
      body: {
        html: `<p>Hi ${firstName},</p>
                <p>Thank you for joining our community. We are excited to have you on board</p>
                <p>Best,</p>
                <p>Team</p>`,
      },
    },
  };
  try {
    return await sendEmail(params);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Sends a password reset email to a user.
 * @param email - The email address of the recipient.
 * @param token - The password reset token.
 * @returns A promise that resolves when the email is sent successfully.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const params: emailOptions = {
    source: process.env.AWS_SANDBOX_SES_SOURCE_EMAIL!,
    destination: [process.env.AWS_SANDBOX_SES_TO_EMAIL!],
    message: {
      subject: 'Reset Password',
      body: {
        html: `<p>Click <a href="${process.env.NEXT_PUBLIC_URL_PROD}/reset?token=${token}">here</a> to reset your password.</p>`,
      },
    },
  };

  try {
    const response = await sendEmail(params);
    return response;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Sends an order confirmation email to a user.
 * @param order - The order details.
 * @returns A promise that resolves when the email is sent successfully.
 */
export async function orderConfirmationEmail(order: {
  id: string;
  email: string;
  firstName: string;
  total: number;
  items: {
    product: {
      name: string;
    };
    quantity: number;
  }[];
}) {
  const params: emailOptions = {
    source: process.env.AWS_SANDBOX_SES_SOURCE_EMAIL!,
    destination: [process.env.AWS_SANDBOX_SES_TO_EMAIL!],
    message: {
      subject: `Order Confirmation -  ${order.id}`,
      body: {
        html: `<p>Hi ${order.firstName},</p>
                <p>Thank you for your order. Your order has been confirmed.</p>
                <p>Order ID: ${order.id}</p>
                <p>Order Total: ${order.total}</p>
                <p>Order Items: ${order.items.map((item: any) => `<p>${item.product.name} - ${item.quantity}</p>`)}</p>
                <p>Best,</p>
                <p>Team</p>`,
      },
    },
  };

  try {
    const response = await sendEmail(params);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function subscribeEmail(email: string) {
  const params: emailOptions = {
    source: process.env.AWS_SANDBOX_SES_SOURCE_EMAIL!,
    destination: [process.env.AWS_SANDBOX_SES_TO_EMAIL!],
    message: {
      subject: 'Newsletter Subscription',
      body: {
        html: `<p>Hi,</p>
                <p>You're now subscribed to our newsletter. Get ready for exclusive offers and updates!</p>
                \n
                <p>Best,</p>
                <p>Team</p>`,
      },
    },
  };

  try {
    const response = await sendEmail(params);
    return response;
  } catch (error) {
    console.log(error);
  }
}
