import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String, // emoji or icon URL
      required: true,
    },
    condition: {
      type: String,
      required: true, // Description of how to unlock
    },
    category: {
      type: String,
      enum: ['learning', 'social', 'contribution', 'milestone'],
      required: true,
    },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'legendary'],
      default: 'common',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Achievement', achievementSchema);
