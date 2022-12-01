/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('tracks', (table) => {
        table.increments('id').primary();
        table.string('track_name').notNullable();
        table.integer("genre_id").unsigned().notNullable();
        table
            .foreign('genre_id')
            .references('genres.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.integer("playlist_id").unsigned().notNullable();
        table
            .foreign('playlist_id')
            .references('playlists.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.string('spotify_id').notNullable();
        table.float('acousticness').notNullable();
        table.float('danceability').notNullable();
        table.integer('duration_ms').notNullable();
        table.float('energy').notNullable();
        table.float('instrumentalness').notNullable();
        table.integer('key').notNullable();
        table.float('liveness').notNullable();
        table.float('loudness').notNullable();
        table.integer('mode').notNullable();
        table.float('speechiness').notNullable();
        table.float('tempo').notNullable();
        table.integer('time_signature').notNullable();
        table.float('valence').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('tracks');
};
