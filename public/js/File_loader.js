function File_loader(){
    
    this.fl_panel=new Panelelt("Charger un model 3D","Ok","Annuler",500,260);
    this.init_dom();
    this.init_event();
    this.callback=null;
    this.files={};
    this.o=false;
    this.t=false;
}


File_loader.prototype={
  
    init_dom:function(){
        
        var content='<div id="fichier_obj" class="fichier_elt"><span>Fichier au format .obj</span><input id="" type="text" readonly><input type="file" id="input_obj" hidden></div><div id="texture_obj" class="fichier_elt">                    <span>Image texture </span> <input type="text" readonly><input type="file" id="input_tex" hidden=""> </div> <div id="TexNormal_obj" class="fichier_elt"><span>Image Bump</span><input id="" type="text" readonly><input type="file" id="input_bump" hidden></div>';
            
            this.fl_panel.setContent(content);
            
            //$("fopen").setAttribute("disabled","");
    },
    init_event:function(){
        var _this=this;
             
        this.fl_panel.okFunction= function(){
			var bump_exist = false;
            var formData = new FormData();
            obj = _this.fl_panel.select("#fichier_obj #input_obj").files[0];
            tex = _this.fl_panel.select("#texture_obj #input_tex").files[0];    
            if ( _this.fl_panel.select('#TexNormal_obj input[type=text]').value!="") {
				bump = _this.fl_panel.select("#TexNormal_obj #input_bump").files[0];    
			}else bump="";
			
			xhr = new XMLHttpRequest();    
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    // Handle response.
                    _this.callback(JSON.parse(xhr.responseText)); // handle response. In the Event_manager
                    _this.hide_dom();
                }
            };
			formData.append('user','omor');
            formData.append('objFile', obj);
            formData.append('texFile',tex);
			if (bump!="") formData.append('bumpFile',bump);
            xhr.open('POST','/upload',true);
            xhr.send(formData);
            _this.fl_panel.disableOK();
        };
        this.fl_panel.disableOK();
        this.fl_panel.select("#fichier_obj #input_obj").addEventListener("change",function(){
            if (this.files[0]){
   
                _this.fl_panel.select("#fichier_obj input").setAttribute("value",this.files[0].name);
                _this.o=true;
            }
            else{
                _this.fl_panel.select("#fichier_obj input").setAttribute("value","");
                _this.o=false;
            }
            
            _this.check_Okbtn();
        },false);

        this.fl_panel.select("#texture_obj #input_tex").addEventListener("change",function(){
            
            if (this.files[0]){
                _this.fl_panel.select("#texture_obj input").setAttribute("value",this.files[0].name);
                _this.t=true;
            }
            else{
                _this.fl_panel.select("#texture_obj input").setAttribute("value","");
                _this.t=false;
            }
            _this.check_Okbtn();
        },false);
        
		this.fl_panel.select("#TexNormal_obj #input_bump").addEventListener("change",function(){
            
            if (this.files[0]){
                _this.fl_panel.select("#TexNormal_obj input").setAttribute("value",this.files[0].name);
            }
            else{
                _this.fl_panel.select("#TexNormal_obj input").setAttribute("value","");
            }
        },false);
		
        this.fl_panel.select("#fichier_obj input").addEventListener("click",function(){
            
            _this.fl_panel.select("#fichier_obj #input_obj").click();
 
        },false);
        
        this.fl_panel.select("#texture_obj input").addEventListener("click",function(){
  
            _this.fl_panel.select("#texture_obj #input_tex").click();
 
        },false);
		
		this.fl_panel.select("#TexNormal_obj input").addEventListener("click",function(){
  
            _this.fl_panel.select("#TexNormal_obj #input_bump").click();
 
        },false);
  
    },
    hide_dom:function(){
        this.fl_panel.hide();
        this.callback=null;
    },
    show_dom:function(){
        //this.fl_panel.select("#texture_obj #input_tex").value="";
        //this.fl_panel.select("#fichier_obj #input_obj").value="";
        this.fl_panel.show();
    },
    select_files:function(objfiles,callback){
        this.fl_panel.select("#fichier_obj input").setAttribute("value",objfiles.objFile);
        this.fl_panel.select("#texture_obj input").setAttribute("value",objfiles.texFile);
		this.fl_panel.select("#TexNormal_obj input").setAttribute("value",objfiles.bumpFile);
        this.show_dom();
        this.callback=callback;
    },
    get_text_value:function(){
        var _this=this;
        this.files={
            objFile:_this.fl_panel.select("#fichier_obj input").getAttribute("value"),
            texFile:_this.fl_panel.select("#texture_obj input").getAttribute("value")
        }
    },
    check_Okbtn:function(){
        if ( (this.o ==false || this.t == false) ) this.fl_panel.disableOK();
        else this.fl_panel.enableOk();
    }
    
};