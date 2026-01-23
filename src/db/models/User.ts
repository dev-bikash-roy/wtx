import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    uid: string; // Firebase Auth UID
    email: string;
    role: 'user' | 'admin';
    plan: 'free' | 'paid';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        uid: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        plan: {
            type: String,
            enum: ['free', 'paid'],
            default: 'free',
        },
    },
    {
        timestamps: true,
    }
);

// Ensure virtual fields are serializable to JSON
UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
