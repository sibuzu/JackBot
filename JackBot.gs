var CHANNEL_ACCESS_TOKEN = 'Ocrm1Al9jdzAqRQ6D9oGlB2/';
CHANNEL_ACCESS_TOKEN += 'UqxVaUKpT8iwxUVk1+BnsuH0pBVd83YKJy5+DsUtB1LgRv1qj6olhH1nxSdQEGglRvbf8p/';
CHANNEL_ACCESS_TOKEN += 'AKi4Bqav/+fJPpumTD4kXDoqRTzIBo23Y1GYJ0ErrEI4r8ZahfrwXuQdB04t89/';
CHANNEL_ACCESS_TOKEN += '1O/w1cDnyilFU='

var TELEGRAM_TOKEN = '862133853:AAF0GXHvRM'
TELEGRAM_TOKEN += 'rbqgbOq60rP4tiEamHqIZmSQY'

var ROOT_ID = '942825842'
var DEBUG_MODE = true

function test() {
  cmds = ['txchart', 'all']
  doChart({'id': ROOT_ID}, cmds)
}

//region Get/Post Commands
function doGet(e) { 
  console.log('get2 ', e)
  sticker = e.parameter.sticker
  if (sticker) {
    console.log("sticker: " + sticker);
    broadcastTeleSticker(null, sticker)   
    return ContentService.createTextOutput("send sticker " + sticker)
  }
  chart = e.parameter.chart
  if (chart == 'vx' || chart == 'tx') {
    cmds = [ chart + 'chart', 'all' ]
    doChart({'id': ROOT_ID}, cmds)
    return ContentService.createTextOutput("send " + chart + " all")
  }
  return ContentService.createTextOutput('nothing');
}

function doPost(e) {  
  var msg = JSON.parse(e.postData.contents);
  console.log("contents: " + e.postData.contents)

  if (typeof msg.events != 'undefined') {
    var replyToken = msg.events[0].replyToken;
    var userMessage = msg.events[0].message.text;
    doMyPost(replyToken, userMessage)
  }
  else if (typeof msg.update_id != 'undefined') {
    replyToken = msg.message.from
    userMessage = msg.message.text
    doMyPost(replyToken, userMessage)
  }
}

function isLine(replyToken) {
  return (typeof replyToken == "string")
}

function doMyPost(replyToken, userMessage) {
  
  if (isLine(replyToken)) {
    console.log("replyToken: " + replyToken + ", userMessage: " + userMessage)
  }
  else {
    console.log("replyToken: (" + replyToken.id + "," + replyToken.first_name + "), userMessage: " + userMessage)    
  }
  
  if (typeof replyToken === 'undefined' || userMessage == null) {
    return;
  }
  
  var cmds = userMessage.split(' ').filter(function(i){return i})

  switch (cmds[0].toLowerCase()) {
    case 'help':
    case '/help':
      if (isLine(replyToken)) {
        doLineHelp(replyToken)
      }
      else {
        doTeleHelp(replyToken)
      }
      break;
      
    case '/activate':
      if (!isLine(replyToken)) {
        doAddUser(replyToken)
      }
      break;
      
    case '/deactivate':
      if (!isLine(replyToken)) {
        doRemoveUser(replyToken)
      }
      break;
    
    case '/userlist':
      if (!isLine(replyToken)) {
        doShowUserList(replyToken)
      }
      break;
      
    case 'all':
      doShowAll(replyToken);
      break;
    case 'all2':
      doShowAll2(replyToken);
      break;
    case 'tx':
      doShowTX(replyToken);
      break;
    case 'us':
    case 'vx':
      doShowUS(replyToken);
      break;
    case 'cn':
      doShowCN(replyToken);
      break;
    case 'hdm':
      doShowHDM(replyToken);
      break;
    case 'st':
      doShowTrend(replyToken);
      break;
    case 'vxchart':
    case 'txchart':
      doChart(replyToken, cmds);
      break;
    case '!help':
      if (isLine(replyToken)) {
        doHelp2(replyToken)
      }
      break
    case '!clear':
    case '/clear':
      if (cmds[1] == 'all') doClear(replyToken)
      break
    case '!set':
    case '/set':
      doSetValue(replyToken, cmds[1], cmds[2], true)
      break
    case '!!set':
    case '//set':
      doSetValue(replyToken, cmds[1], cmds[2], false)
      break
    case '!get':
    case '/get':
      doGetValue(replyToken, cmds[1])
      break
    case '!remove':
    case '/remove':
      doRemove(replyToken, cmds[1])
      break
    case '!say':
    case '/say':
      broadcastText(userMessage.substr(5))
      // replyText(replyToken, userMessage.substr(5))
      break
    case '/sticker':
      if (!isLine(replyToken)) {
        broadcastTeleSticker(replyToken, cmds[1])
      }
      break
      
    // tx info
    case 'txinfo':
      doShowTxInfo(replyToken);
      break;
      
    case '!txinfo':
      doSetTxInfo(replyToken, userMessage.substr(8));
      break;
     
    // spread quote 
    case '!spread':
    case '/spread':
      doSpreadQuote(replyToken, userMessage.substr(8));
      break;
     
    // gold
    case 'gold':
      doShowGold(replyToken);
      break;
      
    case '!gold':
      doSetGold(replyToken, userMessage.substr(6));
      break;
      
    // power
    case 'power':
      doShowPower(replyToken);
      break;
    case 'alarm':
      doShowAlarm(replyToken);
      break;
    case '!power':
      doSetPower(replyToken, userMessage.substr(7))
      break
    case '!alarm':
      doSetAlarm(replyToken, userMessage.substr(7))
      break
  }
}

