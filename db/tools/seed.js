import mongoose from 'mongoose'
import faker from 'faker'
import { chunk, range, random } from 'lodash'
import dbConnectionConfig from '../connectionConfig'
import { getModels } from '../models'
import { resetModelCollection, getPasswordHash } from './utils'
import { USERS, BOARDS, COLUMNS, COLORS } from './data'

let mongooseConnection = null

const announce = (message) => console.log(`\n# ${message} #\n`)

const handleError = (error) => {
  mongooseConnection && mongooseConnection.close()
  console.error(error)
  process.exit(1)
}

const insertStickies = async (models, insertedColumns) => {
  try {
    const insertionData = insertedColumns.reduce((acc, column) => {
      // Insert 1 to 10 stickies
      range(random(1, 10)).forEach((position) => {
        acc.push({
          // Set a title to a random lorem ipsum sentence of 1 to 4 words
          title: faker.lorem.words(random(1, 4)),
          // Set a description to a random lorem ipsum sentence of 3 to 16 words
          description: faker.lorem.sentence(random(3, 16)),
          color: COLORS[random(0, COLORS.length - 1)],
          // Use a timestamp epoch for as position value
          position: new Date().getTime() - random(60000 * 50, 60000 * 5000),
          column
        })
      })
      return acc
    }, [])
    const insertion = await models.Stickie.insertMany(insertionData)
    console.log(`Inserted ${insertion.length} Stickie records`)
    return insertion
  } catch (error) {
    handleError(error)
  }
}

const insertColumns = async (models, insertedBoards) => {
  try {
    const insertionData = insertedBoards.reduce((acc, board) => {
      COLUMNS.forEach(({ title, description }, index) => {
        acc.push({
          title,
          description,
          position: index,
          board
        })
      })
      return acc
    }, [])
    const insertion = await models.Column.insertMany(insertionData)
    console.log(`Inserted ${insertion.length} Column records`)
    return insertion
  } catch (error) {
    handleError(error)
  }
}

const insertBoards = async (models, insertedUsers) => {
  try {
    const chunkedBoards = chunk(BOARDS, insertUsers.length)
    const insertionData = chunkedBoards.reduce((acc, boards) => {
      boards.forEach((board, index) => {
        acc.push({
          name: board,
          owner: insertedUsers[index],
          members: insertedUsers
        })
      })
      return acc
    }, [])
    const insertion = await models.Board.insertMany(insertionData)
    console.log(`Inserted ${insertion.length} Board records`)
    return insertion
  } catch (error) {
    handleError(error)
  }
}

const insertUsers = async (models) => {
  try {
    const hashedPasswords = await Promise.all([
      ...USERS.map((userRecord) => getPasswordHash(userRecord.password))
    ])
    const insertion = await models.User.insertMany(
      USERS.map((userRecord, index) => ({ ...userRecord, password: hashedPasswords[index] }))
    )
    console.log(`Inserted ${insertion.length} User records`)
    return insertion
  } catch (error) {
    handleError(error)
  }
}

const runDBTasks = async () => {
  try {
    mongooseConnection = await mongoose.createConnection(
      process.env.DB_CONNECTION,
      dbConnectionConfig
    )
    const models = getModels(mongooseConnection)

    // Keep in mind the order in which collections are reset matters.
    announce('Removing old records')
    await resetModelCollection(models.Stickie)
    await resetModelCollection(models.Column)
    await resetModelCollection(models.Board)
    await resetModelCollection(models.User)

    // Insert mock data
    announce('Inserting mock data')
    const insertedUsers = await insertUsers(models)
    const insertedBoards = await insertBoards(models, insertedUsers)
    const insertedColumns = await insertColumns(models, insertedBoards)
    await insertStickies(models, insertedColumns)

    // Close the database connection and exit the process.
    mongooseConnection.close()
    process.exit(0)
  } catch (error) {
    handleError(error)
  }
}

runDBTasks()
