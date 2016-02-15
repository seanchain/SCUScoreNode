var request = require('request')
var iconv = require('iconv-lite')
var cheerio = require('cheerio')

exports.getGPA = function(score) {
  if (score >= 95) {return 4.0}
  else if (score >= 90) {return 3.8}
  else if (score >= 85) {return 3.6}
  else if (score >= 80) {return 3.2}
  else if (score >= 75) {return 2.7}
  else if (score >= 70) {return 2.2}
  else if (score >= 65) {return 1.7}
  else {return 1}
}

exports.getContent = function (zjh, mm, fn) {
  uri = 'http://202.115.47.141/loginAction.do?zjh='+ zjh +'&mm=' + mm
  request(uri, function(err, response, body) {
    var cookie = response['headers']['set-cookie']
    var options = {
      url: 'http://202.115.47.141/gradeLnAllAction.do?type=ln&oper=fainfo&fajhh=1546',
      headers: {'Cookie': cookie},
      encoding: null
    }
    request(options, function(err, response, body) {
      content = iconv.decode(body, 'GBK')
      $ = cheerio.load(content)
      ary = []
      obj = {}
      count = 0
      $('table#user td').each(function(item) {
        var txt = $(this).text().trim()
        if (txt != '') {
          switch (count) {
            case 0:
              obj['kch'] = txt
              count++
              break
            case 1:
              obj['kxh'] = txt
              count++
              break
            case 2:
              obj['kcm'] = txt
              count++
              break
            case 3:
              count++
              break
            case 4:
              obj['xf'] = txt
              count++
              break
            case 5:
              obj['kcsx'] = txt
              count++
              break
            case 6:
              switch (txt) {
                case '及格':
                  txt = '65'
                  break
                case '优秀':
                  txt = '95'
                  break
                default:
                  txt = txt
                  break
              }
              obj['cj'] = txt
              count = 0
              ary.push(obj)
              obj = {}
              break
          }
        }
      })
      fn(JSON.stringify(ary))
    })
  })
}
