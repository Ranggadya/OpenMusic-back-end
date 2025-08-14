const { nanoid } = require('nanoid');
const InvariantError = require('../../Exceptions/InvariantError');

class AlbumsService {
    constructor() {
        this._albums = [];
    }

    addAlbum({ name , year }) {
        const id = `album ${nanoid(16)}`;


        const newAlbum = { name, year, id};

        this._albums.push(newAlbum);

        const isSuccess = this._albums.filter((album) => album.id === id).length > 0;
        if(!isSuccess) {
            throw new InvariantError('Album gagal ditambahkan');
        }
    }

    getAlbums() {
        return this._albums;
    }

    getAlbumById(id) {
        const album  = this._albums.filter((index) => index.id === id)[0];

        if(!album) {
            throw new InvariantError('Album tidak ditemukan');
        }

        return album;
    }

    editAlbumById(id, { name, year }) {
        const index = this._albums.findIndex((a) => a.id === id);

        if( index === -1) {
            throw new InvariantError('Gagal memperbarui album. Id tidak ditemukan');
        }

        this._albums[index] = {
            ...this._albums[index],
            name,
            year,
        };
    }

    deleteAlbumById(id) {
        const index = this._albums.findIndex((album) => album.id === id);

        if(!index === -1) {
            throw new InvariantError('Album gagal dihapus. Id tidak ditemukan');
        }

        this._albums.splice(index, 1);
    }
}

module.exports = AlbumsService;