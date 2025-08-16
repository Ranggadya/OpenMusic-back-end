/* eslint-disable camelcase */
const mapAlbum = ({
  id, name, year, created_at, updated_at,
}) => ({
  id, name, year, createdAt: created_at, updateAt: updated_at,
});

const mapSong = ({
  id, title, year, performer, genre, duration, album_id, created_at, updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id || null,
  createdAt: created_at,
  updateAt: updated_at,
});

module.exports = { mapAlbum, mapSong };
