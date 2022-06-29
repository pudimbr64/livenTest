exports.up = function(knex, Promise) {
  return knex.schema.createTable('users',function (table){ 
    table.increments('id').primary();
    table.string('name', 200).notNullable();
    table.string('birthdate', 200).notNullable();
    table.string('salt', 200).notNullable();
    table.string('hash', 200).notNullable();
    table.string('email', 200).unique().notNullable();
  })
  .then(function () {
    return knex.schema.createTable('addresses',function(table){
      table.increments('id').primary();
      table.string('addressName', 200).notNullable();
      table.integer('userId').unsigned().notNullable().index().references('id').inTable('users');
      table.string('street', 200).notNullable();
      table.string('number', 200).notNullable();
      table.string('country', 200).notNullable();
      table.string('city', 200).notNullable();
      table.string('neighborhood', 200).notNullable();
      table.string('zipcode', 200).notNullable();
    });     
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users').dropTable('addresses');
}