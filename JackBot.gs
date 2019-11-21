var CHANNEL_ACCESS_TOKEN = 'Ocrm1Al9jdzAqRQ6D9oGlB2/';
CHANNEL_ACCESS_TOKEN += 'UqxVaUKpT8iwxUVk1+BnsuH0pBVd83YKJy5+DsUtB1LgRv1qj6olhH1nxSdQEGglRvbf8p/';
CHANNEL_ACCESS_TOKEN += 'AKi4Bqav/+fJPpumTD4kXDoqRTzIBo23Y1GYJ0ErrEI4r8ZahfrwXuQdB04t89/';
CHANNEL_ACCESS_TOKEN += '1O/w1cDnyilFU='

function doPost(e) {  
  var msg = JSON.parse(e.postData.contents);
  console.log("contents: " + e.postData.contents);

  var replyToken = msg.events[0].replyToken;
  var userMessage = msg.events[0].message.text;

  if (typeof replyToken === 'undefined' || userMessage == null) {
    return;
  }
  
  var cmds = userMessage.split(' ').filter(function(i){return i})

  switch (cmds[0].toLowerCase()) {
    case 'help':
    case 'status':
      doHelp(replyToken);
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
    case 'vx':
      doShowVX(replyToken);
      break;
    case 'cn':
      doShowCN(replyToken);
      break;
    case 'st':
      doShowTrend(replyToken);
      break;
    case '!help':
      doHelp2(replyToken)
      break
    case '!clear':
      if (cmds[1] == 'all') doClear(replyToken)
      break
    case '!set':
      doSet(replyToken, cmds[1], cmds[2], true)
      break
    case '!!set':
      doSet(replyToken, cmds[1], cmds[2], false)
      break
    case '!remove':
      doRemove(replyToken, cmds[1])
      break
    case '!say':
      broadcastText(cmds[1])
      break
    case '!sticker':
      broadcastSticker(cmds[1])
      break
      
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

function doHelp(replyToken) {
  replyText(replyToken, 'all  (台指期+VIX+中國部位)\n\
tx (台指期部位)\n\
vx (VIX部位)\n\
cn (中國部位)\n\
st (SuperTrend部位)\n\
st (SuperTrend部位)\n\
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

function doShowAll2(replyToken) {
  replyText(replyToken, getPosition());
}

function doShowAll(replyToken) {
  nameList = ['DAY', 'DAY2', 'DAY3', 'HDM', 'WEEK', 'WEEK1', 'VX', 'VX1', 'TVIX', 'J', 'HSI']
  replyText(replyToken, getPosition(nameList));
}

function doShowTX(replyToken) {
  nameList = ['DAY', 'DAY2', 'DAY3', 'HDM', 'WEEK', 'WEEK1']
  s = getPosition(nameList)
  s += "\nTOTAL: " + sumPosition(nameList)
  replyText(replyToken, s);
}

function doShowVX(replyToken) {
  nameList = ['VX', 'VX1', 'TVIX']
  replyText(replyToken, getPosition(nameList));
}

function doShowCN(replyToken) {
  nameList = ['J', 'HSI']
  replyText(replyToken, getPosition(nameList));
}

function doShowTrend(replyToken) {
  nameList = ['MHI', 'MCH', 'CN', 'FGBL', 'FGBM', 'FGBS', 'TXF', 'NQ', 'ES', 'YM', 'GC', 'TU', 'FV', 'TY', 'NK', 'CL', 'rJ', 'rJM', 'rRB', 'rI']
  replyText(replyToken, getPosition(nameList));
}

// Gold Session
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
// End Gold Session


// Sun Power Session
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
// end of Sun Power Session

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

function doSet(replyToken, key, value, broadcast) {
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
      console.log('doSet "' + sets[i][0] + '" "' + sets[i][1] + '"');
    }
    if (broadcast) {
      broadcastText(msg);
    }
  }
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

function replyText(replyToken, txt) {
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

function broadcastText(txt) {
  console.log('broadcast ' + txt);
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

function broadcastSticker(stickerId) {
  var url = 'https://api.line.me/v2/bot/message/broadcast';
  UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'messages': [{
        'type': 'sticker',
        'packageId': "1",
        'stickerId': stickerId,
      }],
    }),
  });
}

function test() {
  x = "a,d,f,z,e,s"
  y = x.split(',').sort()
  console.log(y)
}
