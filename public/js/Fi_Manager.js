function Fi_Manager(){
    this.visible=false;
    this.fim_create= false;
    this.objId_create=false;
    this.object_loaded=true;
    
    this.fim=[];  //contient les div des rubriques
    this.objId=[];
      
    this.fi_panel=new Panelelt("Fiche minimale d'indexation","Enregistrer","Annuler",700,700);
    this.fi_panel.cancelFunction=this.hide.bind(this);
    this.fi_panel.okFunction= this.saveData.bind(this);
    this.obj=null;  // reference to the object model display on the current view..
    this.CF=null; //callback function after we save datas (optional)
}
Fi_Manager.prototype = {
    
    hide:function(){
      this.visible = false;  
    },
    
    show_data:function(obj,callback){  
        this.obj = obj;
        this.CF=callback;
        this.init_form(obj);
        this.fi_panel.show();
    },    
    
    getByattr:function(attr){   // we look for the value of the attribute n in the elt_repeat class
        var R=[];
        var l = this.fi_panel.panel_zone_content.getElementsByClassName("repeat");
        console.log(l);
        for(var i=0 ; i<l.length;i++){
            
            if (l[i].getAttribute("n")==attr) R.push(l[i]);
            
        }
        return R;
    },
    getById:function(id,list){
        var s;
        for(var i=0 ; i<list.length; i++){
            if (list[i].getAttribute("id") == id){
                return list[i];           
            }else if (list[i].children.length > 0) { 
                    s = this.getById(id, list[i].children);
                    if (s != "" ) return s;
            }
        }
        return "";
    },
    getId:function(id){
            
        var s= this.getById(id,this.fi_panel.panel_zone_content.children);
        return s;
    },
    
    
    init_form:function(obj){
        var divcont,saved,prop;
        saved = obj.ifile.saved;   // true or false  (there is data already saved or not )
        prop=Object.getOwnPropertyNames(obj.ifile);
        this.fi_panel.panel_zone_content.innerHTML = "";
        if (obj instanceof Edifice_model){
            if ( this.fim_create == false ){
                
                for(var i=1; i<prop.length-1;i++)   // 9 rubriques
                {
                    divcont=this.make_rubrique(i,obj.ifile[prop[i]],saved); // construire le dom de la rubrique i
                    this.fim.push(divcont);
                    this.fi_panel.add(divcont);
                }
                this.fim_create=true; // La fiche de base est crée
            }else{
                for (var i=0; i<this.fim.length;i++){
                    
                    this.fi_panel.add(this.fim[i]);                    
                }
                
                //si la form est déja crée ..on va juste la modifier !
                for(var i=1; i<prop.length-1;i++)   // 9 rubriques
                { 
                    this.updateRubrique(i,obj.ifile[prop[i]]);
                 
                }
            }
            //-- Affecter les evénements pour les bouttons + - et réduction des rubriques
            this.add_repeat_event(this.fi_panel.panel_zone_content);
            this.add_remove_event(this.fi_panel.panel_zone_content);
        }else{
            if (this.objId_create == false){
                
                //objectID form   //TODO  TONIGHT !!
                for(var i=1; i<prop.length-1;i++)   // 2 Rubriques
                {
                    divcont=this.make_rubrique(i,obj.ifile[prop[i]],saved); // construire le dom de la rubrique i
                    this.objId.push(divcont);
                    this.fi_panel.add(divcont);
                }
                this.objId.innerHTML=this.fi_panel.panel_zone_content.innerHTML;
                this.objId_create=true;
                
            }else {
                
                for (var i=0; i<this.objId.length;i++){
                    
                    this.fi_panel.add(this.objId[i]);                    
                }
                //si la form est déja crée ..on va juste la modifier !
                for(var i=1; i<prop.length-1;i++)   // 2 rubriques
                { 
                    this.updateRubrique(i,obj.ifile[prop[i]]);
                 
                }
            
            
            }
        }
        
    },
    add_block:function(_this){
        var spa=this.parentNode;
        var parentnode= this.parentNode.parentNode;
       
        var ndiv=document.createElement("div");
        ndiv.setAttribute("class","elt_repeat");
        ndiv.innerHTML = parentnode.children[0].innerHTML;
        
        _this.add_repeat_event(ndiv); //Add event to the Add / remove buttons of the newly added block :)
		_this.add_remove_event(ndiv);
        
        if (ndiv.getElementsByClassName("repeat").length > 0){ //Check if the new block contains a repeat TAG div  Personne/Role
            
            var childs = ndiv.getElementsByClassName("repeat")[0];
            console.log(childs);
            
            var elt_todelete=childs.getElementsByClassName("elt_repeat");
            console.log(elt_todelete.length);
            //--> This loop is here to keep only one Tag=elt_repeat on the Tag=repeat div that's been added :)
            for(var i=elt_todelete.length-1; i>0 ;i--){
                console.log(elt_todelete[i]);
                childs.removeChild(elt_todelete[i]);   
                console.log(elt_todelete.length);
            }
        }
        parentnode.appendChild(ndiv);
        parentnode.removeChild(spa);
        parentnode.appendChild(spa); // garder la zone des bouttons toujours en bas aprés le block ajouté !
    },
    add_repeat_event:function(elt){
        var _this=this , t = elt.getElementsByClassName("add_img");
        for(var i =0;i<t.length;i++){
            t[i].addEventListener("click",function(){
                _this.add_block.call(this,_this);
            },false);
        }
    },
    
    
    remove_block:function(_this){
        var spa = this.parentNode;
        var parentnode= spa.parentNode;
        //console.log(parentnode);
        if ( parentnode.children.length > 2 ){
            parentnode.removeChild(parentnode.children[parentnode.children.length-2]);
        }
    },
    add_remove_event:function(elt){
        var _this=this, t=elt.getElementsByClassName("rem_img");
        for(var i =0;i<t.length;i++){
            t[i].addEventListener("click",function(){
                _this.remove_block.call(this,_this);
            },false);
        }
    },
    
    
    make_rubrique:function(n,obj,saved){
        var htm='';

        if (saved == false){
            htm=this.make_rubrique_content(obj);  //Appel de la fonction récurssive !
        }
        else{ //scratch != FALSE
            htm=this.load_rubrique_content(n,obj);  //n pour connaitre de quelle rubrique il s'agit
        }
              
        return new Accordelt(n,obj.label,htm);
    },
    make_rubrique_content:function(obj){
        var subprop,htm;
        subprop = Object.getOwnPropertyNames(obj);
        htm='';
        for(var i=1;i< subprop.length;i++){
            
                if (obj[subprop[i]].repeat == "n"){
                    htm+='<div class="info_elt"><span class="etiquette">'+obj[subprop[i]].label +'</span>';
                    htm+='<input id="'+ subprop[i] +'" type="text" class="zone_text"></div>';
                }
                else {
                    htm+='<div class="repeat" n="'+obj[subprop[i]].fields.label+'">';
                    htm+='<div class="elt_repeat" >';
                    htm+=this.make_rubrique_content(obj[subprop[i]].fields);
                    htm+='</div>';
                    htm+='<div class="btn_add_rem"><span class="add_img"><img src="img/add.png"></span>';
                    htm+='<span class="rem_img"><img src="img/erase.png"></span></div>';
                    htm+='</div>';
                    //Ajouter les bouttons + -
                }
        }
        return htm;
    },
    
    load_rubrique_content:function(n,obj){
        var subprop,htm;
        subprop = Object.getOwnPropertyNames(obj);
        htm='';
        if (n!= 3 && n!=5 ){
            for(var i=1;i< subprop.length;i++){
                htm+='<div class="info_elt"><span class="etiquette">'+obj[subprop[i]].label +'</span>';
                htm+='<input id="'+ subprop[i] +'" type="text" class="zone_text" value="'+obj[subprop[i]].val+'"></div>';
            }
        }
        else{
            if(n==3){
                //Catégorie
                htm+='<div class="info_elt"><span class="etiquette">'+obj["cat"].label +'</span>';
                htm+='<input id="'+ subprop[1] +'" type="text" class="zone_text" value="'+obj["cat"].val+'"></div>';
                var n=obj.fonc.fields.fc.val.length;
                if (n > 0)
                {
                    htm+='<div class="repeat"  n="'+obj.fonc.fields.label+'">';
                    for(var i = 0 ;i<obj.fonc.fields.fc.val.length;i++){
                        htm+='<div class="elt_repeat">';
                            htm+='<div class="info_elt"><span class="etiquette">'+obj.fonc.fields.fc.label +'</span>';
                            htm+='<input id="fc" type="text" class="zone_text" value="'+obj.fonc.fields.fc.val[i]+'"></div>';
                            htm+='<div class="info_elt"><span class="etiquette">'+obj.fonc.fields.dt.label +'</span>';
                            htm+='<input id="dt" type="text" class="zone_text" value="'+obj.fonc.fields.dt.val[i]+'"></div>';
                        htm+='</div>';
                        if ( i==obj.fonc.fields.fc.val.length -1 ){
                            htm+='<div class="btn_add_rem"><span class="add_img"><img src="img/add.png"></span>';
                            htm+='<span class="rem_img"><img src="img/erase.png"></span></div>';
                            htm+='</div>';  // Fin du div class="repeat"  !
                        }
                    }
                }else{
                    
                    htm+=this.make_rubrique_content(obj);  // construire from scratch rien à charger
                    
                }
             }else { // n=5 Personne liées à l'histoire de l'édifice
                 var n=obj.per.fields.poo.val;
                 if (n.length > 0){
                     htm+='<div class="repeat"  n="'+obj.per.fields.label+'">';
                     for(var i=0 ;i< n.length ;i++){
                        //personne
                        htm+='<div class="elt_repeat">';
                             htm+='<div class="info_elt"><span class="etiquette">'+obj.per.fields.poo.label +'</span>';
                             htm+='<input id="poo" type="text" class="zone_text" value="'+n[i].name+'"></div>';
                             htm+='<div class="repeat">';
                             for(var j=0;j < n[i].roles.length ;j++){
                                //Roles joué
                                htm+='<div class="elt_repeat" n="'+obj.per.fields.role.fields.label+'">';
                                    htm+='<div class="info_elt"><span class="etiquette">'+obj.per.fields.role.fields.ro.label +'</span>';
                                    htm+='<input id="poo" type="text" class="zone_text" value="'+n[i].roles[j].role +'"></div>'; 
                                    htm+='<div class="info_elt"><span class="etiquette">'+obj.per.fields.role.fields.dtr.label +'</span>';
                                    htm+='<input id="poo" type="text" class="zone_text" value="'+n[i].roles[j].date +'"></div>'; 
                                htm+='</div>'; 

                                if ( j==n[i].roles.length -1 ){ //The Last role !
                                    htm+='<div class="btn_add_rem"><span class="add_img"><img src="img/add.png"></span>';
                                    htm+='<span class="rem_img"><img src="img/erase.png"></span></div>';
                                    htm+='</div>';  // Fin du div class="repeat"  !
                                }

                             }
                         
                         htm+='</div>'; //Fin de div class="elt_repeat"  personne
                         if ( i==n.length -1 ){ //The Last person !
                            htm+='<div class="btn_add_rem"><span class="add_img"><img src="img/add.png"></span>';
                            htm+='<span class="rem_img"><img src="img/erase.png"></span></div>';
                            htm+='</div>';  // Fin du div class="repeat"  !
                         }
                     }
                 }else{
                     
                     htm+=this.make_rubrique_content(obj);  // construire from scratch rien à charger                   
                 }
            
            }
        }
        return htm;
    },
    updateRubrique:function(n,obj){
        var subprop = Object.getOwnPropertyNames(obj);
        if(n!=3 && n!=5){
            for(var i=0; i<subprop.length;i++){
                    
                   this.getId(subprop[i]).value=obj[subprop[i]].val;
            }
        }else{
            if(n==3){
                this.fi_panel.panel_zone_content.children[2].children[1].innerHTML=this.load_rubrique_content(n,obj);
            }else 
                this.fi_panel.panel_zone_content.children[4].children[1].innerHTML=this.load_rubrique_content(n,obj);
        }
    
    },
    
    saveData:function(){
        prop=Object.getOwnPropertyNames(this.obj.ifile);
        for(var i=1; i<prop.length-1;i++)   // 9 rubriques
        {
            this.saveRubrique(i,this.obj.ifile[prop[i]]); // construire le dom de la rubrique i
        }
        this.CF(); //ce callback pour la MAJ de la hierarchie du site
    },
    saveRubrique:function(n,obj){
        
        //console.log(this.fi_panel.panel_zone_content.children[2].children[1]);
        var subprop = Object.getOwnPropertyNames(obj);
        if(n!=3 && n!=5){
            for(var i=0; i<subprop.length;i++){
                    
                   obj[subprop[i]].val=this.getId(subprop[i]).value;
            }
        }else{
            if(n==3){
                var ie,re,listFonc;
                obj["cat"].val=this.getById("cat",this.fi_panel.panel_zone_content.children[2].children[1].children).value;
                
                listFonc = this.getByattr("Fonction");
                re=listFonc[0].getElementsByClassName("elt_repeat");
                obj["fonc"].fields.fc.val=[];
                obj["fonc"].fields.dt.val=[];
                for(var i=0; i< re.length;i++){ 
                    ie=re[i].getElementsByClassName("info_elt");
         
                    obj["fonc"].fields.fc.val.push(ie[0].children[1].value);
                    obj["fonc"].fields.dt.val.push(ie[1].children[1].value);
                }
            }else{ // n == 5
                var r,p,listPer,listroles;
                
                listPer=this.getByattr("Personne");
                listPer=listPer[0].children;
                
                obj["per"].fields.poo.val=[];
                console.log("Début du traitement :");
                console.log(obj["per"].fields.poo.val);
                for(var i=0; i< listPer.length - 1 ;i++){
                    p=new Object();  // pour avoir des réferences différentes !
                    console.log("Personne "+i+1);
                    console.log(listPer[i]);
                    p.name=listPer[i].children[0].children[1].value;
                    listroles = listPer[i].children[1].getElementsByClassName("elt_repeat");
                    r=[];
                    for(var j=0; j<listroles.length;j++){  // Les roles de la personne
                        
                        r.push( {role: listroles[j].children[0].children[1].value , date: listroles[j].children[1].children[1].value} );
                        
                    }
                    p.roles = r;
                    console.log("Recap :");
                    console.log(p);
                    obj["per"].fields.poo.val.push(p);
                 }
                console.log("FIN du traitement :");
                console.log(obj["per"].fields.poo.val);
                
            }
        }        
        
    }
    
};