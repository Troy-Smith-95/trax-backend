/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('playlists').del()
  await knex('playlists').insert([
    {
      playlist_name: 'RapCaviar',
      genre_id: 1,
      spotify_id: '37i9dQZF1DX0XUsuxWHRQd'
    },
    {
      playlist_name: 'Hip-Hop Central',
      genre_id: 1,
      spotify_id: '37i9dQZF1DWY6tYEFs22tT'
    },
    {
      playlist_name: "Today's Top Hits",
      genre_id: 2,
      spotify_id: '37i9dQZF1DXcBWIGoYBM5M'
    },
    {
      playlist_name: 'Pop All Day',
      genre_id: 2,
      spotify_id: '37i9dQZF1DXarRysLJmuju'
    },
  ]);
};
