"use strict";

const _URL = "" // "http://localhost/4B"
// Se vuota viene assegnata in automatico l'origine da cui è stata scaricata la pagina

function inviaRichiesta(method, url, parameters={}) {
	let config={
		"baseURL":_URL,
		"url":  url, 
		"method": method.toUpperCase(),
		"headers": {
			"Accept": "application/json",
		},
		"timeout": 5000,
		"responseType": "json",
	}
	if(parameters instanceof FormData){
		//mette stream binario e lo mette nel body HTTP request
		config.headers["Content-Type"]='multipart/form-data;' 
		config["data"]=parameters     // Accept FormData, File, Blob
	}	
	else if(method.toUpperCase()=="GET"){
		//converte in URL encoded e lo concatena alla URL
	   config.headers["Content-Type"]='application/x-www-form-urlencoded;charset=utf-8' 
	   config["params"]=parameters   
	}
	else{
		//serializza i parametri json e lo mette nel body dell'HTTP request pero in PHP anche i parametri body li vuole in urlEncoded
		//config.headers["Content-Type"] = 'application/json; charset=utf-8' 
		config.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=utf-8' 
		//IN NODEJS bisogna passarli in json serializzati
		//config.headers["Content-Type"]='aplication/json;charset=utf-8'
		config["data"]=parameters    
	}	
	return axios(config)             
}

function errore(err) {
	if(!err.response) 
		alert("Connection Refused or Server timeout");	
	else if (err.response.status == 200)
        alert("Formato dei dati non corretto : " + err.response.data);
	else if(err.response.status == 403)
		window.location.href="login.html"
    else{
        alert("Server Error: " + err.response.status + " - " + err.response.data);
	}
}

