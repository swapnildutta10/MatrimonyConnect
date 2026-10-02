const successStories = [
  {
    id: 1,
    names: 'Aarav & Nandini',
    location: 'Kolkata',
    year: 'Married in 2025',
    story: 'We initially connected over our shared love for books. What began as a simple conversation slowly became the most important friendship of our lives.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    names: 'Rohan & Kavya',
    location: 'Mumbai',
    year: 'Married in 2026',
    story: 'Our families encouraged us to speak, but Milan gave us the space to understand each other at our own pace. Three months later, we knew.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    names: 'Aditya & Isha',
    location: 'Bengaluru',
    year: 'Married in 2025',
    story: 'We lived in the same city for years and somehow never met. One match recommendation changed everything. Sometimes timing really matters.',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    names: 'Sayan & Priyanka',
    location: 'Pune',
    year: 'Engaged in 2026',
    story: 'Neither of us expected an online introduction to feel so natural. Our first conversation lasted almost four hours and the rest followed naturally.',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: '',
    popular: false,
    description: 'Begin exploring Milan.',
    features: ['Create your profile', 'Browse matches', '5 interests per day', 'Basic search filters'],
  },
  {
    name: 'Milan Plus',
    price: '₹999',
    period: '/ 3 months',
    popular: true,
    description: 'For meaningful conversations.',
    features: ['Everything in Free', 'Unlimited interests', 'Direct messaging', 'Advanced match filters', 'See profile visitors', 'Priority profile visibility'],
  },
  {
    name: 'Milan Premium',
    price: '₹1,799',
    period: '/ 6 months',
    popular: false,
    description: 'Our complete matchmaking experience.',
    features: ['Everything in Milan Plus', 'Profile verification badge', 'Premium profile boost', 'Dedicated match suggestions', 'Priority support', 'Advanced privacy controls'],
  },
];

const articles = [
  {
    id: 1,
    category: 'Relationship Advice',
    title: 'The Role of Family in Marriage',
    description: 'Marriage is not only about two individuals. Family values, traditions and mutual understanding often play an important role in building a strong relationship.',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    category: 'Find Someone Special Near You',
    title: 'Discover Meaningful Connections',
    description: 'Connect with people who share your values and life goals. A meaningful relationship begins with honest conversations and genuine understanding.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    category: 'Matrimonial Profile Guide',
    title: 'How to Create a Great Matrimonial Profile',
    description: 'A thoughtful profile helps people understand who you really are. Learn how honesty, clear intentions and positive communication can improve your profile.',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80',
  },
];

const datingTips = [
  {
    number: '01',
    title: 'Be Present',
    description: 'When meeting someone for the first time, give them your attention. Keep your phone away, listen carefully and allow the conversation to develop naturally.',
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=80',
  },
  {
    number: '02',
    title: 'Leave Your Ego Behind',
    description: 'A good conversation does not need to be perfect. Be comfortable with small mistakes, laugh naturally and treat the people around you with kindness and respect.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80',
  },
  {
    number: '03',
    title: 'Ask Good Questions',
    description: 'Good conversations happen when you ask thoughtful questions and genuinely listen to the answers. Show genuine interest in who they are and what they believe.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  },
];

// Get success stories
exports.getSuccessStories = (req, res) => {
  res.json({ stories: successStories });
};

// Get pricing plans
exports.getPricingPlans = (req, res) => {
  res.json({ plans: pricingPlans });
};

// Get articles
exports.getArticles = (req, res) => {
  res.json({ articles });
};

// Get dating tips
exports.getDatingTips = (req, res) => {
  res.json({ tips: datingTips });
};
