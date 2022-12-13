/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('genres').del()
  await knex('genres').insert([
    { 
      id: 1,
      genre_name: 'Hip-Hop',
      slug: 'hip-hop'
    },
    { 
      id: 2,
      genre_name: 'Pop',
      slug: 'pop'
    },
    { 
      id: 3,
      genre_name: 'Alternative',
      slug: 'alternative'
    },
    { 
      id: 4,
      genre_name: 'Dance',
      slug: 'dance'
    },
  ]);
};
