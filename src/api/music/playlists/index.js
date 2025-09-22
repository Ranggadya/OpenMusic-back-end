/* eslint-disable max-len */
const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    service, songsService, activitiesService, validator,
  }) => {
    const playlistsHandler = new PlaylistsHandler(service, songsService, activitiesService, validator);
    server.route(routes(playlistsHandler));
  },
};
