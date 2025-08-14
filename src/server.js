const Hapi = require('@hapi/hapi');
const AlbumsService = require('./services/postgress/AlbumsService');
const SongsService = require('./services/postgress/SongsService');
const albums = require('./api/music/albums');
const songs = require('./api/music/songs');

const init = async () => {
    const albumsService = new AlbumsService();
    const songsService = new SongsService();

    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
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
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
            },
        },
    ]);
    await server.start();
    console.log(`Server sedang berjalan pada ${server.info.uri}`);
}

init();