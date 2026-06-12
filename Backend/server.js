require("dotenv").config()
const app=require("./src/app")
const connectDB=require("./src/config/db")
connectDB()
app.listen(3000,()=>{
    console.log("server is listening on port 30000");
    
})