import {
  Wechaty,
  WechatyPlugin,
  log,
  Message,
  Contact,
  Room,
}                   from 'wechaty'
import {
  matchers,
}                   from 'wechaty-plugin-contrib'

import { asker }            from './asker.js'
import { normalizeConfig }  from './normalize-config.js'
import { mentionMatcher }        from './mention-matcher.js'

import type {
  RepoConfig,
  ChatoperaOptions,
  ChatoperaResponse,
}                           from './chatopera.js'

interface WechatyChatoperaConfigMatcher {
  contact?        : matchers.ContactMatcherOptions,
  room?           : matchers.RoomMatcherOptions,
  mention?        : boolean,
  skipMessage?    : matchers.MessageMatcherOptions,
}

export type WechatyChatoperaConfig = WechatyChatoperaConfigMatcher &
  Partial<ChatoperaOptions> & {
    repoConfig?: RepoConfig;
  };

function WechatyChatopera (config: WechatyChatoperaConfig): WechatyPlugin {
  const roomIds: string[] = []
  for (const fullName in config.repoConfig) {
    const repoRoom: string | string[] = config.repoConfig[fullName] || []
    if (Array.isArray(repoRoom)) {
      roomIds.push(...repoRoom)
    } else {
      roomIds.push(repoRoom)
    }
  }

  if (roomIds.length > 0) {
    config.room = roomIds
  }

  const normalizedConfig = normalizeConfig(config)

  const ask = asker(normalizedConfig, config.repoConfig)

  const matchContact = typeof config.contact === 'undefined'
    ? () => true
    : matchers.contactMatcher(config.contact)

  const matchRoom = typeof config.room === 'undefined'
    ? () => true
    : matchers.roomMatcher(config.room)

  const matchSkipMessage = typeof config.skipMessage === 'undefined'
    ? () => false // default not skip any messages
    : matchers.messageMatcher(config.skipMessage)

  const matchMention = (typeof config.mention === 'undefined')
    ? mentionMatcher(true) // default: true
    : mentionMatcher(config.mention)

  const matchLanguage = (typeof config.language === 'undefined')
    ? () => true  // match all language by default
    : matchers.languageMatcher(config.language)

  const isPluginMessage = async (message: Message): Promise<boolean> => {
    if (message.self())                       { return false }
    if (message.type() !== Message.Type.Text) { return false }

    const mentionList = await message.mentionList()
    if (mentionList.length > 0) {
      if (!await message.mentionSelf()) { return false }
    }

    return true
  }

  const isConfigMessage = async (message: Message): Promise<boolean> => {
    const from = message.talker()
    const room = message.room()

    if (await matchSkipMessage(message))                  { return false }

    if (room) {
      if (!await matchRoom(room))                         { return false }
      if (!await matchMention(message))                        { return false }

      /**
       * Mention others but not include the bot
       */
      const mentionList = await message.mentionList()
      const mentionSelf = await message.mentionSelf()
      if (mentionList.length > 0 && !mentionSelf)         { return false }
    } else {
      if (from && !await matchContact(from))              { return false }
    }

    const text = await message.mentionText()
    if (!matchLanguage(text))                             { return false }

    return true
  }

  /**
   * Connect with Wechaty
   */
  return function WechatyChatoperaPlugin (wechaty: Wechaty) {
    log.verbose('WechatyChatopera', 'WechatyChatoperaPlugin(%s)', wechaty)

    wechaty.on('message', async message => {
      log.verbose('WechatyChatopera', 'WechatyChatoperaPlugin() wechaty.on(message) %s', message)

      if (!await isPluginMessage(message)) {
        log.silly('WechatyChatopera', 'WechatyChatoperaPlugin() wechaty.on(message) message not match this plugin, skipped.')
        return
      }

      if (!await isConfigMessage(message)) {
        log.silly('WechatyChatopera', 'WechatyChatoperaPlugin() wechaty.on(message) message not match config, skipped.')
        return
      }

      const text = await message.mentionText()
      if (!text) { return }

      const from: Contact = message.talker()
      const room: Room = message.room()

      const response: ChatoperaResponse = await ask(text, from.name(), room)
      if ((!response) || (!response.string)) {
        return
      }

      log.info(`getting chatopera answer:${JSON.stringify(response)}`)
      let answer: string = ''

      if (!response.logic_is_fallback) {
        answer = response.string
      }

      if (!answer) {
        log.info('No answer from chatopera')
        return
      }

      if (from && room && await message.mentionSelf()) {
        await room.say(answer, from)
      } else {
        await message.say(answer)
      }

    })

  }
}

export { WechatyChatopera }
