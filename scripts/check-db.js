const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    }
};

const checkCounts = async () => {
    await connectDB();
    
    // We need to define models or access collections directly
    const db = mongoose.connection.db;
    
    const users = await db.collection('users').countDocuments();
    const conversations = await db.collection('conversations').countDocuments();
    const messages = await db.collection('messages').countDocuments();
    
    console.log('\n📊 Database Stats:');
    console.log(`👤 Users: ${users}`);
    console.log(`💬 Conversations: ${conversations}`);
    console.log(`✉️ Messages: ${messages}`);
    
    // Check specific conversations if any
    if (conversations > 0) {
        const convs = await db.collection('conversations').find().limit(5).toArray();
        console.log('\nRecent Conversations:');
        console.log(JSON.stringify(convs, null, 2));
    } else {
        console.log('\n⚠️ No conversations found. The frontend should show an empty state.');
    }

    process.exit(0);
};

checkCounts();
