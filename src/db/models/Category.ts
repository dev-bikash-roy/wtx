import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  accessLevel: 'free' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    accessLevel: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free'
    }
  },
  {
    timestamps: true,
  }
);

// Ensure virtual fields are serializable to JSON
CategorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);