const promptArgs = require('../../promptArgsUtil')
const nameQuestion = require('../../nameQuestion')

const questions = [nameQuestion('ui component')]
module.exports = {
  prompt: promptArgs(questions, { autoLink: false })
}
