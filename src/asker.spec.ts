// #!/usr/bin/env ts-node

// import test  from 'tstest'

// import { asker } from './asker.js'
// import { normalizeConfig } from './normalize-config.js'

// test('asker()', async t => {
//   // use our normalizeConfig() helper function to get the config:

//   const config = normalizeConfig({})
//   const ask = asker(config)

//   let answers = await ask('wechaty', 'test-user-id')
//   t.true(answers[0].answer, 'should get answer back: ' + answers[0].answer)

//   answers = await ask('中文', 'test-user-id')
//   t.equal(answers.length, 0, 'should get no answer for 中文')
// })
