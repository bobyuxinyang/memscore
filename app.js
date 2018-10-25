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

const getAllStudents = require('./getAllStudents')

const getScores = async () => {
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
      // console.log('scores: ', scores)      
      existedStudent[0].scores = scores
      existedStudent[0].updateAt = timestamp
    }   
  })

  return allStudents
}

const run = async () => {
  console.log((await getScores())[269])
}

run()

