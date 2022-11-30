/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('playlists', (table) => {
        table.increments('id').primary();        
        table.string('playlist_name').notNullable();
        table.integer("genre_id").unsigned().notNullable();
        table
            .foreign('genre_id')
            .references('genres.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.string('spotify_id').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('playlists');
};