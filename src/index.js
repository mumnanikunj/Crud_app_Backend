import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';


dotenv.config({
    path: "./env"
});

connectDB().
then((res)=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server at http://localhost:${process.env.PORT || 8000}` );
    })
}).catch((err)=>{
    console.log('MONGODB CONNECTION ERROR', err);
})