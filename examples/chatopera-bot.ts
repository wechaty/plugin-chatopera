/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
import {
  Contact,
  Message,
  Wechaty,
  log,
}               from 'wechaty'

import { WechatyChatoperaConfig, WechatyChatopera } from '../src/mod.js'

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

const bot = new Wechaty({
  name: 'ding-dong-bot',
  /**
   * To use different puppets(which are control different underlying protocols, like Web/Pad/Mac/Windows, etc)
   * with Wechaty, you have two ways:
   *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-hostie' }`)
   *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-hostie`)
   *
   * You can use the following providers:
   *  - wechaty-puppet-hostie
   *  - wechaty-puppet-puppeteer
   *  - etc.
   *
   * Learn more about Wechaty Puppet Providers at:
   *  https://github.com/wechaty/puppet-service-providers
   *
   * Learn more about Wechaty Puppet at:
   *  https://github.com/wechaty/wechaty-puppet/wiki/Directory
   */

  puppet: 'wechaty-puppet-hostie',
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
