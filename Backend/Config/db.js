import mongoose from "mongoose";

const configuredb = async () => {
    // If MONGODB_URI is provided in environment variables, use it.
    // Otherwise, default to local mongodb in development or if remote Atlas fails.
    const localUri = "mongodb://127.0.0.1:27017/jobportal";
    const atlasUri = `mongodb+srv://gowthamtj0808_db_user:${process.env.DB_PASSWORD}@cluster0.vibqbu6.mongodb.net/jobportal?retryWrites=true&w=majority&appName=Cluster0`;

    const uri = process.env.MONGODB_URI || (process.env.NODE_ENV === 'production' ? atlasUri : localUri);

    try {
        console.log(`Connecting to database...`);
        const db = await mongoose.connect(uri);
        console.log("Your database is running successfully");
    } catch (err) {
        console.error("Database connection failed. Attempting fallback to local MongoDB...", err.message);
        try {
            const db = await mongoose.connect(localUri);
            console.log("Connected to local fallback database successfully");
        } catch (fallbackErr) {
            console.error("Local fallback database connection failed too:", fallbackErr.message);
        }
    }
}

export default configuredb;