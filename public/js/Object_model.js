function Object_model(oid){
    
    this.parentobj=null;
    this.oid=oid;
    this.Model3d={
         objFile:"",   //3D object file
         texFile:"",   //color texture
		 bumpFile:""   //normal texture
    };
    this.samples = new Array();  // Liste des echantillons 
}

Object_model.prototype.hasModel=function(){
  
    if (this.Model3d.objFile != "") return true;
    else return false;
    
};
Object_model.prototype.addpictures=function(list){
    for(var i=0;i<list.length;i++){
        this.ifile.photos.push(list[i]);
    }
    console.log("Images here !!");
};
Object_model.prototype.removePic=function(fname){
    for(var i=0;i<this.ifile.photos.length;i++){
        if (this.ifile.photos[i]==fname) {
            this.ifile.photos.splice(i,1);
            break;
        }
    }
};


// Edifice_model hérite de Object_model

function Edifice_model(oid){
    Object_model.call(this,oid);
    this.subObjects = new Array();   //Add the object + the 3D position
    this.ifile= new IndexFile();     //Fiche d'indexation minimale des edifices
}

Edifice_model.prototype=Object.create(Object_model.prototype);
Edifice_model.prototype.constructor = Edifice_model; 

Edifice_model.prototype.Add_subObject=function(obj){
    
 this.subObjects.push(obj);
    
}
Edifice_model.prototype.Clear_subObjects=function(){
    this.subObjects.splice(0,this.subObjects.length);  // Clear the array !
}

Edifice_model.prototype.Get_subObject=function(name){
    
 for(var i=0;i<this.subObjects.length;i++){
    if ( this.subObjects[i].name == name ){
        
    }
 }
}
Edifice_model.prototype.GetObject=function(id){
    return this.subObjects[id];   // The index of the child object
}

Edifice_model.prototype.ResetChildpos=function(id){
    for(var i=0;i<this.subObjects.length;i++){
        this.subObjects[i].pos3d={"x":0,"y":0,"z":0};
    }
}


// Objectid_model hérite de Object_model

function Objectid_model(oid){
    Object_model.call(this,oid);
    this.ifile= new ObjectID();     //Fiche Object ID
}

Objectid_model.prototype=Object.create(Object_model.prototype);
Objectid_model.prototype.constructor = Objectid_model; 

