#!/usr/bin/env ts-node
import {
  WechatyChatopera,
  VERSION,
}                     from 'wechaty-chatopera'

async function main () {
  const ChatoperaPlugin = WechatyChatopera({} as any)
  void ChatoperaPlugin

  if (VERSION === '0.0.0') {
    throw new Error('version should be set before publishing')
  }

  return 0
}

main()
  .then(process.exit)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
