// Email template for user registration/welcome
const welcomeEmailTemplate = (userName) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Milan!</h1>
    </div>
    <div class="content">
      <p>Dear ${userName},</p>
      <p>Welcome to Milan, where meaningful connections begin!</p>
      <p>Your profile has been successfully created. You're now ready to explore and connect with potential matches who share your values and life goals.</p>
      <h3>What's Next?</h3>
      <ul>
        <li>Complete your profile with more details and photos</li>
        <li>Browse through verified profiles in your area</li>
        <li>Send interests to people you're interested in</li>
        <li>Start meaningful conversations</li>
      </ul>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a></p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Happy connecting!<br>The Milan Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Milan. All rights reserved. | <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/about">About</a> | <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/privacy">Privacy</a></p>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  welcomeEmailTemplate,
};
