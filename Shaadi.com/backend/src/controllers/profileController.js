const Profile = require('../models/Profile');

// In-memory demo profiles
const demoProfiles = [
  { _id: 'prof-1', userId: 'demo-user-1', name: 'Arjun Mehta', age: 30, gender: 'Man', city: 'Mumbai', profession: 'Software Engineer', education: 'B.Tech', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80', isVerified: true, membership: 'Free', profileViews: 128, interestsReceived: 24, about: 'I believe meaningful relationships are built through trust, respect and genuine communication.', partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.', maritalStatus: 'Never Married' },
  { _id: 'prof-2', userId: 'user-2', name: 'Ananya Sharma', age: 26, gender: 'Woman', city: 'Kolkata', profession: 'Software Engineer', education: 'M.Tech', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80', isVerified: true, membership: 'Milan Plus', profileViews: 89, interestsReceived: 12, about: 'I believe meaningful relationships are built through trust, respect and genuine communication.', partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.', maritalStatus: 'Never Married' },
  { _id: 'prof-3', userId: 'user-3', name: 'Ishita Sen', age: 27, gender: 'Woman', city: 'Bengaluru', profession: 'Data Scientist', education: 'M.Sc', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80', isVerified: true, membership: 'Free', profileViews: 156, interestsReceived: 8, about: 'I believe meaningful relationships are built through trust, respect and genuine communication.', partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.', maritalStatus: 'Never Married' },
  { _id: 'prof-4', userId: 'user-4', name: 'Meera Kapoor', age: 25, gender: 'Woman', city: 'Delhi', profession: 'Architect', education: 'B.Arch', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=80', isVerified: false, membership: 'Free', profileViews: 45, interestsReceived: 3, about: 'I believe meaningful relationships are built through trust, respect and genuine communication.', partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.', maritalStatus: 'Never Married' },
  { _id: 'prof-5', userId: 'user-5', name: 'Riya Mukherjee', age: 28, gender: 'Woman', city: 'Mumbai', profession: 'Doctor', education: 'MBBS', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80', isVerified: true, membership: 'Milan Premium', profileViews: 210, interestsReceived: 31, about: 'I believe meaningful relationships are built through trust, respect and genuine communication.', partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.', maritalStatus: 'Never Married' },
  { _id: 'prof-6', userId: 'user-6', name: 'Sneha Roy', age: 26, gender: 'Woman', city: 'Pune', profession: 'Research Scholar', education: 'Ph.D.', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=700&q=80', isVerified: false, membership: 'Free', profileViews: 67, interestsReceived: 5, about: 'I believe meaningful relationships are built through trust, respect and genuine communication.', partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.', maritalStatus: 'Never Married' },
  { _id: 'prof-7', userId: 'user-7', name: 'Priya Das', age: 29, gender: 'Woman', city: 'Hyderabad', profession: 'Product Manager', education: 'MBA', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80', isVerified: true, membership: 'Milan Plus', profileViews: 134, interestsReceived: 18, about: 'I believe meaningful relationships are built through trust, respect and genuine communication.', partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.', maritalStatus: 'Never Married' },
  { _id: 'prof-8', userId: 'user-8', name: 'Rahul Verma', age: 28, gender: 'Man', city: 'Delhi', profession: 'Business Analyst', education: 'MBA', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80', isVerified: false, membership: 'Free', profileViews: 34, interestsReceived: 2, about: 'I believe meaningful relationships are built through trust, respect and genuine communication.', partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.', maritalStatus: 'Never Married' },
  { _id: 'prof-9', userId: 'user-9', name: 'Vikram Singh', age: 32, gender: 'Man', city: 'Bengaluru', profession: 'Product Manager', education: 'M.Tech', religion: 'Sikh', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=700&q=80', isVerified: true, membership: 'Milan Premium', profileViews: 92, interestsReceived: 7, about: 'I believe meaningful relationships are built through trust, respect and genuine communication.', partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.', maritalStatus: 'Never Married' },
  { _id: 'prof-10', userId: 'user-10', name: 'Amit Patel', age: 27, gender: 'Man', city: 'Ahmedabad', profession: 'Doctor', education: 'MBBS', religion: 'Hindu', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80', isVerified: true, membership: 'Milan Plus', profileViews: 78, interestsReceived: 11, about: 'I believe meaningful relationships are built through trust, respect and genuine communication.', partnerPreference: 'I am looking for someone kind, emotionally mature and respectful.', maritalStatus: 'Never Married' },
];

// Get all profiles with optional filters
exports.getAllProfiles = async (req, res) => {
  try {
    const { gender, minAge, maxAge, religion, city, search } = req.query;

    if (!req.isMongoConnected) {
      let filtered = [...demoProfiles];

      if (gender) filtered = filtered.filter(p => p.gender === gender);
      if (religion) filtered = filtered.filter(p => p.religion === religion);
      if (city) filtered = filtered.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
      if (minAge) filtered = filtered.filter(p => p.age >= parseInt(minAge));
      if (maxAge) filtered = filtered.filter(p => p.age <= parseInt(maxAge));
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(s) ||
          p.city.toLowerCase().includes(s) ||
          p.profession.toLowerCase().includes(s)
        );
      }

      return res.json({ profiles: filtered, total: filtered.length });
    }

    const filter = {};
    if (gender) filter.gender = gender;
    if (religion) filter.religion = religion;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      if (maxAge) filter.age.$lte = parseInt(maxAge);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { profession: { $regex: search, $options: 'i' } },
      ];
    }

    const profiles = await Profile.find(filter).sort({ createdAt: -1 });
    res.json({ profiles, total: profiles.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
};

// Get single profile
exports.getProfile = async (req, res) => {
  try {
    if (!req.isMongoConnected) {
      const profile = demoProfiles.find(p => p._id === req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      profile.profileViews += 1;
      return res.json({ profile });
    }

    const profile = await Profile.findById(req.params.id).populate('userId', 'name email');
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.profileViews += 1;
    await profile.save();

    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Create or update profile
exports.createOrUpdateProfile = async (req, res) => {
  try {
    const { name, age, gender, city, profession, education, religion, maritalStatus, about, partnerPreference, image } = req.body;

    if (!name || !age || !gender || !city || !profession || !education || !religion) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    if (!req.isMongoConnected) {
      return res.status(400).json({ error: 'Profile creation requires MongoDB connection' });
    }

    let profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      profile = await Profile.create({
        userId: req.userId,
        name,
        age,
        gender,
        city,
        profession,
        education,
        religion,
        maritalStatus,
        about,
        partnerPreference,
        image,
      });
    } else {
      Object.assign(profile, { name, age, gender, city, profession, education, religion, maritalStatus, about, partnerPreference, image });
      await profile.save();
    }

    res.status(201).json({ profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile' });
  }
};
