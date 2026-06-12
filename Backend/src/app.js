const express=require("express")
const cookieParser=require("cookie-parser")
const cors=require("cors")
const interviewRouter = require("./routes/interveiw.routes")

const app =express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://resume-iq-silk.vercel.app"
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
const authRouter=require("./routes/auth.routes")
app.use("/api/auth",authRouter)
app.use("/api/interview", interviewRouter)

module.exports=app