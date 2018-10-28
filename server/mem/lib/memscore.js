const getMemscore = require('./getMemscore')
const getAllStudents = require('./getAllStudents')

const allStudents = getAllStudents()

// 正则从打分template中匹配出分数
const resolveScoresFromSourceText = (sourceText) => {
    // match and get scores
    const scoreReg = /{{memscore\|(\d+)\|(\d+)}}/
    const matchRes = sourceText.match(scoreReg)
    // console.log(matchRes)
    if (matchRes) {
      return scores = [matchRes[1], matchRes[2]]
    }
    return null
}

const resolveUserDetail = (signText) => {
  const timestamp = signText.substr(signText.length - 28, signText.length)
  const userMatch = /User:(.*?)\|/.exec(signText)
  if (!userMatch) {
    return null
  }
  let email = userMatch[1]
  const result = {
    email: email.toLowerCase(),
    isTa: true,
    class: 'mem_ta',
    name: '',
    timestamp,
  }
  if (email.indexOf(' ') > 0) {
    // console.log('found space in email: ', email)
    email = email.replace(' ', '_')
  }
  const classStudents = allStudents.filter(
    item => item.email.toLowerCase() === email.toLowerCase()
  )
  if (classStudents.length > 0) {
    result.class = classStudents[0].class
    result.isTa = false
    result.name = classStudents[0].name
  }
  if (result.name === '宋丹丹' || result.name === '陈晋砾') {
    result.isTa = true
  }
  return result
}

// 正则匹配出签名的email
const resolveSignsFromSourceText = (sourceText) => {
  const signUserList = []
  const reg = /\[\[User:.*?\|.*?\]\] \(\[\[User talk:.*?\|talk\]\]\) .*\(...\)/g
  const match = sourceText.match(reg)
  if (match) {
    match.forEach(signText => {
      const signUser = resolveUserDetail(signText)
      if (signUser) {
        signUserList.push(signUser)
      }
    })
  }
  return signUserList
}

module.exports = async () => {
  const scroes = await getMemscore()

  // console.log('all students: ', allStudents)

  scroes.forEach(score => {
    const { text, title, timestamp } = score
    // console.log(text)

    // get username
    let username = title
    if (username.indexOf(' ') > 0) {
      // console.log('found space in username: ', username)
      username = username.replace(' ', '_')
    }
    // console.log('username: ', username)

    const existedStudent = allStudents.filter(item =>
      item.email.toLowerCase() === username.toLowerCase()
      || item.name === username.toLowerCase()
    )
    if (existedStudent.length > 0) {
      // get scores
      const scores = resolveScoresFromSourceText(text)
      if (scores) {
        // console.log('scores: ', scores)
        existedStudent[0].score1 = scores[0]
        existedStudent[0].score2 = scores[1]
      }

      const signUserList = resolveSignsFromSourceText(text)
      if (signUserList.length > 0) {
        existedStudent[0].signUserList = signUserList
      }

      existedStudent[0].updateAt = timestamp
    }
  })

  allStudents.forEach(item => {
    let flag = true
    let messages = []

    if (item.signUserList) {
      // 自己签名数量
      const selfCount = item.signUserList.filter(user =>
        user.email.toLowerCase() === item.email.toLowerCase()
        || user.email.replace(' ', '_').toLowerCase() === item.email.toLowerCase()
      ).length

      // 助教签名数量
      const taCount = item.signUserList.filter(user => user.isTa).length

      // 本班成员签名数量
      const classCount = item.signUserList.filter(user =>
        user.class === item.class
        && (user.email.toLowerCase() !== item.email.toLowerCase()
          || user.email.replace(' ', '_').toLowerCase() !== item.email.toLowerCase() )
        && user.class !== 'mem_ta'
      ).length

      // 非本班成员签名数量
      const nonClassCount = item.signUserList.filter(user =>
        user.class !== item.class
        && user.class !== 'mem_ta'
      ).length

      messages.push({
        status: selfCount >= 1 ? 'ok' : 'failed',
        msg: `需要获得自己的签名(${selfCount}/1)`
      })
      messages.push({
        status: taCount >= 1 ? 'ok' : 'failed',
        msg: `需要获得至少1名助教的签名(${taCount}/1)`
      })
      messages.push({
        status: classCount >= 5 ? 'ok' : 'failed',
        msg: `至少需要获得5名本班成员的签名(${classCount}/5)`
      })
      messages.push({
        status: nonClassCount >= 1 ? 'ok' : 'failed',
        msg: `至少需要获得1名非本班成员签名(${nonClassCount}/1)`
      })
      flag = flag
        && selfCount >=1
        && taCount >= 1
        && classCount >= 5
        && nonClassCount >= 1
    } else {
      flag = false
    }

    // 两个分数都要有值
    if (!item.score1 || !item.score2) {
      flag = false
      messages.push({status: 'failed', msg: '自评分数不完整'})
    }
    item.status = flag ? 'ok' : 'failed'
    item.messages = messages
  })

  return allStudents.filter(item => item.class !== 'mem_ta')
}
