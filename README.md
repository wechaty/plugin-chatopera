# WECHATY-CHATOPERA

## INTRODUCTION

Wechaty Chatopera Plugin helps you to answer questions in WeChat with the power of <https://Chatopera.ai>.

![Chatopera for Wechaty Community Knowledge Base](docs/images/qnamaker-screenshot.png)

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

1. `endpointKey`: Endpoint Key for Chatopera.ai
1. `knowledgeBaseId`: Knowledge Base ID for your knowledge base (KB)
1. `resourceName`: Resource Name for your Cognitive Service. (for example, `wechaty` is the Resource Name for `https://wechaty.azurewebsites.net`)

### 2 Language of Questions & Score of Answers

1. `config.language`: If set to a language ('chinese', 'english', etc), then the plugin will only reply message text in that specified language. (default: match all languages)
1. `config.scoreThreshold`: If the answer from Chatopera.ai service has a score below the `scoreThreshold`, then that answer will not be used. (A perfect score is `100`)

### 3 Matchers & Skipper

1. `config.contact`: Whether to allow direct message to be sync with ticket reply. `false` to deny all, `true` for allow all; Supports contact id(`string`) and contact name(`RegExp`). You can also mix them in array.
1. `config.room`: The room id of your service WeChat room.
1. `config.mention`: Whether require the message mention the bot.
1. `config.skipMessage`: If set it to `string` or `RegExp`, then the message text that match the config will not be processed by the plugin. Array supported.

## ENVIRONMENT VARIABLES

The following two environment variables will be used if the required information is not provided by the config.

### 1 `WECHATY_PLUGIN_QNAMAKER_ENDPOINT_KEY`

`process.env.WECHATY_PLUGIN_QNAMAKER_ENDPOINT_KEY` will be used if the `config.endpointKey` is not provided.

### 2 `WECHATY_PLUGIN_QNAMAKER_KNOWLEDGE_BASE_ID`

`process.env.WECHATY_PLUGIN_QNAMAKER_KNOWLEDGE_BASE_ID` will be used if the `config.knowledgeBaseId` is not provided.

### 3 `WECHATY_PLUGIN_QNAMAKER_RESOURCE_NAME`

`process.env.WECHATY_PLUGIN_QNAMAKER_RESOURCE_NAME` will be used if the `config.resourceName` is not provided.

## EXAMPLE

Our Friday BOT are using `wechaty-qnamaker` to connect our WeChat conversations with Chatopera.

1. Source Code - You can read the source code from: <https://github.com/wechaty/friday/blob/master/src/plugins/qnamaker.ts>
1. Spreadsheets - You can read our Question & Answer Pairs for Wechaty Community from: <https://docs.google.com/spreadsheets/d/14o7ytbZDRyX53nn8F4VohBgzAP6pMnCRPWFFzdcyzxc/edit>

> Note: our question & answer pairs sheet are open to edit. Please feel free to add question & answer pair if you believe it's necessary, and thank you for your contribution!

## RESOURCES

- [Quickstart: Test knowledge base with batch questions and expected answers](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/quickstarts/batch-testing)

## HISTORY

### master

### v0.6 (Aut 5, 2020)

1. Add Vorpal command: `faq`
1. Rename `minScore` to `scoreThreshold` in `configOptions`.

### v0.4 (July 23, 2020)

1. Rename from `wechaty-plugin-qnamaker` to `wechaty-qnamaker`

### v0.2 (June 29, 2020)

1. Init code base
1. Chatopera integration
1. Add Language Detecter to limit the plugin to only answer a specific language(s)


## AUTHOR

[吴京京](https://github.com/wj-Mcat), Author of Python-wechaty & NLP Researcher, \<wjmcater@gmail.com\>

## COPYRIGHT & LICENSE

- Code & Docs © 2020 wj-Mcat \<wjmcater@gmail.com\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
