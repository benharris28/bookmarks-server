const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const store = require('../store')
const isUrl = require('is-url')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const { title, url, rating, desc} = req.body;

        if(!title) {
            logger.error('Title is required');
            return res
                .status(400)
                .send('Invalid data');
        }

        if(!url) {
            logger.error('url is required');
            return res
                .status(400)
                .send('Invalid data');
        }

        if(!rating) {
            logger.error('Rating is required');
            return res
                .status(400)
                .send('Invalid data');
        }

        if(!desc) {
            logger.error('Description is required');
            return res
                .status(400)
                .send('Invalid data');
        }

        if (!Number.isInteger(rating) || rating > 5 || rating < 0) {
            logger.error('Rating is not valid')
            return res
                .status(400)
                .send('Rating must be a number between 0 and 5');
        }

        if (!isUrl(url)) {
            logger.error('URL is not valid')
            return res
                .status(400)
                .send('Must be a valid URL')
        }


        const id = uuid();

        const bookmark = {
            id,
            title,
            url,
            rating,
            desc
        };

        store.bookmarks.push(bookmark);

        logger.info(`Bookmark with id ${id} created`);

        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(bookmark)


    })


bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;
        const bookmark = store.bookmarks.find(bm => bm.id == id);

        // make sure we found a bookmark
        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found`);
            return res
                .status(404)
                .send('Bookmark not found');
        }

        res.json(bookmark)
    })
    .delete((req, res) => {
        // delete bookmark with matching id
        const { id } = req.params;
        const bookmarkIndex = store.bookmarks.findIndex(bm => bm.id == id);

        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${id} not found`);
            return res
                .status(404)
                .send('Not found')
        }

        store.bookmarks.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with id ${id} deleted`);

        res
            .status(204)
            .end();

    })

    module.exports = bookmarksRouter