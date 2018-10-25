const Papa = require("papaparse")
const fs = require('fs')
const _ = require('lodash')

module.exports = () => {
  const csvFile = fs.readFileSync(__dirname + '/data/mem_students.csv', 'utf8')
  const parseResult = Papa.parse(csvFile).data
  const result = []
  Object.keys(parseResult).forEach(key => {
    const item = parseResult[key]
    result.push({
      class: item[0],
      no: item[2],
      name: item[3],
      gender: item[4],
      email: item[5]
    })
  })
  return result
}

