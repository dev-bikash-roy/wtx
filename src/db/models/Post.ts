import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  categories?: string[];
  tags?: string[];
  author: string;
  createdAt: Date;
  updatedAt: Date;
  aiSummary?: string;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    slug: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    featuredImage: { type: String },
    categories: [{ type: String }],
    tags: [{ type: String }],
    author: { type: String, required: true },
    aiSummary: { type: String },
  },
  {
    timestamps: true,
  }
);

// Ensure virtual fields are serializable to JSON
PostSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

// Check if we're connected to mongoose
const isConnected = mongoose.connections[0]?.readyState === 1;

// Only export the model if we're connected to mongoose
export default isConnected
  ? mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)
  : null;