function doTeleHelp(replyToken) {
  replyText(replyToken, 'all  (台指期+VIX+中國部位)\n\
tx (台指期部位)\n\
us (美國部位)\n\
vx (VX部位)\n\
cn (中國部位)\n\
hdm (HDM部位)\n\
st (SuperTrend部位)\n\
txinfo (台指資訊)\n\
gold (黃金價格)\n\
power (今日發電)\n\
alarm (今日太陽能警訊)\n\
/help (說明)\n\
/activate (啟動報價通知)\n\
/deactivate (取消報價通知)\n\
/set <product> <pos> (設定部位)\n\
/get <product> (讀取部位)\n\
/remove <product> (清除部位)\n\
/say (說明)')
}


function doLineHelp(replyToken) {
  replyText(replyToken, 'all  (台指期+VIX+中國部位)\n\
tx (台指期部位)\n\
us (美國部位)\n\
vx (VX部位)\n\
cn (中國部位)\n\
hdm (HDM部位)\n\
st (SuperTrend部位)\n\
txinfo (台指資訊)\n\
gold (黃金價格)\n\
power (今日發電)\n\
alarm (今日太陽能警訊)\n\
!help (進階管理功能說明)');
}

function doHelp2(replyToken) {
  replyText(replyToken, '!set <product> <pos> (設定部位)\n\
!remove <product> (清除部位)\n\
!say <message> (廣播)');
}
//endregion Get/Post Commands

//region Show Commodities
function doShowAll2(replyToken) {
  replyText(replyToken, getPosition());
}

var TX_LIST = ['DAY', 'DAY-Trading1', 'DAY-Trading2', 'DAY-Trading3', 'DAY-Trading4', 'DAY-Trading5', 'DAY2', 'HDM', 'HDM-1', 'HDD', 'HDS', 'WEEK']
var US_LIST = ['VX1', 'VX2', 'VX_結算空', 'VXday']
var CN_LIST = ['J', 'IF300-1', 'IF300-2']
var HDM_LIST = ['HDM', 'HDM-1', 'HDD', 'HDS']
var TREND_LIST = ['MHI', 'MCH', 'CN', 'FGBL', 'FGBM', 'FGBS', 'TXF', 'NQ', 'ES', 'YM', 'GC', 'TU', 'FV', 'TY', 'NK', 'CL', 'rJ', 'rJM', 'rRB', 'rI']

function doShowAll(replyToken) {
  var ALL_LIST = [...TX_LIST, ...US_LIST, ...CN_LIST, ...HDM_LIST]
  ALL_LIST = [...new Set(ALL_LIST)]
  replyText(replyToken, getPosition(ALL_LIST));
}

