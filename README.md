# lazzarino-registroElettronico
Progetto registro elettronico
## Struttura di base 
IL registro elettronico è composto da sezioni separate ma sulla stessa pagina html, alla visualizzazione di una sezione le latre rimangono nascoste.
### Pagina di login
![paginaLogin](https://github.com/lazzarino/lazzarino-registroElettronico/blob/main/immaginiReame/paginaLogin.png)
La pagina di login incorpora una form molto semplice per l'inserimento di username e password, se l'utente inserisce username o password sbagliata comparirà una alert bootstrap sotto il lulsante di login.
Se l'utente ha dimenticato la password può cliccare sul link 'password dimenticata?' e se ci si clicca sopra comparirà una sweet alert che chiede il nome utente per la validazione, e se il nome utente è valdo, uscirà un'altra sweet alert dove si deve inserire l'email.
All'indirizzo email verrà inviato una mail con la password nuova con cui riaccedere al registro, ovviamente mentre si manda l'email il programma provvede anche ad aggiornare la password sul database.

### Pagina home
![paginaHome](https://github.com/lazzarino/lazzarino-registroElettronico/blob/main/immaginiReame/paginaHome.png)
La pagina home è composta da 3 pulsanti principali per accedere alle altre sezioni del registro elettronico, inoltre nella pagina home c'è anche una card che indica la media delle media delle varie materie e anche una sezione che indica gli argomenti,voti, e le eventuali assenze dell'alunno nel giorno di oggi.
### Navbar
La navbar è statica per tutto l'index.html, e indica informazioni basiche come l'anno scolastico, il tipo di profilo (profilo docente non implementato), e un pulsante profilo, dove se ci si clicca sopra, comprare un menù a tendina dove si possono visualizzare le informazioni del profilo, il pulsante di logout, e il form per il cambio password.
### Pagina Voti
![paginaVoti1](https://github.com/lazzarino/lazzarino-registroElettronico/blob/main/immaginiReame/paginaVoti1.png)
Questa parte di pagina è composta da una datatable dove vi sono contenuti le informazioni dei vari voti, e da un listbox dove si possono filtrare le materie andando a selezionare la materia desiderata
![paginaVoti2](https://github.com/lazzarino/lazzarino-registroElettronico/blob/main/immaginiReame/paginaVoti2.png)
La seconda parte è composta da un grafico a linea dove si possono visualizzare l'andamento dei voti nel tempo, il grafico è anche collegato con il listbox
### Pagina assenze
![paginaAssenze](https://github.com/lazzarino/lazzarino-registroElettronico/blob/main/immaginiReame/paginaAssenze.png)
La pagina assenze è compsta principalmente da una tabella bootstrap con le varie informazioni delle assenze, se l'assenza è da giustificare, comparirò a fianco un checkbox che andrà ad abilitare il pulsante Giustifica, inoltre sopra la tabella sono posizionate due card che indicano rispettivamamente il numero di assenze totali e il numero di assenze da giustificare.
### Pagina registro
![paginaRegistro](https://github.com/lazzarino/lazzarino-registroElettronico/blob/main/immaginiReame/paginaRegistro.png)
Questa pagina è composta da una barra superiore dove si possono scorrere le varie settimane, e se si clicca sull'icona del calendario si può inserire il giorno della settimana, e il programma andrà a calcolare la settimana a cui appartiene il giorno. 
La tabella sottostante è collegata con la barra posta al di sopra, e la tabella mostra semplicenete le materia e gli argomenti del giorno.
### Pagina profilo
![paginaProfilo](https://github.com/lazzarino/lazzarino-registroElettronico/blob/main/immaginiReame/paginaProfilo.png)
Nella pagina profilo vengono visualizzate le generalità dell'utente, l'indirizzo di residenza e la città si possono cambiare, oltre all'immagine profilo andando a cliccare sulla immagine stessa.
### Pagina di cambio password
![paginaCambioPassword](https://github.com/lazzarino/lazzarino-registroElettronico/blob/main/immaginiReame/paginaCambioPassword.png)
In questa pagina l'utente deve inserire le informazioni corrette nei vari campi e schiacciare il bottone salva, il programma andrà ad avvisare l'utente tramite delle sweet alert.
## Funzionamento generale
Il registro elettronico utilizza varie librerie importare tramite dei CDN, l'applicazione è basata sul database SQL XAMPP registro, e i vari servizi sono programmati in PHP.
Le immagini non sono direttamente salvate sul database, ma sono salvate in una caretella apposta: server/uploads/
## Criticità
IL registro elettronico non è responsive e non gestisce il profilo docente

 
