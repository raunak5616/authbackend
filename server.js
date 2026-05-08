import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Server is running🚀');
})

app.listen(5000,()=>{
    console.log('Server is running on port 5000');
});