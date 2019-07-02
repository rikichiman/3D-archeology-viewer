function File_chooser(){
    this.fileChoos=document.createElement("div");
    this.fileChoos.setAttribute("class","Folder_chooser");
    
    this.fileTex=document.createElement("div");
    this.fileTex.setAttribute("class","Folder_text");
    this.fileTex.innerHTML='Nom du projet<input type="text">';
    
    
    this.fileZone=document.createElement("div");
    this.fileZone.setAttribute("class","Folder_zone");
    
    this.fileChoos.appendChild(this.fileTex);
    this.fileChoos.appendChild(this.fileZone);
    
    this.ProjectPanel= new Panelelt("","","Annuler",520,400);  // Change the titlle when it's called
    this.ProjectPanel.add(this.fileChoos);
    this.selected=false;
    this.init_event();
}

File_chooser.prototype={
    init_event:function(){
        var _this=this;
        this.fileZone.addEventListener("click",function(){
            //console.log("Here i AM !");
            //console.log(this.children);
            if (_this.selected==true) {
                for(var i=0;i<this.children.length;i++){
                    this.children[i].setAttribute("class","Folder_pic");
                }
                _this.selected=false;
                _this.fileTex.children[0].value="";
            }
        },false);
    },
    show:function(t,ok_tittle){
        this.ProjectPanel.setTittle(t);
        this.ProjectPanel.setOkTittle(ok_tittle);
        this.loadProjectsName();
        this.ProjectPanel.show();
    },
    loadProjectsName:function(){
        
        //AJAX request to the server
        var _this=this,xhr = new XMLHttpRequest();
        xhr.open('GET',"/ProjectsName", true);
        xhr.onload = function(e) {
                  if (this.status == 200) {
                       _this.displayFolders(JSON.parse(xhr.responseText).lf);
                  }
        }
        xhr.send();
        
    },
    displayFolders:function(list){
        //Display The folder icons in the panel
        var _this=this;
        this.fileZone.innerHTML="";
        
        for(var i=0;i<list.length;i++){
            if (list[i]!="NewProject"){
                var Ficon=document.createElement("span");
                Ficon.setAttribute("class","Folder_pic");
                Ficon.innerHTML= '<img src="img/Folder.png"> <p>'+ list[i] +'</p>';
                Ficon.addEventListener("click",function(e){
                    e.stopPropagation();
                    for(var i=0;i< this.parentNode.children.length;i++) 
                        this.parentNode.children[i].setAttribute("class","Folder_pic");

                    this.setAttribute("class","Folder_pic selected");
                    _this.fileTex.children[0].value=this.children[1].innerHTML;
                    _this.selected=true;

                },false);

                this.fileZone.appendChild(Ficon);
            }
        }
    },
    affectFunction:function(f){
        this.ProjectPanel.okFunction=f;
    },
    getProjectName:function(){
        return this.fileTex.children[0].value;
    },
    saveProject:function(Projectjson,folder){
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/saveProject');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                //var userInfo = JSON.parse(xhr.responseText);
            }
            
        };
        xhr.send(JSON.stringify({
            fname: folder,
            data: Projectjson
        }));
    },
	openProject:function(folder,userFolder,callback,isFusion){
		//folder is the name of the project --> functon will return the JSON file of the project		
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/openProject');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                var projectJS = JSON.parse(xhr.responseText);
				callback(projectJS);
            }
            
        };
		console.log({userFolder:userFolder, Projectname:folder,Fusion:isFusion});
        xhr.send(JSON.stringify({userFolder:userFolder, Projectname:folder,Fusion:isFusion}));		
	}
    
};