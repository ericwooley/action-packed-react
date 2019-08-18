const routeQuestion = require('../../routeQuestion')
const promptArgs = require('../../promptArgsUtil')
const nameQuestion = require('../../nameQuestion')

const questions = [
  routeQuestion,
  nameQuestion('ui component')
]
module.exports = {
  prompt: promptArgs(questions)
}
