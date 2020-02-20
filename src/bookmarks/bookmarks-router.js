const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const store = require('../store')
const isUrl = require('is-url')
const xss = require('xss')
const path = require('path')
const BookmarksService = require('./bookmarks-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: bookmark.url,
    description: xss(bookmark.description),
    rating: Number(bookmark.rating)
})

bookmarksRouter
    .route('/api/bookmarks')
    .get((req, res, next) => {
        

        BookmarksService.getAllBookmarks(req.app.get('db'))
        .then(bookmarks => {
            res.json(bookmarks.map(serializeBookmark))
        })
        .catch((err) => {
            console.log(err);
            next();
         })
    })
    .post(bodyParser, (req, res, next) => {
        
        const { title, url, description, rating} = req.body;

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

        if(!description) {
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


       

        const newBookmark = {
    
            title,
            url,
            description,
            rating,
            
        };

        BookmarksService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
        .then(bookmark => {
            logger.info(`Bookmark with id ${bookmark.id} created`);

        res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${bookmark.id}`))
            .json(serializeBookmark(bookmark))

        })
        .catch(next)
        })


        


bookmarksRouter
    .route('/api/bookmarks/:id')
    .all((req, res, next) => {
        const { id } = req.params
        BookmarksService.getBookmarkById(req.app.get('db'), id)
            .then(bookmark => {
                if(!bookmark) {
                    logger.error(`Bookmark with id ${id} not found.`)
                    return res.status(404).json({
                        error: { message: 'Bookmark not found' }
                    })
                }
                res.bookmark = bookmark
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => { 
        
        const { id } = req.params;
        
        BookmarksService.getBookmarkById(req.app.get('db'), id)
            .then(bookmark => {
                if (!bookmark) {
                    logger.error(`Bookmark with id ${id} not found`);
                    return res
                        .status(404)
                        .json({
                            error: { message: `Bookmark not found`}
                        });
                }
        
                res.json(bookmark)


            })
            .catch(next)
       
    })
    .delete((req, res, next) => {
        // delete bookmark with matching id
        const { id } = req.params;

        BookmarksService.deleteBookmark(
            req.app.get('db'),
            id
        )
            .then(numRowsAffected => {
                logger.info(`Bookmark with id ${id} deleted`)
                res.status(204).end()
            })
            .catch(next)
        

        

    })

    module.exports = bookmarksRouter