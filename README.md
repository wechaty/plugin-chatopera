# WECHATY-CHATOPERA

## INTRODUCTION

## REQUIREMENTS

1. Node.js v12+
1. Wechaty v0.40+
1. This Chatopera Plugin

## USAGE

To use the plugin:

```ts
import { WechatyChatopera } from 'wechaty-chatopera'

const config = {
  /**
   * Chatopera Service ID
   */
  clientId: "5fbcb0afcad362001b4e3b12",
  secret: "c03e26976ac9aed372953b48f55d09f9",
}

const ChatoperaPlugin = WechatyChatopera(config)

const wechaty = new Wechaty()
wechaty.use(ChatoperaPlugin)
```

### 1 Configure Chatopera

### 2 Language of Questions & Score of Answers

### 3 Matchers & Skipper

## ENVIRONMENT VARIABLES

## HISTORY

### develop

### v0.1 (Nov 24, 2020)

1. Add Basic Plugin for Chatopera
2. Enabel Wechaty with Chatopera

## AUTHOR

[吴京京](https://github.com/wj-Mcat), Author of Python-wechaty & NLP Researcher, \<wjmcater@gmail.com\>

## COPYRIGHT & LICENSE

- Code & Docs © 2020 wj-Mcat \<wjmcater@gmail.com\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
