import { Schema } from 'mongoose'

const { Types } = Schema

const columnSchema = new Schema({
  title: Types.String,
  description: Types.String,
  board: {
    type: Types.ObjectId,
    ref: 'board',
    index: true
  }
})

export default columnSchema
