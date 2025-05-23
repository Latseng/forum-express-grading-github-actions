const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models')
const { User, Comment, Restaurant } = db
const { localFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    const { file } = req // 將註冊時上傳的照片檔取出
    Promise.all([
      User.findOne({ where: { email: req.body.email } }), // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
      localFileHandler(file),
      bcrypt.hash(req.body.password, 10)
    ])
      .then(([email, filePath, password]) => {
        if (email) throw new Error('Email already exists!')
        User.create({
          // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
          name: req.body.name,
          email: req.body.email,
          password: password,
          image: filePath || null
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！') // 並顯示成功訊息
        res.redirect('/signin')
      })
      .catch(err => next(err)) // 接住前面拋出的錯誤，呼叫專門做錯誤處理的 middleware
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      // raw: true,
      // nest: true
      include: { model: Comment, include: Restaurant }
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!") //  如果找不到，回傳錯誤訊息，後面不執行
        res.render('users/profile', { user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true }).then(user => {
      if (!user) throw new Error("User didn't exist!")
      res.render('users/edit', { user })
    })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    const userId = req.user.id // 辨別發出請求的使用者id
    if (!name) throw new Error('name is required!')
    const { file } = req // 把檔案取出來
    return Promise.all([
      // 非同步處理
      User.findByPk(userId), // 核對資料庫，確定只有使用者本人才能修改本人的資料
      localFileHandler(file) // 把檔案傳到 file-helper 處理
    ])
      .then(([user, filePath]) => {
        // 以上兩樣事都做完以後
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          // 修改這筆資料
          name,
          image: filePath || user.image // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${userId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = userController
