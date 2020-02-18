const BookmarksService = {
    getAllBookmarks(knex) {
        return knex
            .select('*')
            .from('bookmarks_list');
    },

    getBookmarkById(knex, id) {
        return knex
            .select('*')
            .from('bookmarks_list')
            .where('id', id)
            .first()
    }
}

module.exports = BookmarksService;

// Running a knex command on 