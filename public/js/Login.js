function Login(){
	this.login_panel=new Panelelt("Identifiez - vous","OK","Annuler",500,190);
	this.init();
	this.callback=null;
}
Login.prototype={
	init:function(){
		this.init_dom();
		this.init_event();
	},
	init_dom:function(){
		var content='<div id="user" class="fichier_elt"><span> Utilisateur</span><input id="iuser" type="text"></div> <div id="passwd" class="fichier_elt"><span> Mot de pass</span><input id="ipwd" type="password"></div>';
		this.login_panel.setContent(content);
	},
	init_event:function(){
		var _this=this;
		this.login_panel.okFunction=function(){
			_this.send_login();
		};
	},
	send_login:function(){
		var valid=false;
		var _this = this;
		if(this.get_login_value().user !="" && this.get_login_value().pwd!=""){
			var xhr = new XMLHttpRequest();
			xhr.open('POST', '/login');
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.onload = function() {
				if (xhr.status === 200) {
					if( xhr.responseText == "yes") {
						_this.callback(_this.get_login_value().user);  //function callback App_manager
						_this.hide();
					}else alert("USER LOGIN Incorrect ! Try AGAIN");
				}
			};
			xhr.send(JSON.stringify({
				user:this.get_login_value().user,
				pwd:this.get_login_value().pwd
			}));			
		}else alert("Veuillez saisir le USER et le Password");
	},
	get_login_value:function(){
        var _this=this;
        return {
            user:_this.login_panel.select("#iuser").value,
            pwd:_this.login_panel.select("#ipwd").value
        }
    },
	show:function(callback){
		this.callback=callback; //function callback App_Manager
		this.login_panel.show();
	},
	hide:function(){
		this.login_panel.hide(); //rendre le panel invisible
	}
}