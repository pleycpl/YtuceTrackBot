require('dotenv').config()
const mongoose = require('mongoose')
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TelegramToken
const User = require('./models/User')
mongoose.connect(process.env.MongoDbUri || process.env.MongoDbUrl || 'mongodb://localhost/ytutrackbot')

const bot = new TelegramBot(token, {polling: true})

// Matches /createuser [whatever]
bot.onText(/\/createuser/, (msg, match) => {
  var fromId = msg.from.id
  console.log('Runned /createuser')
  User.find({id: fromId}, (err, user) => {
    if (err) throw err
    console.log(user)
    if (user.length === 0) {
      const newUser = new User({
        id: msg.from.id,
        username: msg.from.username,
        firstname: msg.from.first_name,
        lastname: msg.from.last_name,
        createdAt: Date.now()
      })
      newUser.save((err) => {
        if (err) throw err
        console.log('User saved successfully')
        bot.sendMessage(fromId, 'User created successfully')
      })
    } else {
      bot.sendMessage(fromId, 'User already exists')
    }
  })
})

bot.onText(/\/setsite (.+)/, (msg, match) => {
  var fromId = msg.from.id
  console.log('Runned /setsite')
  console.log(match[1])
  User.find({id: fromId}, (err, user) => {
    if (err) throw err
    if (user.length === 0) {
      bot.sendMessage(fromId, 'User doesnt exists')
    } else {
      User.findOneAndUpdate({id: fromId}, {trackSite: match[1]}, (err) => {
        if (err) throw err
        bot.sendMessage(fromId, 'Updated trackSite field')
      })
    }
  })
})

bot.on('message', (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, 'Received your message')
})

/*
setInterval(function () {
  console.log('[+] Runned setInterval function again')
  if (GlobalChatId) {
    bot.sendMessage(GlobalChatId, 'Okey')
  }
}, 2000)
*/
