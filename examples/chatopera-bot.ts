/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
import {
  Contact,
  log,
  Message,
  Wechaty,
}                   from 'wechaty'

import {
  WechatyChatoperaConfig,
  WechatyChatopera,
}                           from '../src/mod.js'

function onLogin (user: Contact) {
  log.info('Login %s', user)
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (msg: Message) {
  log.info('StarterBot', msg.toString())
  if (msg.text() === 'ding') {
    await msg.say('dong')
  }
}

const bot = Wechaty.instance({
  name: 'ding-dong-bot',
})

const chatoperaConfig: WechatyChatoperaConfig = {
  clientId: '5fbcb0afcad362001b4e3b12',
  secret  : 'c03e26976ac9aed372953b48f55d09f9',
}
bot.use(WechatyChatopera(chatoperaConfig))

bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))
