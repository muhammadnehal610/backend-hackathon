import mongoose from 'mongoose';

const connectDB = async () => {
    let connected = false;
    while (!connected) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000, // Retry every 5 seconds
            });
            connected = true;
            console.log('MongoDB connected');
        } catch (error) {
            console.error('MongoDB connection failed, retrying...', error);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
    }
};

export default connectDB;
