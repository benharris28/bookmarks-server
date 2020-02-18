const knex = require('knex')
const app = require('./app')

const { PORT, DB_URL } = require('./config')

const db = knex({
  client: 'pg',
  connection: DB_URL,
})

// This is where we are connecting the express server to the database

app.set('db', db)
// db is a global variable for node
// Telling node what a database is
//knex object points to a database URL (helps to connect to database)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})