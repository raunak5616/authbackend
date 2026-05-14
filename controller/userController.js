import { User } from "../mongo/model/user.model";

const router = userRouter();

export const Signup = async (req, res) => {
    const { name, email, password } = req.body;
    const hashpassword = await bcrypt.hash(password,10);
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"});
    }
    try {
        const user = await User.create({
            name,
            email,
            password:hashpassword
        });
        const token =jwt.sign({
            id:user._id,
            email:user.email},
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            },
        );
        res.status(201).json({
            success:true,
            message: "User created successfully",
        token, });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }   
};

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }       
        const token =jwt.sign({
            id:user._id,
            email:user.email},
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            },
    );
    res.status(200).json({
        success:true,
        message: "Login successful",
        token, });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }   
};