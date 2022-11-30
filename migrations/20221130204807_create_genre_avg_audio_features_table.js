/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
    return knex.schema.createTable('genre_avg_audio_features', (table) => {
        table.increments('id').primary(); 
        table.integer("genre_id").unsigned().notNullable();       
        table
            .foreign('genre_id')
            .references('genres.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.timestamp('created_at');
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
    return knex.schema.dropTable('genre_avg_audio_features');
};
