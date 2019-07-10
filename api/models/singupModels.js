import mongoose from 'mongoose'

const Schema = mongoose.Schema
const DownloadSchema = new Schema({

  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {

    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
    required: true
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  Updated_date: {
    type: Date,
    default: Date.now
  },

})

export default DownloadSchema;