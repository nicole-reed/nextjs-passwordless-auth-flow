import { Schema, model, models } from 'mongoose'


const UserSchema = new Schema({
    email: { type: String, required: true },
    loginCode: { type: String },
    loginCodeCreatedAt: { type: Date },
    loginCodeAttempts: { type: Number }
})


export const User = models.User || model('User', UserSchema)