function doShowTX(replyToken) {
  s = getPosition(TX_LIST)
  s += "\nTOTAL: " + sumPosition(TX_LIST)
  replyText(replyToken, s);
}

function doShowUS(replyToken) {
  s = getPosition(US_LIST)
  s += "\nTOTAL: " + sumPosition(US_LIST)
  replyText(replyToken, s);
}

function doShowCN(replyToken) {
  nameList = []
  replyText(replyToken, getPosition(CN_LIST));
}

function doShowHDM(replyToken) {
  nameList = []
  replyText(replyToken, getPosition(HDM_LIST));
}

function doShowTrend(replyToken) {
  nameList = []
  replyText(replyToken, getPosition(TREND_LIST));
}
//endregion Show Commodities

//region TX Info Session
function doShowTxInfo(replyToken) {
  var prop = PropertiesService.getUserProperties();
  var txinfoStr = prop.getProperty('txinfo');
  console.log('txinfo ' + txinfoStr);
  if (txinfoStr) {
    replyText(replyToken, txinfoStr);
  }
}

function doSetTxInfo(replyToken, txinfoStr) {
  console.log('!txinfo ' + txinfoStr);
  
  var prop = PropertiesService.getUserProperties();
  prop.setProperty('txinfo', txinfoStr);
  
  console.log('BROADCAST: ' + txinfoStr)
  broadcastText(txinfoStr)
  // replyText(replyToken, txinfoStr)
}

// Spread Quote
function doSpreadQuote(replyToken, str) {
  console.log('BROADCAST: ' + str)
  broadcastText(str)
  // replyText(replyToken, str)
}
//endregion TX Info Session

//region Gold Session
function doShowGold(replyToken) {
  var prop = PropertiesService.getUserProperties();
  var goldStr = prop.getProperty('gold');
  console.log('gold ' + goldStr);
  if (goldStr) {
    replyText(replyToken, goldStr);
  }
}

function doSetGold(replyToken, goldStr) {
  console.log('!gold ' + goldStr);
  
  var prop = PropertiesService.getUserProperties();
  prop.setProperty('gold', goldStr);
  
  if (needGoldSummerized()) {
    console.log('BROADCAST: ' + goldStr)
    broadcastText(goldStr)
    // replyText(replyToken, powerStr)
  }
}

function needGoldSummerized() {
  // 若是當天第一次 hour 為 11 時，傳回 true，否則就是 false
  var prop = PropertiesService.getUserProperties();

  var checkHour = 11
  var d = new Date();
  var hour = d.getHours();
  
  key = 'gold_summarized';
  summarized = prop.getProperty(key)
  console.log('gold_summarized: ' + summarized);
  
  if (hour==checkHour) {
    if (!summarized) {
      prop.setProperty(key, 1);
      return true;
    }
  }
  else {
    if (summarized) {
      prop.deleteProperty(key);
    }
  }
  
  return false;
}
//endregion Gold Session

//region Sun Power Session
function doShowPower(replyToken) {
  var prop = PropertiesService.getUserProperties();
  var powerStr = prop.getProperty('power');
  console.log('power ' + powerStr);
  if (powerStr) {
    replyText(replyToken, powerStr);
  }
}

function doShowAlarm(replyToken) {
  var prop = PropertiesService.getUserProperties();
  var alarmStr = prop.getProperty('alarm');
  console.log('alarm ' + alarmStr);
  if (alarmStr) {
    replyText(replyToken, alarmStr);
  }
  else {
    replyText(replyToken, 'no alarm.');
  }
}

function needPowerSummerized() {
  // 若是當天第一次 hour 為 19 時，傳回 true，否則就是 false
  var prop = PropertiesService.getUserProperties();

  var checkHour = 19
  var d = new Date();
  var hour = d.getHours();
  
  key = 'power_summarized';
  summarized = prop.getProperty(key)
  console.log('power_summarized: ' + summarized);
  
  if (hour==checkHour) {
    if (!summarized) {
      prop.setProperty(key, 1);
      return true;
    }
  }
  else {
    if (summarized) {
      prop.deleteProperty(key);
    }
  }
  
  return false;
}

