const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tripps: [{
        type: 'ObjectId',
        ref: 'Tripp',
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