// eslint-disable-next-line no-unused-vars
function doGet(e) {
  if (!e.parameter || !e.parameter.uuid) {
    return sendError(`UUID tidak ada, bukan main`)
  }

  // periksa apakah uuid telah dikeluarkan sebelumnya
  const uuid = e.parameter.uuid
  const ss = SpreadsheetApp.openById('1y39Ffg9xcpGW-bjp-P9asZLlVbcrifkINXerh0F6MuM')
  const timesheet = ss.getSheetByName('TimeSheet')
  let uuids = timesheet.getRange('A2:A').getValues().flat()
  uuids = uuids.filter((u) => u === uuid)
  if (uuids.length === 0) {
    return sendError(`UUID "${uuid}" tidak dapat dikenali, untuk lebih lengkap hubungi admin`)
  }

  // // periksa apakah formulir dengan uuid telah dimulai sebelumnya
  // if (uuids.length > 1) {
  //   return sendError(`UUID "${uuid}" sudah ada, untuk lebih lengkap hubungi admin`)
  // }
  updateServer(uuid, 'started form')
  const htmlTemplate = HtmlService.createTemplateFromFile('index')
  htmlTemplate.serverData = { timeAlloted: '00:20:00' }
  const htmlOutput = htmlTemplate.evaluate()
  return htmlOutput
}

function sendError(message) {
  const htmlTemplate = HtmlService.createTemplateFromFile('error')
  htmlTemplate.serverData = { error: message }
  const htmlOutput = htmlTemplate.evaluate()
  return htmlOutput
}

function genFormUrl() {
  const webappUrl = 'https://script.google.com/macros/s/AKfycbwo4447v_wxw_k4D-HKez8LpqlJvEuXmOtv6lGpnaCb7LbxQRxqDzJYUlxiQsnumaxU/exec'
  const uuid = Utilities.getUuid()
  updateServer(uuid, 'Created Form')
  console.log(webappUrl + `?uuid=${uuid}`)
}

function updateServer(uuid, event) {
  const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MM/dd/yyyy HH:mm:ss')
  const ss = SpreadsheetApp.openById('1y39Ffg9xcpGW-bjp-P9asZLlVbcrifkINXerh0F6MuM')
  const timesheet = ss.getSheetByName('TimeSheet')
  timesheet.appendRow([uuid, now, event])
  SpreadsheetApp.flush()
  if (event === 'Submited the form') {
    return `Terimakasih! Jawaban anda akan terkirim ke email anda`
  }
}       