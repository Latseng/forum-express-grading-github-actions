'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          // 一次新增5筆資料
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: true,
          name: 'root',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: 'user1',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: 'user2',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
          is_admin: false,
          name: 'user3',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          email: 'test@test.com',
          password: await bcrypt.hash('test', 10),
          is_admin: false,
          name: 'test-user',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      {}
    )
  },
  down: async (queryInterface, Sequelize) => {
    // 清空資料表中所有資料
    await queryInterface.bulkDelete('Users', {})
  }
}
