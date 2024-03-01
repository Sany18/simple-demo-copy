// // .log
// const ignoreConsoleMessages = [
//   'Running "main" with'
// ]
// const origLog = console.log
// console.log = (...params) => (
//   typeof params[0] === 'string' &&
//   ignoreConsoleMessages.reduce((acc, i) => acc + ~params[0].indexOf(i), 0) ? null : origLog(...params)
// )

// // .warn
// const ignoreWarningMessages = [
//   'Unrecognized feature'
// ]
// const origWarn = console.warn
// console.warn = (...params) => (
//   typeof params[0] === 'string' &&
//   ignoreWarningMessages.reduce((acc, i) => acc + ~params[0].indexOf(i), 0) ? null : origWarn(...params)
// )
