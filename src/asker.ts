import {
  log,
  Room,
}               from 'wechaty'

import {
  RepoConfig,
  ChatoperaOptions,
  ChatoperaResponse,
}               from './chatopera'

const { Chatbot, Chatopera } = require('@chatopera/sdk')

interface RoomBotConfig {
  roomId: string;
  name: string;
  secret: string;
}

async function initBot (repoConfig?: RepoConfig) {
  const result: RoomBotConfig[] = []
  const token = process.env['WCP_PERSONAL_ACC_TOKEN']

  if (token) {
    const chatopera = new Chatopera(token)
    const resp = await chatopera.command('GET', '/chatbot?limit=9999')
    if (repoConfig && resp.rc === 0) {
      const bots: { clientId: string; name: string; secret: string }[] = resp.data
      for (const fullName in repoConfig) {
        const owner = fullName.split('/')[0]
        const botName = `osschat_${owner.toLowerCase()}_bot`
        let targetBot = bots.find((b) => b.name === botName)
        if (!targetBot) {
          const createBotRes = await chatopera.command('POST', '/chatbot', {
            description: 'osschat bot',
            logo: '',
            name: botName,
            primaryLanguage: 'zh_CN',
            trans_zhCN_ZhTw2ZhCn: true,
          })

          if (createBotRes.rc === 0) {
            targetBot = createBotRes.data
          }
        }

        let roomId = repoConfig[fullName]
        if (!Array.isArray(roomId)) {
          roomId = [roomId]
        }

        if (targetBot) {
          const options =  targetBot
          roomId.forEach((r) => result.push({ roomId: r, ...options }))
        }
      }
    }
  }

  return result
}

function asker (defaultOptions: ChatoperaOptions, repoConfig?: RepoConfig) {
  log.verbose('WechatyChatopera', 'asker(%s)', JSON.stringify(defaultOptions))

  const botPromise = initBot(repoConfig)

  const findOption = async (roomId?:string) : Promise<ChatoperaOptions> =>  {
    const botList = await botPromise
    const targetBot = botList.find((b) => b.roomId === roomId)

    if (targetBot) {
      return { ...defaultOptions, ...targetBot }
    } else {
      return defaultOptions
    }
  }

  return async function ask (
    question   : string,
    contactId  : string,
    room? : Room,
  ): Promise<ChatoperaResponse> {
    log.verbose('WechatyChatopera', 'ask(%s, %s, %s)', question, contactId, room)

    const options = await findOption(room?.id)
    const chatbot = new Chatbot(options.clientId, options.secret)

    if (room) {
      contactId = `${await room.topic()}`
    }
    const cmdRes = await chatbot.command('POST', '/conversation/query', {
      faqBestReplyThreshold: options.faqBestReplyThreshold,
      faqSuggReplyThreshold: options.faqSuggReplyThreshold,
      fromUserId           : contactId,
      textMessage          : question,
    })
    return cmdRes.data as ChatoperaResponse
  }

}

export {
  asker,
}
