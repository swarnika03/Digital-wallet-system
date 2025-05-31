interface EmailOptions {
  to: string;
  subject: string;
  body: string;
}

// Mock email service
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // In a real app, this would use a real email service like SendGrid or AWS SES
  console.log('Sending email:', options);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};