import { WechatyChatoperaConfig }  from './plugin'
import {
  ChatoperaOptions,
  DEFAULT_CHATOPERA_FAQ_BESTREPLY_THRES,
  DEFAULT_CHATOPERA_FAQ_SUGGREPLY_THRES,
}                                 from './chatopera'

function normalizeConfig (config: WechatyChatoperaConfig): ChatoperaOptions {

  const language = config.language

  const clientId = config.clientId
  const secret   = config.secret
  const personalAccessToken = config.personalAccessToken
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

    /* eslint-disable no-console */
    console.log('PLUGIN>> Chatopera default BOT credentials are set.')
  } else {
    console.log('PLUGIN>> Chatopera Personal Access Token is set, would load bots per room for multi tenants.')
    if (clientId && secret) {
      console.log('PLUGIN>> Chatopera default BOT credentials are set.')
    } else {
      console.log('PLUGIN>> WARN Chatopera default BOT credentials are not set.')
    }
    /* eslint-enable no-console */
  }

  return {
    clientId,
    faqBestReplyThreshold,
    faqPath: config.faqPath,
    faqSuggReplyThreshold,
    language,
    personalAccessToken,
    secret,
  }

}

export { normalizeConfig }
