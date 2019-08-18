module.exports = questions => ({ prompter, args }) => {
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
          throw new Error(`${k} is invalid`)
        } else if (typeof result === 'string') {
          throw new Error(result)
        }
      }
    })
    return answers
  })
}
