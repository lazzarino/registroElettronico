class Utils{
    static giorni={
        "Mon":{
            "index":0,
            "trad":"Lunedì"
        },
        "Tue":{
            "index":1,
            "trad":"Martedì"
        },
        "Wed":{
            "index":2,
            "trad":"Mercoledì"
        },
        "Thu":{
            "index":3,
            "trad":"Giovedì"
        },
        "Fri":{
            "index":4,
            "trad":"Venerdì"
        },
        "Sat":{
            "index":5,
            "trad":"Sabato"
        },
        "Sun":{
            "index":6,
            "trad":"Domenica"
        }
    }
    static mesi=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"]
}

window.onload=function(){
    let chart
    let dataTableVoti

    let _navbar=$("nav").eq(0)
    let _wrapHome=$("#wrapperHome")
    let _wrapVoti=$("#wrapperVoti")
    let _wrapAssenze=$("#wrapperAssenze")
    let _wrapregistro=$("#wrapperRegistro")
    let _wrapProfilo=$("#wrapperProfilo")
    let _wrapCambioPassword=$("#wrapperCambioPassword")

    let _lblMedie=$("#home-lblMedie")
    let _lstMaterie=$("#voti-lstMaterie")
    let _dateRegistro=$("#registro-dateRegistro")
    
    _navbar.hide()
    
    getStudente()
    caricaInterfaccia()
    caricaListHome()
    $("#btnLogout").on("click",function(){
        let request=inviaRichiesta("GET","server/eseguiLogout.php")
        window.location.href="login.html"
    })

    /*                              
    */
//#region sezione home
    function caricaListHome(){
        let date=moment().format("YYYY-MM-DD")
        let _lstAvvenimenti=$("#lstAvvenimenti")
        let model
        let request=inviaRichiesta("POST","server/getAssenze.php",{"data":date})
        request.then(function(response){
            if(response["data"].length>0)
            {
                model=creaModello()
                model.children("div").children("div").text("ASSENZA").css("color","red")
                model.appendTo(_lstAvvenimenti)
            }
            request=inviaRichiesta("GET","server/getArgomenti.php",{"lun":date,"dom":date})
            request.then(function(response){
                for(let argomento of response["data"])
                {
                    model=creaModello()
                    model.children("div").children("div").text("Argomento")
                    $("<span>").html("<b>"+argomento["materia"]+"</b><br>"+argomento["argomento"]).appendTo(model.children("div"))
                    model.appendTo(_lstAvvenimenti)
                }
                request=inviaRichiesta("POST","server/getVoti.php",{"data":date,"codMateria":-1})
                request.then(function(response)
                {
                    for(let voto of response["data"])
                    {
                        model=creaModello()
                        model.children("div").children("div").text("Voto")
                        $("<span>").html("<b>"+voto["materia"]+":</b>  "+voto["voto"]).appendTo(model.children("div"))
                        model.appendTo(_lstAvvenimenti)
                    }
                })
                request.catch(errore)
            })
            request.catch(errore)
        })
        request.catch(errore)
    }
    function creaModello(){
        return $("<li>").addClass("list-group-item d-flex justify-content-center align-items-center")
        .html(`
            <div class="ms-2 me-auto text-center">
                <div class="fw-bold"></div>
                
            </div>
        `)
    }
    function caricaInterfaccia(){
        
        $("#home-data").children("span").eq(0).text(Utils.giorni[moment().format("ddd")]["trad"])
        let testo=moment().format("DD")+" "+Utils.mesi[parseInt(moment().format("MM"))-1]+" "+moment().format("YYYY")
        $("#home-data").children("span").eq(1).text(testo)

    }
    function getStudente(){
        let request=inviaRichiesta("POST","server/getStudente.php")
        request.catch(errore)
        request.then(function(response){
            _navbar.show()
            _wrapHome.show()
            let data=response.data
            //console.log(data)
            $("#lblTipoProfilo").text(data["docente"]==0 ? "Profilo studente" : "Profilo docente")
            let nominativo=data["nome"]
            if(data["docente"]==0)
            {
                nominativo+=" - "+data["classe"]
            }
            $("#lblNome").text(nominativo)
            inserisciMediaVoti("materia")
            $("#imgUser").prop("src","server/uploads/"+data["immagine"])
        })

    }
//#endregion
//#region sezione cambio password
    $("#btnCambioPassword").on("click",function(){
        _wrapHome.hide()
        _wrapProfilo.hide()
        _wrapCambioPassword.show()
        _wrapAssenze.hide()
        _wrapVoti.hide()
        _wrapregistro.hide()
    })
    $("#cambioPassword-btnIndietro").on("click",function(){
        _wrapCambioPassword.hide()
        _wrapHome.show()
    })
    $("#cambioPassword-btnSalva").on("click",function(){
        if($("#cambioPassword-txtNewPass").val()=="" || $("#cambioPassword-txtNewPass1").val()=="" || $("#cambioPassword-txtOldPass").val()=="")
        {
            Swal.fire({
                "title":"ATTENZIONE",
                "text":"Compilare tutti i campi!",
                "icon":"error"
            })
        }
        else
        {
            if($("#cambioPassword-txtNewPass").val()!=$("#cambioPassword-txtNewPass1").val())
            {
                Swal.fire({
                    "title":"ATTENZIONE",
                    "text":"Le password nuove inserite sono diverse",
                    "icon":"error"
                })
            }
            else
            {
                let password=$("#cambioPassword-txtOldPass").val()
                password=CryptoJS.MD5(password).toString()
                let request=inviaRichiesta("POST","server/verificaPassword.php",{"password":password})
                request.catch(function(err){
                    if(err.response.status==403)
                    {
                        Swal.fire({
                        "title":"Password errata",
                        "icon":"error"
                        })
                    }
                    else
                        errore(err)
                })
                request.then(function(){
                    let newPassword=CryptoJS.MD5($("#cambioPassword-txtNewPass").val()).toString()
                    let request=inviaRichiesta("POST","server/aggiornaPassword.php",{"password":newPassword})
                    request.catch(errore)
                    request.then(async function(){
                        await Swal.fire({
                            "title":"Password aggiornata",
                            "text":"Dovrai eseguire l'accesso",
                            "icon":"success"
                        })
                        $("#btnLogout").trigger("click")
                    })
                })
            }
        }

        


        
    })
//#endregion
//#region sezione profilo
    $("#btnProfilo").on("click",function(){
        _wrapHome.hide()
        _wrapProfilo.show()
        _wrapCambioPassword.hide()
        _wrapAssenze.hide()
        _wrapVoti.hide()
        _wrapregistro.hide()
        caricaProfilo()
    })
    $("#profilo-btnIndietro").on("click",function(){
        _wrapProfilo.hide()
        _wrapHome.show()
    })
    $("#btnCaricaImmagineProfilo").on("click",function(){
        caricaImmagineProfilo()
        
    })
    async function caricaImmagineProfilo(){
        let { value: file } = await Swal.fire({
            title: 'Seleziona immagine',
            input: 'file',
            inputAttributes: {
              'accept': 'image/*',
              'aria-label': 'C<arica la tua immagine profilo'
            }
        })
        let formData=new FormData();
        formData.append("image",file)
        let request=inviaRichiesta("POST","server/caricaImmagine.php",formData)
        request.catch(errore);
        request.then(function(response){
            Swal.fire({
                "title":"Caricamento effettuato!",
                "icon":"success"
            })
            caricaProfilo()
        })
    }
    function caricaProfilo()
    {
        let request=inviaRichiesta("POST","server/getStudente.php")
        request.catch(errore)
        request.then(function(response){
            let data=response["data"]
            $("#btnCaricaImmagineProfilo").parent().css("backgroundImage","url(server/uploads/"+data["immagine"]+")")
            $("#profilo-titleNome").text(data["nome"]+" "+data["cognome"])
            if(data["docente"]==0)
                $("#profilo-textTipo").text("Profilo studente")
            else
                $("#profilo-textTipo").text("Profilo docente")
            $("#profilo-txtNome").val(data["nome"])
            $("#profilo-txtCognome").val(data["cognome"])
            $("#profilo-txtClasse").val(data["classe"])
            $("#profilo-txtCitta").val(data["residenza"])
            $("#profilo-txtIndirizzo").val(data["indirizzo"])
            $("#imgUser").prop("src","server/uploads/"+data["immagine"])
        })
    }
    $("#profilo-btnModificaIndirizzo").on("click",function(){
        if($("#profilo-txtCitta").val().replace(" ","")=="" || $("#profilo-txtIndirizzo").val().replace(" ","")=="")
        {
            Swal.fire({
                "title":"Compila i campi!",
                "icon":"warning"
            })
        }
        else
        {
            let param={
                "citta":$("#profilo-txtCitta").val(),
                "indirizzo":$("#profilo-txtIndirizzo").val()
            }
            let request=inviaRichiesta("POST","server/modificaIndirizzo.php",param)
            request.then(function(){
                Swal.fire({
                    "title":"Aggiornamento eseguito",
                    "icon":"success"
                })
                caricaProfilo()
            })
            request.catch(errore)
        }
    })
//#endregion
//#region sezione registro
    $("#registro-btnIndietro").on("click",function()
    {
        _wrapregistro.hide()
        _wrapHome.show()
    })
    $("#home-registro").on("click",function(){
        _wrapHome.hide()
        _wrapregistro.show()
        $("#registro-dateRegistro").val(moment().format("YYYY-MM-DD"))
        impostaSettimana()
    })
    $("#registro-btnSettimanaPrecedente").on("click",function(){
        let date=moment(_dateRegistro.val())
        _dateRegistro.val(date.subtract(7,'days').format("YYYY-MM-DD"))
        impostaSettimana()
    })
    $("#registro-btnSettimanaSuccessiva").on("click",function(){
        let date=moment(_dateRegistro.val())
        _dateRegistro.val(date.add(7,'days').format("YYYY-MM-DD"))
        impostaSettimana()
    })
    _dateRegistro.on("change",impostaSettimana)

    function impostaSettimana(){//La data da impostare dipende da _dateRegistro
        let lunedì=ottieniLunedi(_dateRegistro.val())
        $("#registro-txtSettimana").val("Settimana da lunedì "+lunedì.format("DD")+" "+Utils.mesi[parseInt(lunedì.format("MM"))-1]+" "+lunedì.format("YYYY"))
        ///console.log(lunedì.format("YYYY-MM-DD"))
        caricaTabellaArgomenti()
    }

    function ottieniLunedi(dataOdierna){
        let date=moment(dataOdierna)
        let offsetSett=Utils.giorni[date.format("ddd")]["index"]
        return moment(date.subtract(offsetSett,'days'))
    }

    function caricaTabellaArgomenti(){
        let request=getArgomenti(_dateRegistro.val())
        request.then(function(data){
            let _tbody=$("#tabellaArgomenti").children("tbody")
            _tbody.html("")
            let date=ottieniLunedi(_dateRegistro.val())
            for(let i=0;i<6;i++)
            {
                let _tr=$("<tr>").appendTo(_tbody)
                $("<td>").appendTo(_tr).html(Utils.giorni[date.format("ddd")]["trad"]+"</br>"+date.format("DD/MM/YYYY")).prop("data",date.format("YYYY-MM-DD"))
                date.add(1,'days')
            }
            let j=0
            let _tr=_tbody.children("tr")
            let _td=$("<td>").appendTo(_tr.eq(j))
            let testo=""
            for(let [i,argomento] of data.entries())
            {
                //console.log(argomento["data"])
                //console.log(_tr.eq(j).children("td").eq(0).prop("data"))
                if(argomento["data"]==_tr.eq(j).children("td").eq(0).prop("data"))
                    testo+="<b>"+argomento["materia"]+"</b>: "+argomento["argomento"]+"<br>"
                else
                {
                    _td.html(testo)
                    j++
                    _td=$("<td>").appendTo(_tr.eq(j))
                    testo="<b>"+argomento["materia"]+"</b>: "+argomento["argomento"]+"<br>"
                }
            }
            _td.html(testo)
        })
    }

//#endregion
//#region sezione assenze
    $("#home-assenze").on("click",function(){
        _wrapHome.hide()
        _wrapAssenze.show()
        caricaSezioneAssenze()
    })
    $("#btnGiustifica").on("click",function(){
        let check=$("input[name=checkGiustifica]:checked")
        let id=[]
        for(let i=0;i<check.length;i++)
        {
            id.push(check.eq(i).val())
        }
        
        let request=inviaRichiesta("POST","server/giustifica.php",{"id":id})
        request.then(function(response){
            Swal.fire({
                "title":"Aggiornamento eseguito",
                "icon":"success"
            })
            caricaSezioneAssenze()
        })
        request.catch(errore)
    })
    $("#assenze-btnIndietro").on("click",function(){
        _wrapAssenze.hide()
        _wrapHome.show()
    })
    function caricaSezioneAssenze(){
        let request=getAssenze()
        request.then(function(data){
            caricaTabellaAssenze(data)
            caricaCardAssenze(data)
        })
    }
    function caricaCardAssenze(data){
        $("#assenze-lblNAssenze").text(data.length)
        let cont=0
        for(let assenza of data)
            if(assenza["giustificato"]==0)
                cont++
        $("#assenze-lblNAssenzeNonGiustificate").text(cont)
    }
    function caricaTabellaAssenze(data){
        let _tbody=$("#assenze-tableAssenze").children("tbody")
        _tbody.html("")
        for(let assenza of data)
        {
            let _tr=$("<tr>")
            $("<td>").text(assenza["data"]).appendTo(_tr)
            if(assenza["giustificato"]==1)
            {
                $("<td>").text("Giustificato").css("color","green").appendTo(_tr)
                $("<td>").text("").appendTo(_tr)
            }
            else
            {
                $("<td>").text("Non giustificato").css("color","red").appendTo(_tr)
                let _td=$("<td>").appendTo(_tr)
                $("<input>").prop("type","checkbox").addClass("form-check-input").val(assenza["id"]).appendTo(_td).prop("name","checkGiustifica")
                .on("click",function(){
                    if($("input[name=checkGiustifica]:checked").length>0)
                        $("#btnGiustifica").prop("disabled",false)
                    else
                        $("#btnGiustifica").prop("disabled",true)
                })
            }
            _tr.appendTo(_tbody)
        }
    }
    //#endregion
//#region sezione voti

    _lstMaterie.on("change",function(){
        creaTabellaElenco()
        creaGraficoVoti()
    })
    $("#voti-btnIndietro").on("click",function(){
        _wrapVoti.hide()
        _wrapHome.show()
    })
    $("#home-voti").on("click",function(){
        _wrapHome.hide()
        _wrapVoti.show()
        
        caricaCmbMaterie()
        creaTabellaElenco()
        creaGraficoVoti()
    })
    function creaGraficoVoti(){
        let request=getVoti("data",_lstMaterie.val())
        request.then(function(data){
            if(chart)
                chart.destroy()
            //console.log(data["data"])
            let labels=[]
            let dati=[]
            for(let voto of data)
            {
                labels.push(voto["data"])
                dati.push(voto["voto"])
            }
            //console.log(labels)
            //console.log(data)
            let ChartData={
                "labels":labels,
                "datasets":[{
                    "label":"Andamento voti",
                    "data":dati,
                    "fill":true,
                    "borderColor":"rgb(102, 0, 254)",
                    "backgroundColor":"rgba(102, 0, 254, 0.2)",
                    "tension":0.1
                }]
            }
            let config={
                "type":"line",
                "data":ChartData,
                "options":{
                    "scales":{
                        "y":{
                            "min":0,
                            "max":10
                        }
                    }
                }
            }
            chart=new Chart($("#voti-graficoVoti").get(0),config)
        })

        

    }
    function caricaCmbMaterie(){
        let request=getMaterie()
        request.then(function(data){
            _lstMaterie.html("")
            _lstMaterie.append($("<option>").text("Tutte").val(-1))
            for(let materia of data)
            {
                
                $("<option>").text(materia["materia"]).val(materia["id"]).appendTo(_lstMaterie)
            }
            
        })
    }
    function creaTabellaElenco(){
        let _tbody=$("#voti-tableVoti").children("tbody")
        let request=getVoti("data",_lstMaterie.val())
        request.then(function(data){
            if(dataTableVoti)
                dataTableVoti.destroy()
            _tbody.html("")
            console.log(data)
            for(let voto of data)
            {
                let _tr=$("<tr>")
                $("<td>").text(voto.data).appendTo(_tr)
                $("<td>").text(voto.materia).appendTo(_tr)
                $("<td>").text(voto.voto).appendTo(_tr)
                _tbody.append(_tr)
            }
            dataTableVoti=$("#voti-tableVoti").DataTable()
        })
        
    }
    function inserisciMediaVoti(ordine){
        let request=getVoti(ordine)
        request.then(function(data){
            if(data.length>1)
            {
                let sommaTot=0,contMaterie=0
                let sommaMateria=parseFloat(data[0].voto),contMateria=1
                for(let i=1;i<data.length;i++)
                {
                    if(data[i].materia!=data[i-1].materia)
                    {
                        //console.log("\n\n"+contMateria+"\n"+sommaMateria)
                        contMaterie++
                        sommaTot+=sommaMateria/contMateria
                        sommaMateria=0
                        contMateria=0
                    }
                    sommaMateria+= parseFloat(data[i]["voto"])
                    contMateria++
                }
                contMaterie++
                sommaTot+=sommaMateria/contMateria
                _lblMedie.text((sommaTot/contMaterie).toString().substring(0,4))
                //console.log(contMaterie+"\n"+sommaTot+"\n"+data[3].voto)
            }
            else
            {
                _lblMedie.text(data[0]["voto"].substring(0,4))
            }
            
        })
    }
//#endregion
//#region funzioni di chiamata

    
    function getVoti(ordine,codMateria=-1){
        let promise= new Promise(function(resolve){
            let request=inviaRichiesta("POST","server/getVoti.php",{"order":ordine,"codMateria":codMateria})
            request.catch(errore)
            request.then(function(response){
                let data=response["data"]
                //console.log(data)
                resolve(data);
            })
        })
        return promise;
    }
    function getMaterie(){
        let promise=new Promise(function(resolve){
            let request=inviaRichiesta("POST","server/getMaterie.php")
            request.catch(errore)
            request.then(function(response){
                let data=response["data"]
                //console.log(data);
                resolve(data)
            })
        })
        return promise
    }
    function getAssenze(){
        let promise=new Promise(function(resolve){
            let request=inviaRichiesta("POST","server/getAssenze.php")
            request.catch(errore)
            request.then(function(response){
                let data=response["data"]
                resolve(data)
            })
        })
        return promise
    }
    function getArgomenti(date){
        let promise=new Promise(function(resolve){
            let lunedi=ottieniLunedi(date)
            let domenica=ottieniLunedi(date).add(6,'days').format("YYYY-MM-DD")
            lunedi=lunedi.format("YYYY-MM-DD")
            ///console.log(lunedi)
            let request=inviaRichiesta("POST","server/getArgomenti.php",{"lun":lunedi,"dom":domenica})
            request.catch(errore)
            request.then(function(response){
                let data=response["data"]
                resolve(data)
            })
        })
        return promise
    }
//#endregion
}