const routeQuestion = require('../../routeQuestion')
const promptArgs = require('../../promptArgsUtil')
const nameQuestion = require('../../nameQuestion')

const questions = [
  routeQuestion,
  nameQuestion('component')
]
module.exports = {
  prompt: promptArgs(questions, { autoLink: false })
}
