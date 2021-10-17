import {
  log,
  Room,
} from 'wechaty'

import type {
  RepoConfig,
  ChatoperaOptions,
  ChatoperaResponse,
}                       from './chatopera.js'

import chatoperaSdk from '@chatopera/sdk'

interface RoomBotConfig {
  roomId: string;
  name: string;
  secret: string;
}

const {
  Chatopera,
  Chatbot,
} = chatoperaSdk as {
  Chatopera: any,
  Chatbot: any,
} // Issue #8 - https://github.com/wechaty/wechaty-chatopera/pull/8#issuecomment-945093665

/**
 * capitalize the first letter
 * @param t target string
 * @returns
 */
function capitalize (t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1)
}

async function initBot (defaultOptions?: ChatoperaOptions, repoConfig?: RepoConfig) {
  log.verbose('WechatyChatopera', 'init Bots on start ...')
  const result: RoomBotConfig[] = []
  const token = defaultOptions?.personalAccessToken

  if (token) {
    const chatopera = new Chatopera(token)
    const resp = await chatopera.command('GET', '/chatbot?limit=9999')
    if (repoConfig && resp.rc === 0) {
      const bots: { clientId: string; name: string; secret: string }[] = resp.data
      for (const fullName in repoConfig) {
        const splits = fullName.split('/')
        const owner = splits[0] || 'NOOWNER'
        const repoName = splits[1] || 'NOREPO'
        const botName = `OSSChat${capitalize(owner.toLowerCase())}${capitalize(repoName.toLowerCase())}`
        let targetBot = bots.find((b) => b.name === botName)
        if (!targetBot) {
          log.verbose('WechatyChatopera', 'create bot for %s as it does not exist.', fullName)
          const createBotRes = await chatopera.command('POST', '/chatbot', {
            description: 'OSSChat BOT, OSSChat is for bridging IM apps (e.g., WeChat) and Apache community tools (e.g., mailing list, and jira).',
            logo: '',
            name: botName,
            primaryLanguage: 'zh_CN',
            trans_zhCN_ZhTw2ZhCn: true,
          })

          if (createBotRes.rc === 0) {
            log.verbose('WechatyChatopera', 'bot is created for %s(%s)', fullName, botName)
            targetBot = createBotRes.data
          } else {
            log.verbose('WechatyChatopera', 'fail to create bot for %s, response %s', fullName, JSON.stringify(createBotRes))
          }
        } else {
          log.verbose('WechatyChatopera', 'existed bot for %s(%s)', fullName, botName)
        }

        let roomId = repoConfig[fullName]!
        if (!Array.isArray(roomId)) {
          roomId = [roomId]
        }

        if (targetBot) {
          const options = targetBot
          roomId.forEach((r) => result.push({ roomId: r, ...options }))
        }
      }
    }
  }

  return result
}

function asker (defaultOptions: ChatoperaOptions, repoConfig?: RepoConfig) {
  log.verbose('WechatyChatopera', 'asker(%s)', JSON.stringify(defaultOptions))

  const botPromise = initBot(defaultOptions, repoConfig)

  const findOption = async (roomId?: string): Promise<ChatoperaOptions> => {
    const botList = await botPromise
    const targetBot = botList.find((b) => b.roomId === roomId)

    if (targetBot) {
      return { ...defaultOptions, ...targetBot }
    } else {
      return defaultOptions
    }
  }

  return async function ask (
    question: string,
    contactId: string,
    room?: Room,
  ): Promise<ChatoperaResponse> {
    log.verbose('WechatyChatopera', 'ask(%s, %s, %s)', question, contactId, room)

    const options = await findOption(room?.id)
    if (!(options.clientId && options.secret)) {
      return { botName: '', logic_is_fallback: true, logic_is_unexpected: true, service: { provider: 'BOT_NOT_DEF' }, state: '', string: '' }
    }

    const chatbot = new Chatbot(options.clientId, options.secret)
    const extras = { room: false, username: '' }

    if (room) {
      extras.username = contactId
      extras.room = true
      contactId = `${await room.topic()}`
    }
    const cmdRes = await chatbot.command('POST', '/conversation/query', {
      extras: extras,
      faqBestReplyThreshold: options.faqBestReplyThreshold,
      faqSuggReplyThreshold: options.faqSuggReplyThreshold,
      fromUserId: contactId,
      textMessage: question,
    })
    return cmdRes.data as ChatoperaResponse
  }

}

export {
  asker,
}
