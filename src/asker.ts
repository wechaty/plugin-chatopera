import { log }  from 'wechaty'
import {
  ChatoperaOptions,
  ChatoperaResponse,
}               from './chatopera'

const Chatbot = require('@chatopera/sdk').Chatbot

function asker (options: ChatoperaOptions) {
  log.verbose('WechatyChatopera', 'asker(%s)', JSON.stringify(options))

  const chatbot = new Chatbot(options.clientId, options.secret)

  return async function ask (
    question: string,
    contactId  : string,
    roomTopic? : string,
  ): Promise<ChatoperaResponse> {
    log.verbose('WechatyChatopera', 'ask(%s, %s, %s)', question, contactId, roomTopic)

    if (roomTopic) {
      contactId = `${roomTopic}`
    }
    const cmdRes = await chatbot.command('POST', '/conversation/query', {
      faqBestReplyThreshold: options.bestScoreThreshold,
      faqSuggReplyThreshold: options.suggScoreThreshold,
      fromUserId           : contactId,
      textMessage          : question,
    })
    return cmdRes.data as ChatoperaResponse
  }

}

export {
  asker,
}
