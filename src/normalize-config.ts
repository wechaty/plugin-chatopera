import { WechatyChatoperaConfig }  from './plugin'
import {
  ChatoperaOptions,
  DEFAULT_CHATOPERA_FAQ_BESTREPLY_THRES,
  DEFAULT_CHATOPERA_FAQ_SUGGREPLY_THRES,
}                                 from './chatopera'

function normalizeConfig (config: WechatyChatoperaConfig): ChatoperaOptions {

  const language = config.language

  let clientId = config.clientId
  let secret   = config.secret
  let personalAccessToken = config.personalAccessToken
  let faqBestReplyThreshold = config.faqBestReplyThreshold
  let faqSuggReplyThreshold = config.faqSuggReplyThreshold

  if (!faqBestReplyThreshold) {
    faqBestReplyThreshold = DEFAULT_CHATOPERA_FAQ_BESTREPLY_THRES
  }

  if (!faqSuggReplyThreshold) {
    faqSuggReplyThreshold = DEFAULT_CHATOPERA_FAQ_SUGGREPLY_THRES
  }

  if (!personalAccessToken) {
    if (!clientId) {
      throw new Error(`
      Wechaty Chatopera Plugin requires ClientId for authorization.
      Please set "clientId" in plugin config.`)
    }

    if (!secret) {
      throw new Error(`
      Wechaty Chatopera Plugin requires Chatopera Secret.
      Please set 'secret' in plugin config.
    `)
    }

    console.log("PLUGIN>> Chatopera default BOT credentials are set.")
  } else {
    console.log("PLUGIN>> Chatopera Personal Access Token is set, would load bots per room for multi tenants.")
    if(clientId && secret){
      console.log("PLUGIN>> Chatopera default BOT credentials are set.")
    } else {
      console.log("PLUGIN>> WARN Chatopera default BOT credentials are not set.")
    }
  }

  return {
    clientId,
    secret,
    personalAccessToken,
    language,
    faqSuggReplyThreshold,
    faqBestReplyThreshold,
  }

}

export { normalizeConfig }
