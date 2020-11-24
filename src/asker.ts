
import { log }  from 'wechaty'
import { 
  ChatoperaOptions,
  ChatoperaResponse,
}               from './chatopera'

const Chatbot = require("@chatopera/sdk").Chatbot;

function asker (options: ChatoperaOptions) {
  log.verbose('WechatyChatopera', 'asker(%s)', JSON.stringify(options))

  const chatbot = new Chatbot(options.clientId, options.secret)

  return async function ask (
    question: string,
    userId  : string,
    roomId? : string,
  ): Promise<ChatoperaResponse> {
    log.verbose('WechatyChatopera', 'ask(%s, %s, %s)', question, userId, roomId)
    
    if (roomId) {
      userId = `${userId}-${roomId}`
    }
    const cmdRes = await chatbot.command('POST', '/conversation/query', {
      textMessage          : question,
      fromUserId           : userId,
      faqBestReplyThreshold: options.bestScoreThreshold,
      faqSuggReplyThreshold: options.suggScoreThreshold,
    })
    return cmdRes.data as ChatoperaResponse
  }

}

export {
  asker,
}
