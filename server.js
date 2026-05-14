import express from 'express';
import cors from 'cors';
import { connectDB } from './mongo/connection/index.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Server is running🚀');
})
async function startServer(){
    try {
        await connectDB();
        app.listen(5000,()=>{
            console.log('Server is running on port 5000');
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}
startServer();