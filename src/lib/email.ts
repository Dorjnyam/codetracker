import nodemailer from 'nodemailer';

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, url: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your CodeTracker account',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">CodeTracker</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Verify Your Account</p>
        </div>
        
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to CodeTracker!</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Thank you for signing up! To complete your registration and start your coding journey, 
            please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold;
                      font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, you can also copy and paste this link into your browser:
          </p>
          <p style="color: #667eea; font-size: 14px; word-break: break-all;">
            ${url}
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This verification link will expire in 24 hours. If you didn't create an account, 
            you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function sendPasswordResetEmail(email: string, url: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your CodeTracker password',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">CodeTracker</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Password Reset</p>
        </div>
        
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            We received a request to reset your password for your CodeTracker account. 
            Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold;
                      font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            If the button doesn't work, you can also copy and paste this link into your browser:
          </p>
          <p style="color: #667eea; font-size: 14px; word-break: break-all;">
            ${url}
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This password reset link will expire in 1 hour. If you didn't request a password reset, 
            you can safely ignore this email and your password will remain unchanged.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to CodeTracker! 🎉',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to CodeTracker!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your coding journey starts now</p>
        </div>
        
        <div style="padding: 40px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}! 👋</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Welcome to CodeTracker! We're excited to have you join our community of learners and educators. 
            You're now ready to start your coding journey with personalized assignments, real-time collaboration, 
            and gamified learning experiences.
          </p>
          
          <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">🚀 What's Next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Complete your profile setup</li>
              <li>Join a class or create your own</li>
              <li>Start solving coding challenges</li>
              <li>Connect with other learners</li>
              <li>Track your progress and earn achievements</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold;
                      font-size: 16px;">
              Go to Dashboard
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Need help? Check out our <a href="${process.env.NEXTAUTH_URL}/help" style="color: #667eea;">help center</a> 
            or reach out to our support team.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email as it's not critical
  }
}
