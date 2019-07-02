var $path;  //variable globale !
function $(id){
    return document.getElementById(id);
}


function start_app(){
	var login = new Login();
    var container = $("viewer"); // la zone d'affichage 3D
	var panel = $("panel-main"); // tout le PANEL pour le endre visible/invisible durant le LOGIN
    var mainObject = new Edifice_model("E"+0);
    //var mainObject = new Objectid_model("O"+0);
    var DM = new Display_Manager(mainObject,container);
    var EM = new Event_Manager(DM,container);
    
	
	login.show(function(valid_login){
		
		EM.init(valid_login);  //Initialise les evenements sur l'interface
		init_ProjectFolder(valid_login);
	});
}


function init_ProjectFolder(userFolder){   //Chaque UPDATE du navigateur on efface l'ancien contenu du dossier
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', encodeURI('/init/'+userFolder));
    xhr.onload = function() {
        if (xhr.status === 200) {
            //alert(xhr.responseText);
            $path=xhr.responseText;
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}