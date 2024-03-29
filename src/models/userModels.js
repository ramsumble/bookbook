const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// explaination for schemas: 
// bookCollection will store all of the users read books 
// Favourites is for the collection that users want their fav books to be in
// reading collection is the books the user is currently reading 
//
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bookCollection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    readingCollection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10); // adding salting to the passwords
    this.password = await bcrypt.hash(this.password, salt); 
    next();
});

// comparing password with the hashed pw
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;