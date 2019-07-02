// Description : The event Manager is responsible of reacting to GUI or DOM triggers "events" (Click, dbclicks, move etc..)
function Event_Manager(DM, Vcontainer) {
	this.userFolder="";
    this.display_manager = DM;
    this.container = Vcontainer;
    this.Fi = new Fi_Manager();
    this.Floader = new File_loader();
    //this.outliner = new Outliner(this.Outlinerclick.bind(this));
    //this.imageLoader = new ImgLoader();
    this.fileChooser = new File_chooser();
}
Event_Manager.prototype={ 
 
	//---> Buttons Events on The GUI (New, indexation-file , Load-Model, Save-project, Open-project)
    Fi_bt_click:function(){
        var _this=this;
        $("bfi").addEventListener("click",function(){
            if (_this.Fi.visible == false  && _this.display_manager.modelLoaded){
                _this.Fi.visible = true;
                _this.Fi.show_data(_this.display_manager.main_object,function(){
					//this function is called inside (Fi_manager)
                    _this.display_manager.outliner.update(_this.display_manager.ROOT);  // if the name has changed -- change it too in the outliner
                 });
            }
        },false);
    },
    Load_bt_click:function(){
        var _this=this;
        var stat=0;
        $("load_model").addEventListener("click",function(){
            _this.Floader.select_files(_this.display_manager.main_object.Model3d,function(files){
                console.log(files);  
                _this.display_manager.main_object.Model3d=files;
                if (_this.display_manager.main_object.hasOwnProperty("subObjects") && _this.display_manager.main_object.subObjects.length != 0 ){
                    // display a message box to ask !  not implemented yet !
                    if (confirm(" Garder les fils (Annotation) ?") == true) {
                        alert("On garde les fils ! Veuillez repositionner les annotations");
                        // change the position of the annotation to 0,0,0
                        _this.display_manager.main_object.ResetChildpos();
                        _this.display_manager.reset_points_position();
                        stat=1;
                    } else {
                        _this.display_manager.main_object.Clear_subObjects();
                        _this.display_manager.outliner.update(_this.display_manager.ROOT);
                    }
                }
                _this.display_manager.add_3Dmodel(stat);
               
            });
        },false);
        
    },
    Save_bt_click:function(){
        var _this=this;
        $("save_project").addEventListener("click",function(){
            _this.fileChooser.affectFunction(function(){
                var folder=this.getProjectName();
                console.log(folder);

                if (folder!= "") {
                    this.saveProject(_this.display_manager.RootToJson(folder),folder);
                }
            }.bind(_this.fileChooser));
            _this.fileChooser.show("Enregistrer le projet","Enregistrer");
        },false);
    },
    Open_bt_click:function(){
		var _this=this;
		$("open_project").addEventListener("click",function(){
			_this.fileChooser.affectFunction(function(){
				var folder=this.getProjectName();
				if (folder!= "") {
					var fusion =false; //to know if we add another project to the current one
					if (_this.display_manager.main_object.parentobj!=null){
						fusion=true;
						alert("fuuusion !");
					}
					this.openProject(folder,_this.userFolder,function(jsonFile){
						_this.display_manager.JsonToRoot(jsonFile,_this.userFolder,fusion);
					},fusion);
                }
            }.bind(_this.fileChooser));
            _this.fileChooser.show("Ouvrir un projet","Ouvrir");
			
		},false);
	},
	New_bt_click:function(){
		var _this=this;
		$("reset_project").addEventListener("click",function(e){
			_this.display_manager.chooser.show(this.getBoundingClientRect().left-220,this.getBoundingClientRect().top+10,function(c){
				if (c!=""){
					init_ProjectFolder(_this.userFolder); //Should be already initialised
					_this.display_manager.reset_scene(c);
					_this.outliner.update(_this.display_manager.ROOT);
					
					if ( _this.display_manager.goToParent == false ) $("backto_parent").setAttribute("hidden","");
				}
			});
		},false);
	},
    Back_toparentClick:function(){
        var _this=this;
        $("backto_parent").addEventListener("click",function(){
             _this.display_manager.open_parentObject();   
        },false);  
    },
    win_resize_event:function(){
		var _this=this;
        window.addEventListener('resize',function(){
		 
		 _this.display_manager.onWindowResize.call(_this.display_manager);
		 if(_this.display_manager.chooser.visible){
		 	_this.display_manager.chooser.setpos($("reset_project").getBoundingClientRect().left-220,$("reset_project").getBoundingClientRect().top+10);
		 }
		 
	 },false);   
    },
    view_DbclickEvent:function(){
        _this=this;
        this.container.addEventListener("dblclick",function(event){
            event.preventDefault();
            console.log("x = "+event.clientX +" --  y = "+ event.clientY);
            if (_this.display_manager.main_object instanceof Edifice_model){ // Le DBclick uniquement sur les Eddifices
				_this.display_manager.make_annotation(event.clientX,event.clientY);
			}
        });
    },
	view_ClickEvent:function(){   //pour CACHER le chooser (choix entre eddifice ou Object)
		_this=this;
		this.container.addEventListener("click",function(){
			if(_this.display_manager.chooser.visible){
				_this.display_manager.chooser.hide();
			}
		},false);
	},
    view_MovEvent:function(){
        _this=this;  //Add current object to the scope
        this.display_manager.controls.addEventListener('change', function() {
            _this.display_manager.draw();
            _this.display_manager.project_all_to_2D();
        });  
    },
    init:function(userFolder){
		this.userFolder=userFolder;
        this.display_manager.init_scene();      // Delete all data and init the scene
        this.win_resize_event();    // Event related to changing the dimension of the window
        this.view_DbclickEvent();   // Events related to making annotation if click occurs on an object..
		this.view_ClickEvent();
        this.view_MovEvent();       // Events related to mouse moves on the 3D scene
        
		this.New_bt_click();
        this.Fi_bt_click();         // Events related to Fiche d'indexation..
        this.Load_bt_click();
        this.Save_bt_click();
		this.Open_bt_click();
        this.Back_toparentClick();  // Event related to going back to parent Object
    }
}
