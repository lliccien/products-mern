import mongoose from 'mongoose'
import { DB_HOST, DB_PORT, DB_DATABASE } from '@config'

class Db {
  private dbConnection: string

  constructor() {
    this.dbConnection = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
  }

  public connetDB = async () => {
    const db = await mongoose.connect(this.dbConnection)
    console.log(`database is connected to ${db.connection.db.databaseName}`)
  }
}

export default Db
