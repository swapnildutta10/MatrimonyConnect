// Notification service for sending emails and SMS
const emailTemplates = require('./emailTemplates');
const smsTemplates = require('./smsTemplates');

class NotificationService {
  // Send welcome email
  static sendWelcomeEmail(userEmail, userName) {
    // In production, integrate with Nodemailer, SendGrid, or similar
    const htmlContent = emailTemplates.welcomeEmailTemplate(userName);
    console.log(`[EMAIL] Welcome email would be sent to ${userEmail}`);
    // Example: await transporter.sendMail({ to: userEmail, html: htmlContent, subject: 'Welcome to Milan!' });
    return { success: true, message: 'Welcome email queued for sending' };
  }

  // Send match notification
  static sendMatchNotification(userPhone, matchName) {
    // In production, integrate with Twilio or similar
    const smsContent = smsTemplates.newMatch(matchName);
    console.log(`[SMS] Match notification would be sent to ${userPhone}: ${smsContent}`);
    // Example: await client.messages.create({ body: smsContent, from: process.env.TWILIO_PHONE, to: userPhone });
    return { success: true, message: 'Match notification queued for sending' };
  }

  // Send interest received notification
  static sendInterestNotification(userPhone, senderName) {
    const smsContent = smsTemplates.interestReceived(senderName);
    console.log(`[SMS] Interest notification would be sent to ${userPhone}: ${smsContent}`);
    return { success: true, message: 'Interest notification queued for sending' };
  }

  // Send message notification
  static sendMessageNotification(userPhone, senderName) {
    const smsContent = smsTemplates.newMessage(senderName);
    console.log(`[SMS] Message notification would be sent to ${userPhone}: ${smsContent}`);
    return { success: true, message: 'Message notification queued for sending' };
  }

  // Send password reset email
  static sendPasswordResetEmail(userEmail, resetLink) {
    // In production, create a proper email template
    const subject = 'Reset Your Milan Password';
    const text = `Click here to reset your password: ${resetLink}`;
    console.log(`[EMAIL] Password reset email would be sent to ${userEmail}`);
    // Example: await transporter.sendMail({ to: userEmail, subject, text });
    return { success: true, message: 'Password reset email queued for sending' };
  }

  // Send profile verification email
  static sendProfileVerificationEmail(userEmail, userName) {
    const subject = 'Your Milan Profile is Verified!';
    const text = `Congratulations ${userName}! Your profile has been verified and you now have the verification badge.`;
    console.log(`[EMAIL] Verification email would be sent to ${userEmail}`);
    return { success: true, message: 'Verification email queued for sending' };
  }

  // Send membership upgrade email
  static sendMembershipUpgradeEmail(userEmail, planName) {
    const subject = `Welcome to ${planName}!`;
    const text = `You've successfully upgraded to ${planName}. Enjoy unlimited messaging and advanced features!`;
    console.log(`[EMAIL] Membership upgrade email would be sent to ${userEmail}`);
    return { success: true, message: 'Membership upgrade email queued for sending' };
  }

  // Batch send notifications
  static async sendBatch(notifications) {
    const results = [];
    for (const notification of notifications) {
      const result = await this.send(notification);
      results.push(result);
    }
    return results;
  }
}

module.exports = NotificationService;
