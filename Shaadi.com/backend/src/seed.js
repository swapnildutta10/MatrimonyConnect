const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/milan';

const seedProfiles = [
  { name: 'Ananya Sharma', age: 26, gender: 'Woman', city: 'Kolkata', profession: 'Software Engineer', education: 'M.Tech', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80', isVerified: true },
  { name: 'Ishita Sen', age: 27, gender: 'Woman', city: 'Bengaluru', profession: 'Data Scientist', education: 'M.Sc', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80', isVerified: true },
  { name: 'Meera Kapoor', age: 25, gender: 'Woman', city: 'Delhi', profession: 'Architect', education: 'B.Arch', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=80', isVerified: false },
  { name: 'Riya Mukherjee', age: 28, gender: 'Woman', city: 'Mumbai', profession: 'Doctor', education: 'MBBS', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80', isVerified: true },
  { name: 'Sneha Roy', age: 26, gender: 'Woman', city: 'Pune', profession: 'Research Scholar', education: 'Ph.D.', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=700&q=80', isVerified: false },
  { name: 'Priya Das', age: 29, gender: 'Woman', city: 'Hyderabad', profession: 'Product Manager', education: 'MBA', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80', isVerified: true },
  { name: 'Arjun Mehta', age: 30, gender: 'Man', city: 'Mumbai', profession: 'Software Engineer', education: 'B.Tech', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80', isVerified: true },
  { name: 'Rahul Verma', age: 28, gender: 'Man', city: 'Delhi', profession: 'Business Analyst', education: 'MBA', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80', isVerified: false },
  { name: 'Vikram Singh', age: 32, gender: 'Man', city: 'Bengaluru', profession: 'Product Manager', education: 'M.Tech', religion: 'Sikh', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=700&q=80', isVerified: true },
  { name: 'Amit Patel', age: 27, gender: 'Man', city: 'Ahmedabad', profession: 'Doctor', education: 'MBBS', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80', isVerified: true },
];

function emailForProfile(name) {
  return `${name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '')}@milan.com`;
}

async function getOrCreateUser(profileData, demoUser) {
  if (profileData.name === 'Arjun Mehta') return demoUser;

  const email = emailForProfile(profileData.name);
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: profileData.name,
      email,
      password: 'password123',
    });
  }
  return user;
}

async function seedConversation(participants, messages) {
  let conversation = await Conversation.findOne({
    participants: { $all: participants, $size: participants.length },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants });
  }

  // Preserve real chats when the seed command is run again.
  if (await Message.exists({ conversationId: conversation._id })) return;

  const documents = messages.map((message, index) => ({
    conversationId: conversation._id,
    senderId: message.senderId,
    text: message.text,
    read: message.read,
    createdAt: new Date(Date.now() - (messages.length - index) * 60 * 1000),
    updatedAt: new Date(Date.now() - (messages.length - index) * 60 * 1000),
  }));
  await Message.insertMany(documents);

  const latest = documents[documents.length - 1];
  conversation.lastMessage = latest.text;
  conversation.lastMessageTime = latest.createdAt;
  conversation.lastMessageSender = latest.senderId;
  await conversation.save();
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Profile.deleteMany({});
    console.log('Cleared existing profiles');

    // Create a demo user if not exists
    let demoUser = await User.findOne({ email: 'arjun@milan.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Arjun Mehta',
        email: 'arjun@milan.com',
        password: 'password123',
        mobile: '+91 98765 43210',
      });
      console.log('Created demo user: arjun@milan.com / password123');
    }

    const usersByName = new Map([['Arjun Mehta', demoUser]]);

    // Every profile has a real User document, so it can be selected as a chat recipient.
    for (const profileData of seedProfiles) {
      const user = await getOrCreateUser(profileData, demoUser);
      usersByName.set(profileData.name, user);
      await Profile.create({
        ...profileData,
        userId: user._id,
        about: 'I believe meaningful relationships are built through trust, respect and genuine communication.',
        partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.',
        maritalStatus: 'Never Married',
      });
      console.log(`Created profile: ${profileData.name}`);
    }

    await seedConversation([demoUser._id, usersByName.get('Ananya Sharma')._id], [
      { senderId: usersByName.get('Ananya Sharma')._id, text: 'Hi Arjun! How are you doing?', read: true },
      { senderId: demoUser._id, text: "Hi! I am doing well. How about you?", read: true },
      { senderId: usersByName.get('Ananya Sharma')._id, text: 'That sounds wonderful!', read: false },
    ]);
    await seedConversation([demoUser._id, usersByName.get('Ishita Sen')._id], [
      { senderId: usersByName.get('Ishita Sen')._id, text: 'Hey Arjun! I saw your profile.', read: true },
      { senderId: demoUser._id, text: 'Hi Ishita! Nice to meet you.', read: true },
      { senderId: usersByName.get('Ishita Sen')._id, text: 'I enjoy travelling too.', read: false },
    ]);
    await seedConversation([demoUser._id, usersByName.get('Meera Kapoor')._id], [
      { senderId: usersByName.get('Meera Kapoor')._id, text: 'It was lovely talking to you!', read: true },
      { senderId: demoUser._id, text: 'Likewise Meera! Let us catch up soon.', read: true },
      { senderId: usersByName.get('Meera Kapoor')._id, text: 'Have a great evening!', read: false },
    ]);
    console.log('Created starter chat conversations and messages');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
