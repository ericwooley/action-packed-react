const debug = require('debug')
const log = debug('apr:promptUtil')
log('test')
module.exports = (questions, { autoLink = true } = {}) => ({ prompter, args }) => {
  if (autoLink) {
    questions = [...questions, { type: 'confirm', message: 'autoLink?', default: true, name: 'autoLink' }]
  }
  const providedArgs = questions.reduce((selectedArgs, question) => {
    if (args[question.name]) {
      const answer = args[question.name]
      selectedArgs[question.name] = answer
    }
    return selectedArgs
  }, {})
  return prompter.prompt(questions.filter(({ name }) => !providedArgs[name])).then(answers => {
    answers = { ...answers, ...providedArgs }
    Object.keys(providedArgs).forEach(k => {
      const question = questions.find(q => q.name === k)
      if (question.validate) {
        const result = question.validate(providedArgs[k], answers)
        if (result === false) {
          process.exitCode = 1
          throw new Error(`${k} is invalid`)
        } else if (typeof result === 'string') {
          process.exitCode = 1
          throw new Error(result)
        }
      }
    })
    log('apr answers', answers)
    // this us used for codemods post gen
    process.send(JSON.stringify({ aprAnswers: answers }))
    return answers
  })
}
