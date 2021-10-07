<div align=right>

[Chatopera Home](https://bot.chatopera.com/)　|　[Chatopera Docs](https://docs.chatopera.com)　|　[Wechaty Docs](https://wechaty.js.org/)　|　[Help](https://github.com/wechaty/wechaty-chatopera/issues)

</div>

# WECHATY-CHATOPERA

## INTRODUCTION

Bring your bots into Wechat with Wechaty Chatopera Plugin.

![img](./docs/assets/1.png)

## REQUIREMENTS

1. Node.js v16+
2. NPM v7+
3. Wechaty v0.68+
4. Chatopera Plugin

## USAGE

To use the plugin:

```ts
import { WechatyChatopera } from "wechaty-chatopera";

const config = {
  /**
   * Chatopera Service ID
   */
  clientId: "YOUR_CLIENTID",
  secret: "YOUR_SECRET",
  personalAccessToken: "YOUR_PERSONAL_ACCESS_TOKEN",
  faqBestReplyThreshold: 0.8,
  faqSuggReplyThreshold: 0.2
  repoConfig: {}
};

const ChatoperaPlugin = WechatyChatopera(config);

const wechaty = new Wechaty();
wechaty.use(ChatoperaPlugin);
```

In `config`, either {`personalAccessToken`, `repoConfig`} or {`clientId`, `secret`} must be present.

Chatopera BOT of `clientId` would response as the global bot for all groups and private chats.

When `personalAccessToken` and `repoConfig` are added, the rooms defined by repoConfig would response with the bot that mapping with names. Check out [apache.ts](https://github.com/kaiyuanshe/osschat/blob/main/src/config-projects/apache.ts) and [asker.ts](https://github.com/wechaty/wechaty-chatopera/blob/0b59ec4dc90787718722c19340c978f33def3762/src/asker.ts#L66) to learn the `repoConfig` schema. Rooms are not belong to any repo, it would route to `clientId` BOT.

If both `personalAccessToken` and `clientId` are not present, Wechaty Chatopera Plugin would throw an error.

### 1 Configure Chatopera

[Chatopera 云服务](https://bot.chatopera.com)是开发者友好的低代码上线智能对话机器人的云服务。

<details>
<summary>展开查看 Chatopera 云服务的产品截图</summary>
<p>

<p align="center">
  <b>自定义词典</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530072-da92d600-d33e-11e9-8656-01c26caff4f9.png" width="800">
</p>

<p align="center">
  <b>自定义词条</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530091-e41c3e00-d33e-11e9-9704-c07a2a02b84e.png" width="800">
</p>

<p align="center">
  <b>创建意图</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530169-12018280-d33f-11e9-93b4-9db881cf4dd5.png" width="800">
</p>

<p align="center">
  <b>添加说法和槽位</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530187-20e83500-d33f-11e9-87ec-a0241e3dac4d.png" width="800">
</p>

<p align="center">
  <b>训练模型</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530235-33626e80-d33f-11e9-8d07-fa3ae417fd5d.png" width="800">
</p>

<p align="center">
  <b>测试对话</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530253-3d846d00-d33f-11e9-81ea-86e6d47020d8.png" width="800">
</p>

<p align="center">
  <b>机器人画像</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530312-6442a380-d33f-11e9-869c-85fb6a835a97.png" width="800">
</p>

<p align="center">
  <b>系统集成</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530281-4ecd7980-d33f-11e9-8def-c53251f30138.png" width="800">
</p>

<p align="center">
  <b>聊天历史</b><br>
  <img src="https://static-public.chatopera.com/assets/images/64530295-5856e180-d33f-11e9-94d4-db50481b2d8e.png" width="800">
</p>

</p>
</details>

<p align="center">
  <b>立即使用</b><br>
  <a href="https://bot.chatopera.com" target="_blank">
      <img src="https://static-public.chatopera.com/assets/images/64531083-3199aa80-d341-11e9-86cd-3a3ed860b14b.png" width="800">
  </a>
</p>

### 2 Language of Questions & Score of Answers

### 3 Matchers & Skipper

## ENVIRONMENT VARIABLES

## CONTR

```bash
npm run dist
npm publish
```

## HISTORY

### develop

### v0.1 (Nov 24, 2020)

1. Add Basic Plugin for Chatopera
2. Enabel Wechaty with Chatopera

## AUTHOR

- [吴京京](https://github.com/wj-Mcat), Author of Python-wechaty & NLP Researcher, \<wjmcater@gmail.com\>
- [Chatopera Developers](https://github.com/chatopera), 低代码上线智能对话机器人 \<info@chatopera.com\>

## COPYRIGHT & LICENSE

- Code & Docs © 2020 wj-Mcat \<wjmcater@gmail.com\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
- Copyright (2021) <a href="https://www.chatopera.com/" target="_blank">北京华夏春松科技有限公司</a>

[Apache License Version 2.0](./LICENSE)

[![chatoper banner][co-banner-image]][co-url]

[co-banner-image]: ./docs/assets/42383104-da925942-8168-11e8-8195-868d5fcec170.png
[co-url]: https://www.chatopera.com
