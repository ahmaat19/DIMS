import mongoose from 'mongoose'

const groupScheme = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const GroupModel = mongoose.model('Group', groupScheme)
export default GroupModel
