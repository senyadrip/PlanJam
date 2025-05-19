import connectDB from "./config/db";
import dotenv from 'dotenv';
import app from "./app";

import "./models/User";
import "./models/Jam";


dotenv.config();

connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
