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
  ]);
};
