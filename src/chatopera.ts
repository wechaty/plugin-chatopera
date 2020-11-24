import { matchers } from 'wechaty-plugin-contrib'

export interface ChatoperaOptions {
  clientId          : string,
  secret            : string,
  bestScoreThreshold: number,
  suggScoreThreshold: number,
  language?         : matchers.LanguageMatcherOptions,
}

/* eslint-disable camelcase */
export interface ChatoperaResponse {
  state              : string,
  string             : string,
  logic_is_unexpected: boolean,
  logic_is_fallback  : boolean,
  botName            : string,
  service            : {
    provider  : string,
    score?    : number,
    threshold?: number
  }
  faq?: [],
}

export interface ChatoperaFaqResponse {
  id     : string,
  score  : number,
  post   : string,
  replies: [],
}

const DEFAULT_BESTSCORE_THRESHOLD = 0.8
const DEFAULT_SUGGSCORE_THRESHOLD = 0.2

export {
  DEFAULT_BESTSCORE_THRESHOLD,
  DEFAULT_SUGGSCORE_THRESHOLD,
}
