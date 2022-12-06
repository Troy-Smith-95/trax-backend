/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
    return knex.schema.createTable('genre_avg_audio_features', (table) => {
        table.uuid('id').primary(); 
        table.integer("genre_id").unsigned().notNullable();       
        table
            .foreign('genre_id')
            .references('genres.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.bigint('created_at');
        table.float('acousticness', 16, 8).notNullable();
        table.float('danceability', 16, 8).notNullable();
        table.integer('duration_ms').notNullable();
        table.float('energy', 16, 8).notNullable();
        table.float('instrumentalness', 16, 8).notNullable();
        table.integer('key').notNullable();
        table.float('liveness', 16, 8).notNullable();
        table.float('loudness', 16, 8).notNullable();
        table.integer('mode').notNullable();
        table.float('speechiness', 16, 8).notNullable();
        table.float('tempo', 16, 8).notNullable();
        table.integer('time_signature').notNullable();
        table.float('valence', 16, 8).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('genre_avg_audio_features');
};
