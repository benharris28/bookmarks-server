const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./bookmarks-fixtures')

describe('Bookmarks Endpoints', function() {
// create the knex instance to connect to the database

let database

before('make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
})

after('disconnect from db', () => db.destroy)

before('clean the table', () => db('bookmarks_list').truncate())

afterEach('cleanup',() => db('bookmarks_list').truncate())

describe(`GET /bookmarks`, () => {
    context(`Given no bookmarks`, () => {
        it('responds with 200 and an empty list', () => {
            return supertest(app)
                .get('/bookmarks')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, [])
        })
    })

    context('Given there are bookmarks', () => {
        const testBookmarks = fixtures.makeBookmarksArray()

        beforeEach('insert bookmarks', () => {
            return db
                .into('bookmarks_list')
                .insert(testBookmarks)
        })

        it('gets all bookmarks', () => {
            return supertest(app)
                .get('/bookmarks')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, testBookmarks)
        })
    })
})

    describe('Get /bookmarks/:id', () => {
        context('Given no bookmarks', () => {
            it(`responds with 404 when bookmark doesn't exist`, () => {
                return supertest(app)
                    .get('/bookmarks/123')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {
                        error: { message: `Bookmark not found`}
                    })

            })
        })
    })
})