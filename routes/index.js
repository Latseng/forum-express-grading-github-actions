const express = require('express')
const router = express.Router()

// 新增，載入 controller
const restController = require('../controllers/restaurant-controller')

router.get('/restaurants', restController.getRestaurants)// 匹配條件多的路由寫在前面
router.use('/', (req, res) => res.redirect('/restaurants'))// fallback 路由，當沒有匹配到路由時，會導向 /restaurants

module.exports = router
