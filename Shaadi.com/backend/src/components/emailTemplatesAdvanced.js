// Additional email templates for various notifications
const passwordResetEmailTemplate = (resetLink, expiryMinutes = 60) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; }
    .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>We received a request to reset your Milan password.</p>
      <p><a href="${resetLink}" class="button">Reset Password</a></p>
      <div class="alert">
        <strong>Security Note:</strong> This link expires in ${expiryMinutes} minutes. If you didn't request this, please ignore this email.
      </div>
      <p>Or paste this link in your browser:<br><small>${resetLink}</small></p>
      <p>If you have any issues, contact our support team.</p>
      <p>Best regards,<br>The Milan Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Milan. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const matchNotificationEmailTemplate = (matchName, matchImage, matchCity) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; text-align: center; }
    .match-card { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .match-image { width: 150px; height: 150px; border-radius: 50%; margin: 0 auto; object-fit: cover; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 10px; }
    .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 You Have a Match!</h1>
    </div>
    <div class="content">
      <p>Great news! ${matchName} from ${matchCity} has viewed your profile on Milan.</p>
      <div class="match-card">
        <img src="${matchImage}" alt="${matchName}" class="match-image">
        <h3>${matchName}</h3>
        <p>${matchCity}</p>
      </div>
      <p>Don't miss this opportunity to connect!</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/matches" class="button">View Match</a>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">My Dashboard</a>
    </div>
    <div class="footer">
      <p>&copy; 2026 Milan. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

const membershipUpgradeEmailTemplate = (userName, planName, features) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; }
    .features { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .feature-item { padding: 10px 0; border-bottom: 1px solid #eee; }
    .feature-item:last-child { border-bottom: none; }
    .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to ${planName}! 🎉</h1>
    </div>
    <div class="content">
      <p>Dear ${userName},</p>
      <p>Thank you for upgrading to ${planName}! You now have access to premium features.</p>
      <div class="features">
        <h3>Your New Features:</h3>
        ${features.map(f => `<div class="feature-item">✓ ${f}</div>`).join('')}
      </div>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">Explore Your Benefits</a></p>
      <p>If you have any questions, our support team is here to help!</p>
      <p>Best regards,<br>The Milan Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Milan. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  passwordResetEmailTemplate,
  matchNotificationEmailTemplate,
  membershipUpgradeEmailTemplate,
};
