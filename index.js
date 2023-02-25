const express = require("express") ;
const cors = require("cors") ;
const  mongoose  = require("mongoose");
const jwt =require("jsonwebtoken");
const MAIN_KEY ="mock-api"

const app = express() ;
app.use(express.json());
app.use(cors());
 
const userRouter = require("./fearures/user/user.router");



app.use("/user",userRouter);

app.get("/", async(req, res)=>{
    try{
        res.send("Mock API");
     }
   catch(err){
       res.status(500).send(err.message);
   }
})
app.get("/github",(req,res)=>{
    console.log(req.query.code) ;
    res.send("You are successfully signed in with Github.")
})
// this is callback route, i.e., after signing in which page it directs to, that is the above callback route and this we need to give in github only

app.listen("8080",  async()=>{
    await mongoose.connect("mongodb+srv://bishalsharmaece:jBzQjxG7uCS010qL@cluster0.hxvferc.mongodb.net/test")
   console.log(`Listening on http://localhost:8080`);
})


function verifyToken(req,res,next) {
    let token = req.headers[`authorization`];
    if(token){
        token = token.split(" ")[1] ;
        console.log(token);
        jwt.verify(token, MAIN_KEY ,(err, valid) => {
            if(err){
                res.send( {result: "Please provide valid token"})
            }
            else{
                next()
            }
        })
    
        
    }
    else{
        res.send({ result:" Please add token with header"})
    }
}