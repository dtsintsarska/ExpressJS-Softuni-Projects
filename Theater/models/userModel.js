const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    likedPlays: [{
        type: 'ObjectId',
        ref: 'Play',
    }],
})

UserSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                next(err);
                return
            }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    next(err);
                    return
                }
                this.password = hash;
                next();
            })
        });
        return;
    }
    next();
})

module.exports = mongoose.model('User', UserSchema);