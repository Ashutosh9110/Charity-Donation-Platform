const { users } = require("../dbModels/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const signUp = async (req, res) => {
  
  try {
    const { name, email, password } = req.body
    const existingUser = await users.findOne({ where: {email}})
      if(existingUser){
        return res.status(409).json({ msg : `User with email ${email} already exists`})
      }

      bcrypt.hash(password, 10, async(err, hash) => {
      const newUser = await users.create({ name, email, password:hash})
        return res.status(201).json({ msg : `User with name ${email} is signed up`})
      })

  } catch (error) {
    res.status(500).json({ msg : "Unable to add user"})    
  }
}


const signIn = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await users.findOne({ where: { email }})
    if(!user) {
      return res.status(404).json({ msg : `User with email ${email} doesn't exits`})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid) {
      return res.status(409).json({ msg : `Incorrect Password`})
    }
    const token =  jwt.sign({userId : user.id}, process.env.SECRET_KEY, { expiresIn: "1h"})
      return res.json({ msg : `User logged in`, token})
  } catch (error) {
    res.status(500).json({ msg : "Unable to signin the user"})
  }
}


const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Comes from JWT middleware
    const user = await users.findByPk(userId, { attributes: { exclude: ['password'] } });
    console.log("Decoded user from token:", req.user);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, address } = req.body;
    await users.update({ name, phone, address }, { where: { id: userId } });
    res.json({ msg: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to update profile" });
  }
};



module.exports = {
  signUp, signIn, getProfile, updateProfile
};


module.exports = { 
  signIn,
  signUp,
  getProfile,
  updateProfile
} 