import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log('MongoDb Connected',connectionInstance.connection.host, connectionInstance.connection.port);
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }


}
export default connectDB;