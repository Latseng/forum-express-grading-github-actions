const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

// 載入 controller，匹配條件多的路由放在前面
const admin = require('./modules/admin') // 載入 admin.js
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler') // 錯誤處理
router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/logout', userController.logout)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))// fallback 路由，當沒有匹配到路由時，會導向 /restaurants
router.use('/', generalErrorHandler)

module.exports = router
