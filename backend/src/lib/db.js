import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn =await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected successfully ${conn.connection.host}`);
        console.log("Connected DB:", mongoose.connection.name);
console.log("Connected host:", mongoose.connection.host);

    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}
export {connectDB}