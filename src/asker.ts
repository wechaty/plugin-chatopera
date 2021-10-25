import {
  log,
  Room,
} from 'wechaty'

import {
  RepoConfig,
  ChatoperaOptions,
  ChatoperaResponse,
} from './chatopera'

import {
  md5,
} from './utils'

import fs from 'fs'
import path from 'path'

const { Chatbot, Chatopera } = require('@chatopera/sdk')

const OSSCHAT_FAQ_HASH = 'OSSCHAT_FAQ_HASH'

interface RoomBotConfig {
  roomId: string;
  name: string;
  clientId: string;
  secret: string;
}

 interface FaqAnswer {
   rtype: string
   content: string
   enabled: boolean
 }

 interface FaqItem {
   id?: string
   post: string
   categories: string
   replies: FaqAnswer[]
   extends?: string[]
   enabled: boolean
 }

 interface FaqData {
   [fullName: string]: FaqItem[]
 }

/**
 * capitalize the first letter
 * @param t target string
 * @returns
 */
function capitalize (t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function generateBoName (fullName: string): string {
  const splits = fullName.split('/')
  const owner = splits[0]
  const repoName = splits[1]
  const botName = `OSSChat${capitalize(owner.toLowerCase())}${capitalize(
    repoName.toLowerCase()
  )}`
  return botName
}

type CommandFn = (...args: any[]) => Promise<any>

function getCommand (clientId: string, secret: string): CommandFn {
  const chatbot = new Chatbot(clientId, secret)

  return (...args: any[]) =>
    chatbot.command(...args).then((res: any) => {
      if (res.rc === 0) {
        return res
      } else {
        throw new Error(res.error)
      }
    })
}

async function initBotFaq (
  faqRoot: string,
  botPromise: Promise<RoomBotConfig[]>
): Promise<void> {
  const bots = await botPromise
  if (fs.existsSync(faqRoot)) {
    const fileNames = fs.readdirSync(faqRoot)
    for (const name of fileNames) {
      if (/\.faqs\.yml$/.test(name)) {
        const faqPath = path.join(faqRoot, name)
        const faqYaml = fs.readFileSync(faqPath, 'utf-8')
        const faqHash = md5(faqYaml)
        const faqData = Chatopera.utils.mapFaqFromYaml(faqYaml) as FaqData
        for (const fullName in faqData) {
          const botName = generateBoName(fullName)
          const targetBot = bots.find((b) => b.name === botName)
          if (targetBot) {
            const command = getCommand(targetBot.clientId, targetBot.secret)
            const newFaqs = faqData[fullName]
            const { data: oldFaqs }: { data: FaqItem[] } = await command(
              'GET',
              '/faq/database?limit=9999'
            )

            const hashVersion = oldFaqs.find((p) => p.post === OSSCHAT_FAQ_HASH)
            if (hashVersion) {
              const { data }: { data: FaqItem } = await command(
                'GET',
                `/faq/database/${hashVersion.id}`
              )
              if (data?.replies[0].content === faqHash) {
                continue
              }
            }

            for (const faq of newFaqs) {
              faq.enabled = true
              const questionId = await updateQuestion(oldFaqs.find((p) => p.post === faq.post), command, faq)
              await updateQuestionExtends(command, questionId, faq)
            }

            await updateFaqVersion(hashVersion, command, faqHash)
          }
        }
      }
    }
  }

  async function updateQuestionExtends (
    command: CommandFn,
    questionId: string,
    faq: FaqItem
  ) {
    const postExtends = faq.extends || []
    const extendPath = `/faq/database/${questionId}/extend`
    const { data } = await command('GET', extendPath)
    for (const oldExtend of data) {
      await command('DELETE', `${extendPath}/${oldExtend.id}`)
    }

    for (const newExtend of postExtends) {
      await command('POST', extendPath, { post: newExtend })
    }
  }

  async function updateQuestion (oldItem: FaqItem | undefined, command: CommandFn, faq: FaqItem) : Promise<string> {
    if (oldItem?.id) {
      const { data } = await command('GET', `/faq/database/${oldItem.id}`)
      const replyLastUpdate = data?.replyLastUpdate
      await command('PUT', `/faq/database/${oldItem.id}`, {
        ...faq,
        replyLastUpdate,
      })
      return oldItem.id
    } else {
      const { data } = await command('POST', '/faq/database', faq)
      return data.id
    }
  }

  async function updateFaqVersion (hashVersion: FaqItem | undefined, command: CommandFn, faqHash: string) {
    if (hashVersion) {
      const { data } = await command('GET', `/faq/database/${hashVersion.id}`)
      const replyLastUpdate = data?.replyLastUpdate
      await command('PUT', `/faq/database/${hashVersion.id}`, {
        post: OSSCHAT_FAQ_HASH,
        replies: [
          {
            content: faqHash,
            enabled: true,
            rtype: 'plain',
          },
        ],
        replyLastUpdate,
      })
    } else {
      await command('POST', '/faq/database', {
        post: OSSCHAT_FAQ_HASH,
        replies: [
          {
            content: faqHash,
            enabled: true,
            rtype: 'plain',
          },
        ],
      })
    }
  }
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
        const botName = generateBoName(fullName)
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

        let roomId = repoConfig[fullName]
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

  if (defaultOptions.faqPath) {
    initBotFaq(defaultOptions.faqPath, botPromise).catch((err) => {
      log.error('WechatyChatopera', 'init bot faq fail', err)
    })
  }

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
