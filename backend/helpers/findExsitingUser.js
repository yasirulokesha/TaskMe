const userSchema = require('../models/userSchema')

exports.findUserById = async (user) => {
    let existingUser = await userSchema.findOne({ googleId: user.googleId });

    if(existingUser) {
        console.log('Existing user found:', existingUser);
        return existingUser;
    } else {
        const newUser = new userSchema(user);
        await newUser.save();
        console.log('New user created:', newUser);
        return newUser;
    }  
}