function doSetPower(replyToken, powerStr) {
  console.log('!power ' + powerStr);
  
  var prop = PropertiesService.getUserProperties();
  prop.setProperty('power', powerStr);
  
  if (needPowerSummerized()) {
    console.log('BROADCAST: ' + powerStr)
    broadcastText(powerStr)
    // replyText(replyToken, powerStr)
  }
}

function doSetAlarm(replyToken, alarmStr) {
  console.log('!alarm ' + alarmStr);

  var prop = PropertiesService.getUserProperties();
  var oldStr = prop.getProperty('alarm');
  
  if (alarmStr!=oldStr) {
    prop.setProperty('alarm', alarmStr);
    if (alarmStr) {
      console.log('BROADCAST: ' + alarmStr)
      broadcastText(alarmStr);
      // replyText(replyToken, alarmStr)
    }
  }
}
//endregion Sun Power Session

//region Properties
function doClear(replyToken) {
  replyText(replyToken, '*** ALL DATA ARE CLEARED ***');
  PropertiesService.getUserProperties().deleteAllProperties();
  // if (replyToken != '') replyText(replyToken, 'all positions are cleared');
}


function appendSets(key, value) {
  var lock = LockService.getUserLock();
  try {
    lock.waitLock(3000); // wait 3 seconds for others' use of the code section and lock to stop and then proceed
  } catch (e) {
    console.log('wait 3 seconds for lock and failed');
    return;
  }
  
  var sets = PropertiesService.getUserProperties().getProperty('sets');
  if (sets) {
    sets += ',' + key + ' ' + value;
  }
  else {
    sets = key + ' ' + value;
  }
  PropertiesService.getUserProperties().setProperty('sets', sets);
  console.log("appendSets: " + sets);
  
  lock.releaseLock();
  return;
}

function popSets(key, value) {
  var lock = LockService.getUserLock();
  try {
    lock.waitLock(3000); // wait 3 seconds for others' use of the code section and lock to stop and then proceed
  } catch (e) {
    return false;
  }
  
  var popsets = PropertiesService.getUserProperties().getProperty('sets');
  if (popsets) {
    PropertiesService.getUserProperties().setProperty('sets', '');
    console.log('popSets: ' + popsets);
  }
    
  lock.releaseLock();
  
  if (popsets) {
    kvlist = popsets.split(',').sort();
    sets = [];
    for (var i=0; i<kvlist.length; i++) {
      sets[sets.length] = kvlist[i].split(' ');
    }
    
    return sets;
  }
  else {
    return null;
  }
}

function doSetValue(replyToken, key, value, broadcast) {
  console.log('set ' + key + ' ' + value);
  appendSets(key, value);
  
  Utilities.sleep(3 * 1000);
  
  var sets = popSets();
  if (sets) {
    var msg = ''
    for (var i=0; i<sets.length; i++) {
      if (msg!='') msg += '\n';
      msg += sets[i][0] + ': ' + sets[i][1];
      PropertiesService.getUserProperties().setProperty(sets[i][0], sets[i][1]);
      console.log('doSetValue "' + sets[i][0] + '" "' + sets[i][1] + '"');
    }
    if (broadcast) {
      broadcastText(msg);
    }
  }
}

function doGetValue(replyToken, key) {
  console.log('get ' + key);
  var prop = PropertiesService.getUserProperties();
  var val = prop.getProperty(key)
  replyText(replyToken, val)
}

function doRemove(replyToken, key) {
  console.log('remove ' + key);
  PropertiesService.getUserProperties().deleteProperty(key);
  replyText(replyToken, 'remove ' + key);
}

function getPosition(nameList) {
  var prop = PropertiesService.getUserProperties();
  
  txt = '';
  keys = prop.getKeys().sort();
  
  for(var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var val = prop.getProperty(key);
    
    if (typeof nameList !== 'undefined' && nameList.indexOf(key) < 0) continue;
    if (val == 'undefined') continue;
    if (key == 'userList') continue;
    // console.log("p: " + key + " - " + typeof val + " --- " + val)
    if (txt !== '') txt += '\n';
    txt += key + ': ' + val;
  }
  
  if (txt === '') txt = 'no position data'
  console.log("properties: " + txt);
  return txt
}

