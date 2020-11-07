import { Schema } from 'mongoose'

const { Types } = Schema

const stickieSchema = new Schema({
  title: Types.String,
  description: Types.String,
  column: {
    type: Types.ObjectId,
    ref: 'column',
    index: true
  }
})

export default stickieSchema
