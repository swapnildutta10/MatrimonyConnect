// SMS/Text notification templates for quick alerts
const smsTemplates = {
  // Welcome message
  welcome: (userName) =>
    `Welcome to Milan, ${userName}! Create your profile and find meaningful connections. Start here: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`,

  // New match notification
  newMatch: (matchName) =>
    `Great news! ${matchName} has viewed your profile on Milan. Check them out now!`,

  // Interest received
  interestReceived: (senderName) =>
    `${senderName} has shown interest in you on Milan! View their profile and connect.`,

  // Message notification
  newMessage: (senderName) =>
    `${senderName} sent you a message on Milan. Open the app to chat!`,

  // Password reset
  passwordReset: (resetLink) =>
    `Reset your Milan password here: ${resetLink} (Link expires in 1 hour)`,

  // Profile verification
  profileVerification: () =>
    `Your Milan profile has been verified! You now have the verification badge. ✓`,

  // Membership upgrade
  membershipUpgrade: (planName) =>
    `Welcome to ${planName}! You now have unlimited messaging and advanced filters on Milan.`,

  // Special offer
  specialOffer: () =>
    `Special offer: Get Milan Plus for 30% off this week! Unlock unlimited connections and messaging.`,
};

module.exports = smsTemplates;