function sumPosition(nameList) {
  var prop = PropertiesService.getUserProperties();
  
  total = 0;
  keys = prop.getKeys().sort();
  
  for(var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var val = prop.getProperty(key);
    
    if (typeof nameList !== 'undefined' && nameList.indexOf(key) < 0) continue;
    if (val == 'undefined') continue;
    total += parseInt(val)
  }
  
  tstr = total.toString()
  if (total > 0) {
      tstr = "+" + tstr
  }

  return tstr
}
//endregion Properties

//region ReplyText
function replyText(replyToken, txt) {
  if (!txt) return;

  if (isLine(replyToken)) {
    replyLineText(replyToken, txt)
  }
  else {
    replyTeleText(replyToken, txt)
  }
}

function replyTeleText(replyToken, txt) {
  var url = 'https://api.telegram.org/bot' + TELEGRAM_TOKEN + 
    '/sendMessage?chat_id=' + replyToken.id + '&text=' + encodeURIComponent(txt)
  
  console.log("TG reply: " + url)
  UrlFetchApp.fetch(url)
}

function infoTeleRoot(txt) {
  var url = 'https://api.telegram.org/bot' + TELEGRAM_TOKEN + 
    '/sendMessage?chat_id=' + ROOT_ID + '&text=' + encodeURIComponent(txt)
  
  console.log("ROOT INFO: " + url)
  UrlFetchApp.fetch(url)
}

function replyLineText(replyToken, txt) {
  if (replyToken) {  
    var url = 'https://api.line.me/v2/bot/message/reply';
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': replyToken,
        'messages': [{
          'type': 'text',
          'text': txt,
        }],
      }),
    });
  }
}
//endregion ReplyText

//region Broadcast
function broadcastText(txt) { 
  console.log('broadcast ' + txt)
  if (!txt) return;
  
  // broadcastLineText(txt)
  broadcastTeleText(txt)
}

function broadcastTeleText(txt) {
  var txt2 = encodeURIComponent(txt)

  var prop = PropertiesService.getUserProperties()
  var strUserList = prop.getProperty('userList')
  if (strUserList) {
    var userList = JSON.parse(strUserList)
    
    console.log("TG Broadcast to " + userList.length + " users: " + txt2)
    for (let i = 0 ; i < userList.length; i++) {
      let user = userList[i]

      if (DEBUG_MODE && user.id != ROOT_ID) continue;
      
      // telegram
      var url = 'https://api.telegram.org/bot' + TELEGRAM_TOKEN + 
        '/sendMessage?chat_id=' + user.id + '&text=' + txt2
  
      UrlFetchApp.fetch(url)
    }
  }
}

function broadcastLineText(txt) {
  var url = 'https://api.line.me/v2/bot/message/broadcast';
  UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'messages': [{
        'type': 'text',
        'text': txt,
      }],
    }),
  });
}
//endregion Broadcast

//region Stickers
function getStickerId(sticker) {
  switch (sticker) {
    case 'hello':
      return "CAACAgUAAxkBAAIBQl5gbzCK3oZsYnvGuFKYoAmJLMSZAAICAQACnVS6Dfkn2q5BEiUUGAQ"
    case 'bye':
      return "CAACAgUAAxkBAAIBR15gcSSQEpL0AfChB3rMIR3iUQOtAAKwAAOdVLoNpogVolFIaW4YBA"
    case 'sleep':
      return "CAACAgUAAxkBAAIDQV5qPNcMEtPgV-2PpT2lidAZ7eq0AALCAAOdVLoNVFZ7FATJeCAYBA"
  }
  return null
}

function replyTeleSticker(replyToken, sticker) {
  stickerId = getStickerId(sticker)
  if (stickerId) {
    var payload = {
      "method": "sendSticker",
      "chat_id": replyToken.id,
      "sticker": stickerId    
    }
    var data = {
      "method": "post",
      "payload": payload
    }    
    var url = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/?chat_id=" + replyToken.id
    UrlFetchApp.fetch(url, data)
  }
}

function broadcastTeleSticker(replyToken, sticker) {
  console.log('TG sticker: ' + sticker)

  var prop = PropertiesService.getUserProperties()
  var strUserList = prop.getProperty('userList')
  if (strUserList) {
    var userList = JSON.parse(strUserList)
    
    for (let i = 0 ; i < userList.length; i++) {
      let user = userList[i]
      if (DEBUG_MODE && user.id != ROOT_ID) continue;

      replyTeleSticker(user, sticker)
    }
  }
}
//endregion Stickers

