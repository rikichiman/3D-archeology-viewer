//--> Class for Managing pictures of the 3d displayed model
//Author: Amine OMOR

function ImgLoader(){
    this.enable=true;
    this.listimg=[];
    
    this.chfunc=null;
    this.delfunc=null;
        
    this.cont=document.createElement("div");
    this.cont.setAttribute("class","img-panel");
    this.init_dom();
    
    this.accordeon = new Accordelt("","Photos","");
    this.accordeon.children[1].appendChild(this.cont);
    
    this.init_event();
    this.index=null;
    $("editor_tab_detail").appendChild(this.accordeon);
}

ImgLoader.prototype= {
    init_dom:function(){
        this.cont.innerHTML+='<div class="btn-zone" style="margin-left: 5px;"><img class="save" src="img/new.png"><input type="file" multiple  hidden="true"><img class="delete" src="img/rem.png"></div>';    
        this.img_zone=document.createElement("div");
        this.img_zone.setAttribute("class","img-zone");
        //this.img_zone.innerHTML='<span class="img_elt"></span>';
        
        this.loadbarre=document.createElement("div");
        this.loadbarre.setAttribute("class","load");
        this.loadbarre.innerHTML='<div class="txt">Text de test</div><div class="barre"></div>';
        this.loadbarre.style.display="none";

        this.cont.appendChild(this.img_zone);
        this.cont.appendChild(this.loadbarre);
        
    },
    init_event:function(){
        
        this.add_img(); 
        this.del_img();
        
    },
    clearPics:function(){
        this.img_zone.innerHTML="";
    },
    loadPictures:function(l){
        var _this=this,xhr;
		
        for(var i=0;i<l.length;i++){
            
            var s=(function(fname,index){
                var xhr = new XMLHttpRequest();
                xhr.open('GET',fname, true);
                xhr.responseType = 'blob';
                xhr.onload = function(e) {
                    if (this.status == 200) {
                      // Note: .response instead of .responseText
                      var blob = new Blob([this.response], {type: 'image/png'});
                      var span=document.createElement("span");
                      span.setAttribute("class","img_elt");
                      //span.setAttribute("n",index);
                      span.setAttribute("url",fname);
                      span.addEventListener("click",function(){
                          for(var i=0;i<this.parentNode.children.length;i++){
                                  this.parentNode.children[i].setAttribute("class","img_elt");
                          }
                         this.setAttribute("class","img_elt selected"); 
                         _this.index=this;  
                      },false);
                      
                      var img=document.createElement("img");
                      img.onload = function(e) {
                          window.URL.revokeObjectURL(img.src); // Clean up after yourself.
                      };
                      img.src = window.URL.createObjectURL(blob);
                      
                      span.appendChild(img);
                      _this.img_zone.appendChild(span); 
                  }
                };
                xhr.send();
            })(l[i],i);
        }
		
    },
    server_remove:function(f_name){
        var xhr = new XMLHttpRequest();
        xhr.open('GET',"/delete?fname="+f_name, true);
        xhr.onload = function(e) {
                  if (this.status == 200) {
                      
                  }
        }
        xhr.send();
    },
    del_img:function(){
        var _this=this,del=this.cont.getElementsByClassName("delete")[0];
        del.addEventListener("click",function(){
              if (_this.index !=null) {
                _this.server_remove(_this.index.getAttribute("url"));
                _this.delfunc(_this.index.getAttribute("url"));
                _this.img_zone.removeChild(_this.index); 
                  _this.index=null;
            }
        },false);
    },
    add_img:function(){
        
        var _this=this,filein,save=this.cont.getElementsByClassName("save")[0];
        save.addEventListener("click",function(){
    
             _this.cont.getElementsByTagName("input")[0].click();  
        
        },false);
        filein=this.cont.getElementsByTagName("input")[0];
        
        filein.addEventListener("change",function(){
            _this.upoloadPictures(this.files);
            this.value="";
        },false);
    },
    
    upoloadPictures:function(files){
        var xhr = new XMLHttpRequest(); 
        var formData = new FormData();
        var _this=this;
        for(var i=0; i< files.length;i++) formData.append('img', files[i]);
        
        xhr.open('POST','/uploadImg',true);
        xhr.onload = function() {
            if (xhr.status == 200) {
                var list = JSON.parse(xhr.responseText).img;
                _this.loadbarre.style.display="none";
                _this.chfunc(list);  //the function is defined in the Event_manager (Add imgs to the mainobject)
                _this.loadPictures(list);
            }
        };
        
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var percentage = (e.loaded / e.total) * 100;
                console.log(percentage);
                _this.progress(parseInt(percentage));
            }
        }
        this.loadbarre.style.display="block";
        xhr.send(formData);
        
    },
    progress:function(per){
        this.loadbarre.getElementsByClassName("barre")[0].style.width=per+"%";
        this.loadbarre.getElementsByClassName("txt")[0].innerHTML="Chargement en cours.. "+per+" %"
    }
};