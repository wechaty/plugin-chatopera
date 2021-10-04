import { WechatyChatoperaConfig }  from './plugin'
import {
  ChatoperaOptions,
  DEFAULT_CHATOPERA_FAQ_BESTREPLY_THRES,
  DEFAULT_CHATOPERA_FAQ_SUGGREPLY_THRES,
}                                 from './chatopera'

function normalizeConfig (config: WechatyChatoperaConfig): ChatoperaOptions {

  const CHATOPERA_DEFAULT_CLIENTID = 'CHATOPERA_DEFAULT_CLIENTID'
  const CHATOPERA_DEFAULT_SECRET   = 'CHATOPERA_DEFAULT_SECRET'

  const CHATOPERA_FAQ_BESTREPLY_THRES   = 'CHATOPERA_FAQ_BESTREPLY_THRES'
  const CHATOPERA_FAQ_SUGGREPLY_THRES   = 'CHATOPERA_FAQ_SUGGREPLY_THRES'

  const CHATOPERA_PERSONAL_ACC_TOKEN = 'CHATOPERA_PERSONAL_ACC_TOKEN'

  const language = config.language

  let clientId = config.clientId
  let secret   = config.secret
  let faqBestReplyThreshold = config.faqBestReplyThreshold
  let faqSuggReplyThreshold = config.faqSuggReplyThreshold

  if (!clientId) {
    clientId = process.env[CHATOPERA_DEFAULT_CLIENTID]
  }
  if (!secret) {
    secret = process.env[CHATOPERA_DEFAULT_SECRET]
  }

  if (!faqBestReplyThreshold) {
    const threshold = process.env[CHATOPERA_FAQ_BESTREPLY_THRES]
    if (threshold) {
      faqBestReplyThreshold = parseFloat(threshold)
    } else {
      faqBestReplyThreshold = DEFAULT_CHATOPERA_FAQ_BESTREPLY_THRES
    }
  }

  if (!faqSuggReplyThreshold) {
    const threshold = process.env[CHATOPERA_FAQ_SUGGREPLY_THRES]
    if (threshold) {
      faqSuggReplyThreshold = parseFloat(threshold)
    } else {
      faqSuggReplyThreshold = DEFAULT_CHATOPERA_FAQ_SUGGREPLY_THRES
    }
  }

  if (!process.env[CHATOPERA_PERSONAL_ACC_TOKEN]) {
    if (!clientId) {
      throw new Error(`
      Wechaty Chatopera Plugin requires ClientId for authorization.
      Please set ${CHATOPERA_DEFAULT_CLIENTID} environment variable,
      or set 'clientId' in plugin config.
    `)
    }

    if (!secret) {
      throw new Error(`
      Wechaty Chatopera Plugin requires Chatopera Secret.
      Please set ${CHATOPERA_DEFAULT_SECRET} environment variable,
      or set 'secret' in plugin config.
    `)
    }

    console.log("PLUGIN>> Chatopera default BOT credentials are set.")
  } else {
    if(process.env[CHATOPERA_PERSONAL_ACC_TOKEN]){
      console.log("PLUGIN>> Chatopera Personal Access Token is set, would load bots per room for multi tenants.")
    }
    if(clientId && secret){
      console.log("PLUGIN>> Chatopera default BOT credentials are set.")
    } else {
      console.log("PLUGIN>> WARN Chatopera default BOT credentials are not set.")
    }
  }

  return {
    faqBestReplyThreshold,
    clientId,
    language,
    secret,
    faqSuggReplyThreshold,
  }

}

export { normalizeConfig }