//region SendPhoto
function replyTelePhoto(replyToken, photo) {
  if (photo) {
    var payload = {
      "method": "sendPhoto",
      "chat_id": replyToken.id,
      "photo": photo    
    }
    var data = {
      "method": "post",
      "payload": payload
    }    
    var url = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/?chat_id=" + replyToken.id
    var response = UrlFetchApp.fetch(url, data)
  }
}

function broadcastTelePhoto(replyToken, sticker) {
  console.log('TG sticker: ' + sticker)

  var prop = PropertiesService.getUserProperties()
  var strUserList = prop.getProperty('userList')
  if (strUserList) {
    var userList = JSON.parse(strUserList)
    
    for (let i = 0 ; i < userList.length; i++) {
      let user = userList[i]
      if (DEBUG_MODE && user.id != ROOT_ID) continue;

      replyTelePhoto(user, sticker)
    }
  }
}
//endregion SendPhoto

//region chart
function doChart(replyToken, cmds) {
  console.log('TG chart: ' + cmds[0])
  var prop = PropertiesService.getUserProperties()
  var chatid
  var data
  
  if (cmds.length > 1 && cmds[1] == 'all') {
    console.log(cmds[0] + ' ' + cmds[1])
    if (DEBUG_MODE || true) {
      chatid = ROOT_ID
    }  
    else {
      var strUserList = prop.getProperty('userList')
      if (strUserList) {
        var userList = JSON.parse(strUserList)
        chatid = userList.map(function(x){return x.id}).join(',')
      }
    }
  }
  else {
    chatid = replyToken.id
  }
  
  console.log('chatid', chatid)
  if (!chatid) return
  
  switch (cmds[0]) {
    case 'vxchart':
      data = prop.getProperty('vxdata')
      break
    case 'txchart':
      data = prop.getProperty('txdata')
      break
  }
  console.log('data', data)
  if (!data) return
  
  url = 'http://solarsuna.com:8008/vxchart?chatid=' + chatid + '&data=' + data
  console.log('chart url', url)
  UrlFetchApp.fetch(url)
}
//endregion chart

//region Users
function getUser(userList, user) {
  var indexOfUser = userList.findIndex(x => x.id === user.id)
  return indexOfUser
}

function doAddUser(replyToken) {
  msg = "add user: (" + replyToken.id + "," + replyToken.first_name + ")"
  console.log(msg)
  infoTeleRoot(msg)

  var prop = PropertiesService.getUserProperties();
  var strUserList = prop.getProperty('userList')
  var userList = []
  
  if (strUserList) {
    userList = JSON.parse(strUserList)
  }

  if (getUser(userList, replyToken)<0) { 
    userList.push(replyToken)
    prop.setProperty('userList', JSON.stringify(userList))
    replyText(replyToken, "user " + replyToken.first_name + " activated")
  }
}

function doRemoveUser(replyToken) {
  console.log("remove user: (" + replyToken.id + "," + replyToken.first_name + ")")

  var prop = PropertiesService.getUserProperties();
  var strUserList = prop.getProperty('userList')
  
  if (strUserList) {
    userList = JSON.parse(strUserList)
    var index = getUser(userList, replyToken)
    if (index>=0) {
      userList.pop
      userList.splice(index, 1)
      prop.setProperty('userList', JSON.stringify(userList))
      replyText(replyToken, "user " + replyToken.first_name + " deactivated")
    }
  }
}

function doShowUserList(replyToken) {
  
  var prop = PropertiesService.getUserProperties();
  var strUserList = prop.getProperty('userList')
  
  console.log("userList: " + strUserList)
  if (strUserList) {
    userList = JSON.parse(strUserList)
    
    msg = ""
    for(let i = 0 ; i < userList.length; i++) {
      let user = userList[i]
      if (msg) msg += '\n'
      msg += user.id + ", " + user.first_name
    }
    console.log("user list: " + msg)
    replyText(replyToken, msg)
  }
}
//endregion Users
