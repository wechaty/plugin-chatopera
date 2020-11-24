import { WechatyChatoperaConfig }  from './plugin'
import {
  ChatoperaOptions,
  DEFAULT_BESTSCORE_THRESHOLD,
  DEFAULT_SUGGSCORE_THRESHOLD
}                                 from './chatopera'

function normalizeConfig (config: WechatyChatoperaConfig): ChatoperaOptions {

  const WECHATY_PLUGIN_CHATOPERA_CLIENTID = 'WECHATY_PLUGIN_CHATOPERA_CLIENTID'
  const WECHATY_PLUGIN_CHATOPERA_SECRET   = 'WECHATY_PLUGIN_CHATOPERA_SECRET'

  const WECHATY_PLUGIN_CHATOPERA_BESTSCORE_THRESHOLD   = 'WECHATY_PLUGIN_CHATOPERA_BESTSCORE_THRESHOLD'
  const WECHATY_PLUGIN_CHATOPERA_SUGGSCORE_THRESHOLD   = 'WECHATY_PLUGIN_CHATOPERA_SUGGSCORE_THRESHOLD'

  const language = config.language

  let clientId = config.clientId
  let secret   = config.secret
  let bestScoreThreshold = config.bestScoreThreshold
  let suggScoreThreshold = config.suggScoreThreshold

  if (!clientId)     { clientId     = process.env[WECHATY_PLUGIN_CHATOPERA_CLIENTID]       }
  if (!secret) { secret = process.env[WECHATY_PLUGIN_CHATOPERA_SECRET]  }

  if (!bestScoreThreshold) {
    const threshold = process.env[WECHATY_PLUGIN_CHATOPERA_BESTSCORE_THRESHOLD]
    if (threshold) {
      bestScoreThreshold = parseFloat(threshold)  
    } else {
      bestScoreThreshold = DEFAULT_BESTSCORE_THRESHOLD
    }
  }

  if (!suggScoreThreshold) {
    const threshold = process.env[WECHATY_PLUGIN_CHATOPERA_SUGGSCORE_THRESHOLD]
    if (threshold) {
      suggScoreThreshold = parseFloat(threshold)
    } else {
      suggScoreThreshold = DEFAULT_SUGGSCORE_THRESHOLD
    }
  }

  if (!clientId) {
    throw new Error(`
      Wechaty Chatopera Plugin requires ClientId for authorization.
      Please set ${WECHATY_PLUGIN_CHATOPERA_CLIENTID} environment variable,
      or set 'clientId' in plugin config.
    `)
  }

  if (!secret) {
    throw new Error(`
      Wechaty Chatopera Plugin requires Chatopera Secret.
      Please set ${WECHATY_PLUGIN_CHATOPERA_SECRET} environment variable,
      or set 'secret' in plugin config.
    `)
  }

  return {
    clientId,
    secret,
    bestScoreThreshold,
    suggScoreThreshold,
    language,
  }

}

export { normalizeConfig }
