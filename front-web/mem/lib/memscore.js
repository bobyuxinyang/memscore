const getMemscore = require('./getMemscore')

const resolveScoresFromSourceText = (sourceText) => {
    // match and get scores
    const scoreReg = /{{memscore\|\d+\|\d+}}/
    const matchRes = scoreReg.exec(sourceText)
    // console.log(matchRes)
    if (matchRes) {
      const matchStr = matchRes[0]
      return scores = matchStr.substring(2, matchStr.length - 2).split('|').splice(1)
    }
    return null
}

const resolveSignsFromSourceText = (sourceText) => {
  const signUserList = []
  const reg = /\[\[User:.*?\|.*?\]\] \(\[\[User talk:.*?\|talk\]\]\) .*\(...\)/g
  const match = sourceText.match(reg)
  if (match) {
    match.forEach(signText => {
      const userMatch = /User:(.*?)\|/.exec(signText)
      if (userMatch) {
        signUserList.push(userMatch[1])
      }
    })
  }
  return signUserList
}

const getAllStudents = require('./getAllStudents')

module.exports = async () => {
  const scroes = await getMemscore()

  const allStudents = getAllStudents()

  // console.log('all students: ', allStudents)

  scroes.forEach(score => {
    const { text, title, timestamp } = score
    // console.log(text)

    // get username
    const username = title
    // console.log('username: ', username)

    const existedStudent = allStudents.filter(item => item.email.toLowerCase() === username.toLowerCase())
    if (existedStudent.length > 0) {
      // get scores
      const scores = resolveScoresFromSourceText(text)

      const signUserList = resolveSignsFromSourceText(text)

      // console.log('scores: ', scores)      
      existedStudent[0].score1 = scores[0]
      existedStudent[0].score2 = scores[1]
      existedStudent[0].updateAt = timestamp
      existedStudent[0].signUserList = signUserList
    }   
  })

  return allStudents
}
