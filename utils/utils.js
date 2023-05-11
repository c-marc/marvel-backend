/** Get rid of falsy (strict:false) or undefined/null (strict:true) entries of an object */
const sanitizeObject = (object, options) => {
  const newObject = {};
  for (k of Object.keys(object)) {
    // if strict: false, skip (get rid of falsy entries)
    if (!options.strict && !object[k]) continue;
    // else just get rid of undefined and null
    if (object[k] == undefined || object[k] === null) continue;
    newObject[k] = object[k];
  }
  return newObject;
};

module.exports = { sanitizeObject };
