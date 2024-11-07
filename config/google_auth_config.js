var GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const {userModel} = require("../models/user")

require("dotenv").config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
        try{
            let user = await userModel.findOne({email:profile.emails[0].value})
            if(!user){
                user = new userModel({
                    name : profile.displayName,
                    email : profile.emails[0].value
                })
                await user.save();
            }
            cb(null, user)
        }catch(err){
            cb(err, false)
        }
    }
  )
);

// jab ek baar login krte h, toh backend mei har route pr login krne ke liye express-session save krenge 
passport.serializeUser((user, cb) => {
    return cb(null, user._id);
});

passport.deserializeUser(async (id, cb)=>{
    const user = await userModel.findOne({_id : id})
    cb(null, user);
});

module.exports = passport
