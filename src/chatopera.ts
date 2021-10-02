import { matchers } from 'wechaty-plugin-contrib'

export interface RepoConfig {
  [fullName: string]: string | string[]
}

export interface ChatoperaOptions {
  clientId?          : string,
  secret?            : string,
  faqBestReplyThreshold: number,
  faqSuggReplyThreshold: number,
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

const DEFAULT_WCP_FAQ_BESTREPLY_THRES = 0.8
const DEFAULT_WCP_FAQ_SUGGREPLY_THRES = 0.2

export {
  DEFAULT_WCP_FAQ_BESTREPLY_THRES,
  DEFAULT_WCP_FAQ_SUGGREPLY_THRES,
}
