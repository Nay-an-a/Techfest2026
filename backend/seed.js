const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Event");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/techfest";

const seedEvents = [
  { name: 'Code Sprint: Build Beyond', category: 'Coding', fee: 450, seats: 60, date: 'Oct 12 · 9:00 AM', image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1000', description: 'A fast-paced team hackathon. Turn a bold idea into a working prototype before the clock runs out.', tag: '24-hour build' },
  { name: 'RoboWars: Arena Zero', category: 'Robotics', fee: 350, seats: 32, date: 'Oct 12 · 1:30 PM', image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=1000', description: 'Put your custom-built bot to the test in a high-energy knockout tournament.', tag: 'Live arena' },
  { name: 'Neural Nights', category: 'AI', fee: 250, seats: 45, date: 'Oct 12 · 3:00 PM', image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1000', description: 'Explore practical machine learning through hands-on challenges, demos, and mentor-led labs.', tag: 'Hands-on lab' },
  { name: 'Pixel Perfect Web Jam', category: 'Web Dev', fee: 200, seats: 50, date: 'Oct 13 · 10:00 AM', image: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=1000', description: 'Design and ship a polished, accessible web experience in this creative front-end sprint.', tag: 'Build challenge' },
  { name: 'Valorant Open', category: 'Gaming', fee: 300, seats: 24, date: 'Oct 13 · 2:00 PM', image: 'https://images.pexels.com/photos/7915437/pexels-photo-7915437.jpeg?auto=compress&cs=tinysrgb&w=1000', description: 'Form a squad, compete through the brackets, and play for the campus championship.', tag: 'Campus esports' },
  { name: 'Design Jam: Future Forms', category: 'Design', fee: 150, seats: 40, date: 'Oct 13 · 4:30 PM', image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1000', description: 'Collaborate on a fresh digital product concept and present your prototype to the jury.', tag: 'Creative sprint' },
  { name: 'Startup Pitch Lab', category: 'Innovation', fee: 100, seats: 36, date: 'Oct 14 · 11:00 AM', image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1000', description: 'Pitch a technology idea, sharpen your story, and get feedback from founders and mentors.', tag: 'Pitch session' },
  { name: 'TechFest Live: Afterglow', category: 'Live', fee: 600, seats: 100, date: 'Oct 14 · 6:30 PM', image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1000', description: 'Close out three days of ideas and invention with an unforgettable live music night.', tag: 'Festival finale' }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    
    // Clear existing events
    await Event.deleteMany({});
    console.log("Cleared old events");
    
    // Insert new events
    await Event.insertMany(seedEvents);
    console.log("Successfully seeded events");
    
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed database", err);
    process.exit(1);
  }
}

seedDB();
