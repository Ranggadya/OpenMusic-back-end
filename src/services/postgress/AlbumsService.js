const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../Exceptions/InvariantError');
const NotFoundError = require('../../Exceptions/NotFoundError');

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO albums (id, name, year) VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year],
        };


        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        return result.rows[0];
    }

    async editAlbumById(id, { name, year }) {

        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = NOW() WHERE id = $3 RETURNING id',
            values: [name, year, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
        }
    }

    async getAlbumWithSongs(id) {
        const albumResult = await this._pool.query({
            text: 'SELECT id, name, year FROM albums WHERE id = $1',
            values: [id],
        });

        if (!albumResult.rowCount) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const songsResult = await this._pool.query({
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [id],
        });

        return {
            ...albumResult.rows[0],
            songs: songsResult.rows,
        };
    }

}

module.exports = AlbumsService;