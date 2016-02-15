$(function() {
  $("#form-container").keyup(function(event) {
    if (event.keyCode == 13) {
      $("#submit").click()
    }
  })

  $("#submit").click(function() {
    $("#submit").addClass('disabled')
    var zjh = $('#zjh').val()
    var mm = $('#mm').val()
    if (zjh == '' || mm == '') {
      // alert('You have to input your password and id')
      // 此处使用Materialize的alert
    } else {
      var options = {
        url: '/valid',
        type: 'POST',
        data: {
          zjh: zjh,
          mm: mm
        }
      }
      var request = $.ajax(options)
      request.done(function(msg) {
        if (msg == 'true') {
          window.location.href = 'http://localhost:3000/jwc'
        } else {
          alert('false')
          $('#submit').removeClass('disabled')
        }
      })
      request.fail(function(jqXHR, textStatus) {
        console.log('failed')
      })
    }
  })
})
