function deepCombineObject (obj1, obj2) {
  let resultObj = {}
  Object.keys(obj1).forEach(key => {
    if (!Array.isArray(obj1[key]) && typeof obj1[key] === 'object') {
      // 对象
      if (obj2[key] === undefined) {
        resultObj[key] = obj1[key]
      } else {
        resultObj[key] = deepCombineObject(obj1[key], obj2[key])
      }
    } else {
      // 数组或者普通属性
      resultObj[key] = obj1[key]
    }
  })
  Object.keys(obj2).forEach(key => {
    if (Array.isArray(obj2[key])) {
      resultObj[key] = resultObj[key] === undefined ? resultObj[key] = obj2[key] : resultObj[key].concat(obj2[key])
    } else if (typeof obj2[key] === 'object' && resultObj[key] === undefined) {
      resultObj[key] = obj2[key]
    } else if (typeof obj2[key] !== 'object'){
      resultObj[key] = obj2[key]
    }
  })
  return resultObj
}

module.exports.deepCombineObject = deepCombineObject
