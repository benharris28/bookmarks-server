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
    },
    insertBookmark(knex, newBookmark) {
        return knex
            .insert(newBookmark)
            .into('bookmarks_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = BookmarksService;

// Running a knex command on 