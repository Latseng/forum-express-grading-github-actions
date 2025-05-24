'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 先去查詢現在 Users, Restaurants 的 id 有哪些
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 50 }, () => ({
        text: '這是一則評論',
        created_at: new Date(),
        updated_at: new Date(),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        restaurant_id:
          restaurants[Math.floor(Math.random() * restaurants.length)].id
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', {})
  }
}
