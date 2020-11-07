import { Schema } from 'mongoose'

const { Types } = Schema

const boardSchema = new Schema({
  name: Types.String,
  owner: {
    type: Types.ObjectId,
    ref: 'user',
    index: true
  },
  members: [{ type: Types.ObjectId, ref: 'user' }]
})

export default boardSchema
