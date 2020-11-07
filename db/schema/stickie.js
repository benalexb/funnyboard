import { Schema } from 'mongoose'

const { Types } = Schema

const stickieSchema = new Schema({
  title: Types.String,
  description: Types.String,
  position: Types.Number,
  column: {
    type: Types.ObjectId,
    ref: 'column',
    index: true
  }
})

export default stickieSchema
