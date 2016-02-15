var express = require('express')
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
})
var app = express()
var jwc = require('./libs/jwc.js')
var credentials = require('./libs/credentials.js')
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')
app.set('port', process.env.PORT || 8888)
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/bower_components'))
app.use(require('body-parser')())
app.use(require('cookie-parser')(credentials.cookieSecret))
app.use(require('express-session')())

app.get('/', function (req, res) {
  res.send('This is the home page')
})


app.get('/form', function (req, res) {
  if (req.session.obj) {
    res.redirect('/jwc')
  }
  else res.render('form')
})

app.post('/valid', function (req, res) {
  var zjh = req.body.zjh
  var mm = req.body.mm
  jwc.getContent(zjh, mm, function (result) {
    var obj = JSON.parse(result)
    if (obj.length == 0) {
      res.send('false')
    }
    else {
      var obj = JSON.parse(result)
      req.session.obj = obj
      req.session.cookie.maxAge = 60000
      res.send('true')
    }
  })
})

app.get('/jwc', function (req, res) {
  if (req.session.obj) {
    var obj = req.session.obj
    cj = 0.0
    xf = 0
    gpa = 0.0
    for (var i = 0; i < obj.length; i ++) {
      if (obj[i]['kcsx'] == '必修') {
        xf += parseInt(obj[i]['xf'])
        cj += parseInt(obj[i]['cj']) * parseInt(obj[i]['xf'])
        gpa += jwc.getGPA(obj[i]['cj']) * parseInt(obj[i]['xf'])
      }
    }
    res.render('score', {
      'obj': obj
    })
  }
  else {
    res.redirect('/form')
  }
})

app.listen(3000, function() { console.log('Start listening on the port 3000') })
