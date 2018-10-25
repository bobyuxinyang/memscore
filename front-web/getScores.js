const memscore = require('./mem/lib/memscore')

module.exports = async () => {  
  const x = await memscore()
  console.log(x)
  return x
}