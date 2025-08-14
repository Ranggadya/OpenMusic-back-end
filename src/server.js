const { Hapi } = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                orgigin: ['*'],
            }
        }
    });

    await server.start();
    console.log(`Server sedang berjalan pada ${server.info.url}`);
}

init();