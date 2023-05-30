window.onload=function(){
  'use strict'
  let _txtUser=$("#txtUser")
  let _txtPassword=$("#txtPassword")

  $("#lblErrore").hide();
  $("#wrapper").show();
  
  _txtPassword.on("input",function(){
    $(this).removeClass("is-invalid")
  })
  _txtUser.on("input",function(){
    $(this).removeClass("is-invalid")
  })

  $(".btn-close").on("click",function(){
    $("#lblErrore").fadeOut();
  })

  $("#linkPassDim").on("click",async function(){
    let {value: user}= await Swal.fire({
      title: 'Inserisci il tuo username',
      input: 'text',
      inputValidator: (value) => {
        if (!value) {
          return 'Devi compilare il campo!'
        }
      }
    })
    let request=inviaRichiesta("POST","server/verificaUtente.php",{"user":user})
    request.then(async function(response){
      let matricola=response["data"][0]["matricola"]
      const { value: email } = await Swal.fire({
        title: 'Inserisci la tua email',
        input: 'email',
      })
      let request=inviaRichiesta("POST","server/inviaPassword.php",{"email":email})
      request.catch(errore)
      request.then(function(response){
        //console.log(response["data"])
        let password=response["data"].substring(0,8)
        //console.log(password)
        password=CryptoJS.MD5(password).toString()
        let request=inviaRichiesta("POST","server/aggiornaPassword.php",{"password":password,"matricola":matricola})
        request.then(function(){
          Swal.fire({
            "title":"Pasword aggiornata",
            "icon":"success"
          })
        })
        request.catch(errore)
      })
      request.catch(errore)
    })
    request.catch(function(err){
      if(err.response.status==403)
      {
        Swal.fire({
          "title":"Username non esistente",
          "icon":"error"
        })
      }
      else
        errore(err)
    })
    


  })


  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if(form.checkValidity())
      {
        let username=_txtUser.val()
        let password=_txtPassword.val()
        password=CryptoJS.MD5(password).toString()
        let request=inviaRichiesta("POST","server/eseguiLogin.php",{"username":username,"password":password})
        request.catch(function(err){
          if(err.response && err.response.status==401)
          {
            $("#lblErrore").show();
          }
          else
            errore(err)
          _txtPassword.addClass("is-invalid")
          _txtUser.addClass("is-invalid")
        })
        request.then(function(){
          _txtPassword.addClass("is-valid")
          _txtUser.addClass("is-valid")
          window.location.href="index.html"
        })
      }
      else
      {
        _txtPassword.addClass("is-invalid")
        _txtUser.addClass("is-invalid")
      }
      event.preventDefault()
     
    }, false)
  })
}