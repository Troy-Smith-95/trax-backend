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
      playlist_name: 'Hip-Hop Favourites',
      genre_id: 1,
      spotify_id: '37i9dQZF1DX48TTZL62Yht'
    },
    {
      playlist_name: 'Hip-Hop Drive',
      genre_id: 1,
      spotify_id: '37i9dQZF1DWUFmyho2wkQU'
    },
    {
      playlist_name: 'Alternative Hip-Hop',
      genre_id: 1,
      spotify_id: '37i9dQZF1DWTggY0yqBxES'
    },
    {
      playlist_name: 'Workout Hip-Hop',
      genre_id: 1,
      spotify_id: '37i9dQZF1DWUX4dHd4gmc7'
    },
    {
      playlist_name: 'Northern Bars',
      genre_id: 1,
      spotify_id: '37i9dQZF1DX59ogDi1Z2XL'
    },
    {
      playlist_name: "Feelin' Myselft",
      genre_id: 1,
      spotify_id: '37i9dQZF1DX6GwdWRQMQpq'
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
    {
      playlist_name: 'Pumped Pop',
      genre_id: 2,
      spotify_id: '37i9dQZF1DX5gQonLbZD9s'
    },
    {
      playlist_name: 'Pop Up',
      genre_id: 2,
      spotify_id: '37i9dQZF1DX6aTaZa0K6VA'
    },
    {
      playlist_name: 'Pop Rising',
      genre_id: 2,
      spotify_id: '37i9dQZF1DWUa8ZRTfalHk'
    },
    {
      playlist_name: 'The New Alt',
      genre_id: 3,
      spotify_id: '37i9dQZF1DX82GYcclJ3Ug'
    },
    {
      playlist_name: 'Alt Now',
      genre_id: 3,
      spotify_id: '37i9dQZF1DWVqJMsgEN0F4'
    },
    {
      playlist_name: 'Alt',
      genre_id: 3,
      spotify_id: '37i9dQZF1DWTECONYYYLCY'
    },
    {
      playlist_name: 'Dance Hits',
      genre_id: 4,
      spotify_id: '37i9dQZF1DX0BcQWzuB7ZO'
    },
    {
      playlist_name: 'Energy Booster: Dance',
      genre_id: 4,
      spotify_id: '37i9dQZF1DX35X4JNyBWtb'
    },
    {
      playlist_name: 'Dance Hits Workout',
      genre_id: 4,
      spotify_id: '37i9dQZF1DXcQmoKHc2TWz'
    },
    {
      playlist_name: 'Dance Rising',
      genre_id: 4,
      spotify_id: '37i9dQZF1DX8tZsk68tuDw'
    },
    {
      playlist_name: 'Dance Paradise',
      genre_id: 4,
      spotify_id: '37i9dQZF1DXaPK7HyVedIT'
    },
    {
      playlist_name: 'Dance Party',
      genre_id: 4,
      spotify_id: '37i9dQZF1DXaXB8fQg7xif'
    },
    
  ]);
};
