import mongoose, { Schema, Document } from "mongoose"

export type UserRole = "regular" | "admin"

export interface IUser extends Document {
    email: string,
    password: string,
    name: string,
    confirmed: boolean,
    role: UserRole,
}

const UserSchema: Schema = new Schema({
    
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["regular", "admin"] as UserRole[],
        default: "regular"
    }
}, {timestamps: true})

const User = mongoose.model<IUser>("User", UserSchema)
export default User