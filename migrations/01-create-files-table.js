exports.up = async (knex) => {
  await knex.schema.createTable('point_clouds', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('path', 255).notNullable();
    table.jsonb('metadata');
    table.timestamp('uploaded_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('point_clouds');
};