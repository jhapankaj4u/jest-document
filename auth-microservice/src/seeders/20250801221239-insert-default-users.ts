'use strict';
import bcrypt from 'bcrypt';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = await bcrypt.hash('password123', 10);
    return queryInterface.bulkInsert('Users', [
      {
        email: 'admin@yopmail.com',
        password: hash,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
