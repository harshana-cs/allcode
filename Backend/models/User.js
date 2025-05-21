const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Defines the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        match: [/\S+@\S+\.\S+/, 'is invalid'] 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
    resetToken: String,
    resetTokenExpiry: Date
}, { timestamps: true });

// Password hashing middleware 
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// // Method to compare passwords during login
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (err) {
        throw new Error('Error comparing password');
    }
};

module.exports = mongoose.model('User', userSchema);