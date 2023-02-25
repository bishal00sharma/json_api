const express = require("express") ;
const User = require("./user.schema") ;
const jwt =require("jsonwebtoken");
const app = express.Router() ;
app.use(express.json()) ;
const MAIN_KEY ="mock-api"
const bcrypt = require('bcrypt');
const saltRounds = 10;


app.post("/signup", async(req,res) => {
    let hash = bcrypt.hashSync(req.body.password, saltRounds);
    const { email,password} =req.body ;
    const user=  await User.create({email:email,password:hash});
    console.log(email, password);
    res.send("User created")
})
app.patch("/:id", async (req,res)=>{
    try{
        let id = req.params.id;
        let update = await User.updateOne({"_id":id},{$set:{...req.body}});
        res.status(204).send("Details Updated Successfully!");
    }
    catch(err){
        res.status(500).send(err.message);
    }
    
})

app.get("/:id", async(req, res)=>{
    try{
        let id = req.params.id ;
        let output = await User.find({"_id":id});
        res.send(output);
   }
   catch(err){
       res.status(500).send(err.message);
   }
})


app.post("/login",async(req,res) =>{

    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
          const cmp = await bcrypt.compare(req.body.password, user.password);
          if (cmp) {
            const token = jwt.sign( 
                { id: user._id , email: user.email  } ,
                MAIN_KEY, //we have option to give expiry of token also
            );
            // const refreshtoken= jwt.sign( {id: user._id , email: user.email , age: user.age} , REFRESH_KEY ,{ expiresIn :REFRESH_EXP}) ;
            // we are generating the refresh token here
            res.send({"user":user, "token" :token});    
          } else {
            res.send("Wrong username or password.");
          }
        } else {
          res.send("Wrong username or password.");
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server error Occured");
      }

}) 

module.exports =app; 