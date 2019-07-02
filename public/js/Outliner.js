function Outliner(clickfunction){
    
    this.root=null;
    this.clickfunction=clickfunction;
    this.listnodes=[];
    this.lastselect="";
    
    this.tree= document.createElement("div");
    this.tree.setAttribute("class","tree");
    
    this.accordeon = new Accordelt("","Hiérarchie du site",""); 
    this.accordeon.children[1].appendChild(this.tree);
    
    $("editor_tab_detail").appendChild(this.accordeon);
    
}

Outliner.prototype ={
	selectnode:function(id){
      
      for(var i=0; i<this.listnodes.length;i++){
          if( this.listnodes[i].getAttribute("id")==id) this.listnodes[i].children[0].setAttribute("class","tree_node node_selected");
          else this.listnodes[i].children[0].setAttribute("class","tree_node");
      }
      this.lastselect=id;
  },
	getNodeTitle:function(id){
		var t="";
		for(var i=0; i<this.listnodes.length;i++){
          if( this.listnodes[i].getAttribute("id")==id) return this.listnodes[i].children[0].childNodes[1].nodeValue;
          
      }
	},
	makenode:function(oid,margin,Nodename,type){
        var _this=this;
        var node_cont = document.createElement("div");
        node_cont.setAttribute("class","tree_node_div");
        node_cont.setAttribute("id",oid);
        
        var tree_node = document.createElement("div");
        tree_node.setAttribute("class","tree_node");
        if (type=="E"){
            tree_node.innerHTML='<img src="img/home-icon.png">';
        }else{
			console.log("La racine est OBJECTID");
            tree_node.innerHTML='<img src="img/object-icon.png">';            
        }
        tree_node.innerHTML+=Nodename;
        tree_node.style.marginLeft=margin;
        
        
        node_cont.appendChild(tree_node);
        
        node_cont.addEventListener("click",function(){
            var id = this.getAttribute("id");
			console.log(id);
            _this.selectnode(id);
            _this.clickfunction(id); //The display manager will find the Object to display
        },false);
        this.tree.appendChild(node_cont);
        return node_cont;
    },
	
	update:function(root){
        var _this=this,i=0,k=0;
        this.tree.innerHTML="";
        this.listnodes.length=0;  // A modifier !!!
	    this.root = root;
        console.log("MISE à jour de l'arbre !!");
	    console.log(this.root);
	    (function addnode(R,m){
            if (R.oid == "E0" ){            
                _this.listnodes.push(_this.makenode(R.oid,m," Root","E"));
            }else if ( R.oid == "O0" ) {
				 console.log("J'ai trouvé");
				_this.listnodes.push(_this.makenode(R.oid,m," Root","O"));
			}else{
                if(R instanceof Edifice_model){
                    if (R.ifile.ref.ne.val!="") _this.listnodes.push(_this.makenode(R.oid,m," "+R.ifile.ref.ne.val,"E"));
                    else {
                        i++;
                        _this.listnodes.push(_this.makenode(R.oid,m," Ediffice "+i,"E"));                                
                    }
                }else {
                    if (R.ifile.cat.titre.val!="") _this.listnodes.push(_this.makenode(R.oid,m," "+R.ifile.cat.titre.val,"O")); 
                    else{
                        k++;
                        _this.listnodes.push(_this.makenode(R.oid,m," Objet "+k,"O")); 
                    }
                }
            }
            if(R.hasOwnProperty("subObjects")){
                for(var j=0; j<R.subObjects.length;j++){
                    //i++;
                    //_this.makenode("E"+i,m+5,"Ediffice"+i);
                    addnode(R.subObjects[j].Object_ref,m+20);
                }
            }
        })(this.root,2); // m=2 is the margin of the node tree
        this.selectnode(this.lastselect);
    }
}