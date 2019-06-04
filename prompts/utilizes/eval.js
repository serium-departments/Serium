const vm2 = require('vm2')

const {VM} = vm2

const Prompt = (message, client) => {
  const startedAt = Date.now()
  const resultEmbed = {
    embed: {
      title: 'Evaluation',
      description: null,
      fields: [
        {
          name: '구문',
          value: '```javascript\n' + (message._se.data.join(' ') || 'undefined') + '\n```'
        },
        {
          name: '결과',
          value: null
        }
      ]
    }
  }

  try {
    const virtualEnvironment = new VM({
      timeout: 1000 * 2,
      sandbox: {
        seia: {
          isKawaii: true
        }
      }
    })
    const result = virtualEnvironment.run(message._se.data.join(' '))

    resultEmbed.embed.fields[1].value = '```javascript\n' + (result || 'undefined').toString().split('').slice(0, 2000).join('') + ' ```'
  } catch (error) {
    resultEmbed.embed.fields[1].value = '```javascript\n' + (error || 'undefined') + ' ```'
  }

  resultEmbed.embed.description = `JavaScript 실행에 ${new Date(Date.now() - startedAt).getMilliseconds()}ms가 소요되었어요.`
  message.channel.send(resultEmbed)
}
const Properties = {
  name: 'eval',
  description: '앱에서 간단한 JavaScript를 실행합니다. *개발자를 위해, 개발자가.*',
  eval: 'eval [코드]',

  requiredPermission: 'public'
}

module.exports = Prompt
module.exports.properties = Properties
