require('dotenv').config();
const Hapi = require('@hapi/hapi');
const AlbumsService = require('./services/postgress/AlbumsService');
const SongsService = require('./services/postgress/SongsService');
const albums = require('./api/music/albums');
const songs = require('./api/music/songs');
const AlbumValidator = require('./validator/albums');
const SongValidator = require('./validator/songs');
const ClientError = require('./Exceptions/ClientError');

const init = async () => {
    const albumsService = new AlbumsService();
    const songsService = new SongsService();

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            }
        }
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: AlbumValidator,
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;

        if (response instanceof Error) {

            // penanganan client error secara internal.
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
            if (!response.isServer) {
                return h.continue;
            }

            // penanganan server error sesuai kebutuhan
            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });
            newResponse.code(500);
            return newResponse;
        }

        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue;
    });


    await server.start();
    console.log(`Server sedang berjalan pada ${server.info.uri}`);
}

init();