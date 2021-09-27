import { WechatyChatoperaConfig }  from './plugin'
import {
  ChatoperaOptions,
  DEFAULT_BESTSCORE_THRESHOLD,
  DEFAULT_SUGGSCORE_THRESHOLD,
}                                 from './chatopera'

function normalizeConfig (config: WechatyChatoperaConfig): ChatoperaOptions {

  const CHATOPERA_CLIENTID = 'CHATOPERA_CLIENTID'
  const CHATOPERA_SECRET   = 'CHATOPERA_SECRET'

  const CHATOPERA_BESTSCORE_THRESHOLD   = 'CHATOPERA_BEST_REPLY_THRES'
  const CHATOPERA_SUGGSCORE_THRESHOLD   = 'CHATOPERA_SUGG_REPLY_THRES'

  const language = config.language

  let clientId = config.clientId
  let secret   = config.secret
  let bestScoreThreshold = config.bestScoreThreshold
  let suggScoreThreshold = config.suggScoreThreshold

  if (!clientId)     { clientId     = process.env[CHATOPERA_CLIENTID]       }
  if (!secret) { secret = process.env[CHATOPERA_SECRET]  }

  if (!bestScoreThreshold) {
    const threshold = process.env[CHATOPERA_BESTSCORE_THRESHOLD]
    if (threshold) {
      bestScoreThreshold = parseFloat(threshold)
    } else {
      bestScoreThreshold = DEFAULT_BESTSCORE_THRESHOLD
    }
  }

  if (!suggScoreThreshold) {
    const threshold = process.env[CHATOPERA_SUGGSCORE_THRESHOLD]
    if (threshold) {
      suggScoreThreshold = parseFloat(threshold)
    } else {
      suggScoreThreshold = DEFAULT_SUGGSCORE_THRESHOLD
    }
  }

  if (!clientId) {
    throw new Error(`
      Wechaty Chatopera Plugin requires ClientId for authorization.
      Please set ${CHATOPERA_CLIENTID} environment variable,
      or set 'clientId' in plugin config.
    `)
  }

  if (!secret) {
    throw new Error(`
      Wechaty Chatopera Plugin requires Chatopera Secret.
      Please set ${CHATOPERA_SECRET} environment variable,
      or set 'secret' in plugin config.
    `)
  }

  return {
    bestScoreThreshold,
    clientId,
    language,
    secret,
    suggScoreThreshold,
  }

}

export { normalizeConfig }
