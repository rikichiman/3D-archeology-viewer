function Display_Manager(O, c) {   //O : main Object Model - c : container

	this.chooser = new Chooser();
	this.outliner = new Outliner(this.ObjectSelected.bind(this)); // reponsible for showing the tree structure
	this.imageLoader = new ImgLoader();  //responsible for displaying pictures

	this.c = c;
	this.main_object = O;
	this.ROOT = O;

	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(45, c.clientWidth / c.clientHeight, 0.1, 1000);
	this.raycaster = new THREE.Raycaster();  // For all the collisions detection 
	//this.object3D = new THREE.Object3D();    // Used in projection operations (we change only the position)
	this.r = new renderer(c);
	this.controls = new THREE.OrbitControls(this.camera, this.r.getdElt());  //control for the camera -- The second parameter is for the target of mouse events

	this.list_point = new Array();  // where we keep annotations (objects)
	this.modelLoaded = false;
	this.goToParent = false;
	this.oid = 0;  // Id's attribués aux Objets pour être reperés dans l'arborescence
	this.sid = 0; //Id's attribués aux echantillons de chaque
	this.nbr = 0;  //Number of annotations

	this.outliner.update(this.ROOT);  //start showing the root node in the outliner
	this.init_imgLoader();
}

Display_Manager.prototype = {
	//Objectif: Show the 3D content  + Add annotation to the displayed content 

	JsonToRoot: function (jsonFile, userFolder, isFusion) {  //isFusion Boolean varialble !
		var oid;  // init the object's ID
		var ROOT;
		function changeFolder(path) {  //Make the path point back to NewProject folder
			var s;
			if (path != "") {

				s = path.split("/");
				s[0] = "Users"
				s[1] = userFolder;
				s = s.join("/");
				console.log(s);
				return s;
			}
			return "";
		}
		//Transform the File to the Mainbject and display its root !
		function traverseJson(root, jsroot) {
			var rub = Object.getOwnPropertyNames(jsroot.ifile);
			root.Model3d.objFile = changeFolder(jsroot.model.objFile);
			root.Model3d.texFile = changeFolder(jsroot.model.texFile);
			root.Model3d.bumpFile = changeFolder(jsroot.model.bumpFile);
			if (root instanceof Edifice_model) {
				console.log(jsroot);
				//insert indexfile datas
				for (var i = 0; i < rub.length; i++) {
					var subobj = jsroot.ifile[rub[i]];
					var subprop = Object.getOwnPropertyNames(subobj);
					if ((rub[i] != "polhe") && (rub[i] != "fca") && (rub[i] != "photos")) {
						for (var j = 0; j < subprop.length; j++) {
							root.ifile[rub[i]][subprop[j]].val = subobj[subprop[j]];
						}
					} else {
						if (rub[i] == "fca") {
							root.ifile[rub[i]][subprop[0]].val = subobj[subprop[0]];
							for (var k = 0; k < subobj[subprop[1]].length; k++) {
								root.ifile[rub[i]].fonc.fields.fc.val.push(subobj[subprop[1]][k]);
								root.ifile[rub[i]].fonc.fields.dt.val.push(subobj[subprop[2]][k]);
							}
						} else {
							if (rub[i] == "polhe") {


							} else {
								//Images..
								for (var k = 0; k < subobj.length; k++) {
									root.ifile[rub[i]].push(changeFolder(subobj[k]));
								}
							}
						}
					}
				}
				//Create subObjects..
				for (var i = 0; i < jsroot.subObjects.length; i++) {
					oid++;
					if (jsroot.subObjects[i].Object_ref.type == "E") {
						var o = new Edifice_model("E" + oid);
					} else {
						var o = new Objectid_model("O" + oid);
					}
					var p = {};
					o.parentobj = root;
					var s = new THREE.Vector3();
					s.set(jsroot.subObjects[i].pos3d.x, jsroot.subObjects[i].pos3d.y, jsroot.subObjects[i].pos3d.z);
					p.pos3d = s.round();
					p.Object_ref = traverseJson(o, jsroot.subObjects[i].Object_ref);
					root.Add_subObject(p); // Add subobject o !
				}
			} else {  // instance of OBJECTID

				// insert indexfile datas..  TODO !!   We HAVE to do it !!

			}
			return root;  //this is optional
		}
		if (isFusion == false) {
			oid = 0;

			this.reset_scene();
			if ((jsonFile.type == "E") && (this.ROOT instanceof Edifice_model) == false) {
				this.ROOT = new Edifice_model("E" + oid);
				console.log("ON change la racineeeee");
			} else if ((jsonFile.type == "O") && (this.ROOT instanceof Objectid_model) == false) {
				this.ROOT = new Objectid_model("O" + oid);
			}
			ROOT = this.ROOT;
		} else {
			oid = this.oid + 1;
			ROOT = this.main_object;
		}

		ROOT = traverseJson(ROOT, jsonFile);  //the var ROOT keep a reference on a certain node in the tree
		this.oid = oid;


		if (isFusion == false) this.main_object = this.ROOT;
		console.log(this.main_object);
		//this.add_3Dmodel();
		//this.draw_annotations();
		this.show_content(0);
	},
	RootToJson: function (ProjectName) {
		var jf = {};
		var ROOT = this.ROOT;

		function changeFolder(path) {
			var s;
			if (path != "") {
				s = path.split("/");
				s[0] = "Projects";
				s[1] = ProjectName;
				s = s.join("/");
				return s;
			}
			return "";
		}

		var result = (function traverse(root) {
			var jf = {};
			var rub = Object.getOwnPropertyNames(root.ifile);
			jf.ifile = {};
			if (root instanceof Edifice_model) {
				jf.subObjects = [];
				jf.type = "E";
				for (var i = 0; i < root.subObjects.length; i++) {

					jf.subObjects.push(
						{
							Object_ref: traverse(root.subObjects[i].Object_ref),
							pos3d: {
								x: root.subObjects[i].pos3d.x,
								y: root.subObjects[i].pos3d.y,
								z: root.subObjects[i].pos3d.z
							}
						});
				}

				for (var i = 1; i < rub.length - 1; i++) {
					var subobj = root.ifile[rub[i]];
					var subprop = Object.getOwnPropertyNames(subobj);
					jf.ifile[rub[i]] = {};
					if (i != 3 && i != 5) {
						for (var j = 1; j < subprop.length; j++) {
							jf.ifile[rub[i]][subprop[j]] = subobj[subprop[j]].val;
						}
					} else {
						if (i == 3) {
							jf.ifile[rub[i]][subprop[1]] = subobj[subprop[1]].val;

							var ssubprop = Object.getOwnPropertyNames(subobj.fonc.fields);
							for (var k = 1; k < ssubprop.length; k++) {

								jf.ifile[rub[i]][ssubprop[k]] = [];
								for (var l = 0; l < subobj.fonc.fields[ssubprop[k]].val.length; l++) {

									jf.ifile[rub[i]][ssubprop[k]].push(subobj.fonc.fields[ssubprop[k]].val[l]);
								}
							}

						} else { //i==5
							var ssubobj = subobj.per.fields.poo;
							jf.ifile[rub[i]].poo = [];
							for (var j = 0; j < ssubobj.val.length; j++) {
								jf.ifile[rub[i]].poo.push(ssubobj.val[j]);
							}

						}
					}
				}
			}
			else {
				jf.type = "O";
				for (var i = 1; i < rub.length - 1; i++) {
					var subobj = root.ifile[rub[i]];
					var subprop = Object.getOwnPropertyNames(subobj);
					jf.ifile[rub[i]] = {};
					for (var j = 1; j < subprop.length; j++) {
						jf.ifile[rub[i]][subprop[j]] = subobj[subprop[j]].val;
					}
				}
			}
			jf.ifile.photos = [];
			for (var j = 0; j < root.ifile.photos.length; j++) {
				console.log(root.ifile.photos[j]);
				jf.ifile.photos.push(changeFolder(root.ifile.photos[j]));
			}
			jf.model = {};
			jf.model.objFile = changeFolder(root.Model3d.objFile);
			jf.model.texFile = changeFolder(root.Model3d.texFile);
			jf.model.bumpFile = changeFolder(root.Model3d.bumpFile);
			return jf;
		})(ROOT);

		console.log(result);

		return result;
	},


	reset_scene: function (C) {   // Used in the NewProject click event  (Event_manager)

		if (this.ROOT instanceof Edifice_model) {
			this.ROOT.Clear_subObjects();
		}
		this.clear_scene();
		this.oid = 0;
		this.modelLoaded = false;
		this.goToParent = false;
		if ((C == 'E') && (this.ROOT instanceof Edifice_model) == false) {
			this.ROOT = new Edifice_model("E" + 0);
		} else if ((C == 'O') && (this.ROOT instanceof Objectid_model) == false) {
			this.ROOT = new Objectid_model("O" + 0);
		}
		this.main_object = this.ROOT;
		console.log(this.main_object);
		this.draw();
	},

	init_scene: function () {
		var directionalLight;
		this.gridhelp = new THREE.GridHelper(10, 10);
		this.gridhelp.name = "grille";
		this.scene.add(this.gridhelp);
		directionalLight = new THREE.HemisphereLight(0xFFFFFF, 0xffffff, 0.6);
		this.scene.add(directionalLight);
		directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(-10, 20, 20);
		directionalLight.intensity = 0.5;
		this.scene.add(directionalLight);

		this.camera.position.x = -10;
		this.camera.position.y = 20;
		this.camera.position.z = 20;
		this.camera.lookAt(this.scene.position);
		this.fix_control_UPdateProblem();
		this.draw();
	},
	draw: function () {
		this.r.render(this.scene, this.camera);
	},


	fix_control_UPdateProblem: function () {
		that = this;
		this.c.addEventListener("mousewheel", function () {
			that.controls.update();
		}, false);
	},

	//--------------------------------------------------------------------------------------
	add_3Dmodel: function (stat) {  // Improve this function
		var _this = this;

		this.clear_scene(stat);

		if (this.main_object.Model3d.objFile != "") {
			// Add the .obj Model with its textures etc to the scene
			var manager = new THREE.LoadingManager();
			manager.onProgress = function (item, loaded, total) {
				console.log(item, loaded, total);
			};
			// Load 3D .obj MODEL
			var obj_loader = new THREE.OBJLoader(manager);
			obj_loader.load(this.main_object.Model3d.objFile, function (object) {
				console.log("the model is Here !");
				var tex_loader = new THREE.TextureLoader(manager);
				tex_loader.load(_this.main_object.Model3d.texFile, function (image) {
					console.log("The texture file is here !");

					if (_this.main_object.Model3d.bumpFile != "") {
						console.log("The bump file is here !");
						var bump_loader = new THREE.TextureLoader(manager);
						bump_loader.load(_this.main_object.Model3d.bumpFile, function (bimage) {

							//normal.image = bimage;
							//normal.needsUpdate = true;
							object.traverse(function (child) {

								if (child instanceof THREE.Mesh) {
									child.geometry.computeFaceNormals(true);
									child.geometry.computeVertexNormals(true);

									child.material.map = image;
									child.material.normalMap = bimage;
									child.material.normalScale.x = 0.8;
									child.material.normalScale.y = 0.8;
									child.material.shininess = 2;
									child.material.side = THREE.DoubleSide;
								}
							});
							object.position.x = 0;
							object.position.y = 0.5;
							object.position.z = 0;
							object.name = "artefact";
							_this.scene.add(object);
							_this.draw();
							_this.modelLoaded = true;
						}, function (xhr) {
							console.log((xhr.loaded / xhr.total * 100) + '% loaded');
						});
					} else {

						object.traverse(function (child) {
							if (child instanceof THREE.Mesh) {
								child.material.map = image;
							}
						});
						object.position.x = 0;
						object.name = "artefact";
						_this.scene.add(object);
						_this.draw();
						_this.modelLoaded = true;
					}
				});
			});

		} else { this.modelLoaded = false; this.draw(); }
	},
	//clear_scene is used in add_3Dmodel
	clear_scene: function (stat) {
		if (this.scene.children[3]) {
			this.scene.remove(this.scene.children[3]);  //supprimer le model 3D affiché
		}
		if (stat == 0) this.clear_points();
	},
	//clear_point is used in clear_scene function
	clear_points: function () {
		for (var i = 0; i < this.list_point.length; i++) {
			//this.scene.remove(this.list_point[i].pos3d);
			$("annot_container").removeChild(this.list_point[i].annt); //annt is a property of the object Annotation
		}
		this.list_point.splice(0, this.list_point.length);  // Clear the array !
		this.nbr = 0;  // Reinitialise le nombre d'annotations à 0
		this.sid = 0;  // Reinitialise le nombre d'echantillon à 0
	},
	reset_points_position: function () {  //used when we choose to keep the children when altering the 3D model
		for (var i = 0; i < this.list_point.length; i++) {
			this.list_point[i].set3Dpos({ "x": 0, "y": 0, "z": 0 });
		}
	},
	draw_annotations: function () {
		var c;
		var _this = this;
		if (this.main_object instanceof Edifice_model) {
			for (var i = 0; i < this.main_object.subObjects.length; i++) {
				if (this.main_object.subObjects[i].Object_ref instanceof Edifice_model)
					c = "E";
				else
					c = "O";
				this.create_annotation(0, 0, c, this.main_object.subObjects[i].pos3d, this);
			}
		}

		// Add a loop to draw samples :))
		for (var i = 0; i < this.main_object.samples.length; i++) {
			this.create_annotation(0, 0, "S", this.main_object.samples[i].pos3d, this);
		}

		this.outliner.update(this.ROOT);  //update the outliner view
		this.project_all_to_2D();
	},
	//--------------------------------------------------------------------------------------

	//This function is used inside open child and open parent :))
	show_content: function (UpdateOutliner) {
		this.add_3Dmodel(0);
		if (UpdateOutliner == 1) this.outliner.selectnode(this.main_object.oid);  //Highlight the selected node
		this.Loadpics(this.main_object.ifile.photos);  //Display picture related to the 3D object
		this.draw_annotations();
		if (_this.display_manager.goToParent == true) $("backto_parent").removeAttribute("hidden");
		else $("backto_parent").setAttribute("hidden", "");
	},
	open_parentObject: function () {
		this.main_object = this.main_object.parentobj;
		if (this.main_object.parentobj == null) this.goToParent = false;

		this.show_content(1);
	},
	open_childObject: function (id) {
		this.main_object = this.main_object.GetObject(id).Object_ref;
		this.goToParent = true;

		this.show_content(1);
	},
	//--------------------------------------------------------------------------------------


	getChildName: function (id) {  // Used in HOVER event (Annotation)
		var child = this.main_object.GetObject(id);

		if (child.Object_ref instanceof Edifice_model)
			t = child.Object_ref.ifile.ref.ne.val;
		else
			t = child.Object_ref.ifile.cat.titre.val;

		if (t != "") return t;
		else return this.outliner.getNodeTitle(child.Object_ref.oid); //the outliner will find the node text associated for us to display :))
	},


	// Find Object based on its OID  used in ObjectSelected function !
	find_Object: function (oid) {
		var R = this.ROOT;
		var node = (function search(R, oid) {
			var n = "";
			if (R.oid == oid)
				n = R;
			else
				if (R instanceof Edifice_model) {
					for (var i = 0; i < R.subObjects.length; i++) {
						n = search(R.subObjects[i].Object_ref, oid);
						if (n != "") break;
					}
				}
			return n;
		})(R, oid);
		return node;
	},
	ObjectSelected: function (oid) {  // called when the user select a node in the Outliner :)
		var n = this.find_Object(oid);
		if (n.parentobj != null) this.goToParent = true;
		else this.goToParent = false;
		this.main_object = n;
		this.show_content(0); // no need to update the outliner :)
	},

	//----------------------------------------------------------------------------------------

	unproject_to3D: function (X, Y) {
		mouseVector = new THREE.Vector3();
		mouseVector.set(((X - 320) / this.c.clientWidth) * 2 - 1, -((Y - 30) / this.c.clientHeight) * 2 + 1, 0.5);
		mouseVector.unproject(this.camera);
		this.raycaster.set(this.camera.position, mouseVector.sub(this.camera.position).normalize());
		if (this.scene.children[3]) { //check if there is a 3D model in the scene
			var intersects = this.raycaster.intersectObjects(this.scene.children[3].children, false);
			if (intersects.length > 0) {
				return intersects[0].point.round();
			}
		}
		return 0;
	},    //returns the 3d position of the intersection between mouse RAY and object
	make_annotation: function (X, Y) {
		var p = {}, o, delt, choice;
		var _this = this;
		p3d = this.unproject_to3D(X, Y);
		if (this.main_object.hasModel() == true && p3d != 0){
			this.chooser.show(X, Y,true, function (c) {
				if (c != "") {
					if (c == "E" || c == "O") {
						_this.oid++;
						if (c == "E") o = new Edifice_model("E" + _this.oid);
						else o = new Objectid_model("O" + _this.oid);
	
						o.parentobj = _this.main_object;  //keep reference to the parent 3d model
						p.Object_ref = o;
						p.pos3d = p3d;
						_this.main_object.Add_subObject(p);  // P is an object containning { {Vector3},{JSreferenceObject} }
						_this.outliner.update(_this.ROOT);
					} else {
						//create sample and add it to the mainObject 
						o = new Echantillon("date",p3d);
						_this.main_object.samples.push(o);
					}
					_this.create_annotation(X, Y, c, p3d);
				}
			});
		}else{
			if (this.main_object.hasModel() == false){
				this.chooser.show(X, Y,false, function (c) {
					if (c != "") {
							_this.oid++;
							if (c == "E") o = new Edifice_model("E" + _this.oid);
							else o = new Objectid_model("O" + _this.oid);
		
							o.parentobj = _this.main_object;  //keep reference to the parent 3d model
							p.Object_ref = o;
							p.pos3d = { "x": 0, "y": 0, "z": 0 };
							_this.main_object.Add_subObject(p);  // P is an object containning { {Vector3},{JSreferenceObject} }
							_this.outliner.update(_this.ROOT);
					}
				});
			}
		}
	},
	create_annotation: function (x, y, c, pos3d) {
		var _this = this;
		if (c!="S") this.nbr++;
		else this.sid++;
		
		annt = new Annotation(x, y, (c!="S")?this.nbr:this.sid, c, this); //Create annot object
		annt.set3Dpos(pos3d);

		annt.clickfunction = function () {
			if (this.type != "S")
				_this.open_childObject(this.id - 1);
			else {
				// event for the sample annotation
				console.log("On click sur un echantillon !");
			}
		};
		annt.hoverfunction =(c!="S")? this.getChildName.bind(this):null;
		this.list_point.push(annt); // Push the "Annt Object" with it's 3d position
	},

	onWindowResize: function () {
		this.camera.aspect = this.c.clientWidth / this.c.clientHeight;
		this.camera.updateProjectionMatrix();
		this.r.renderer.setSize(this.c.clientWidth, this.c.clientHeight);
		this.draw();
		this.project_all_to_2D();
	},


	project_all_to_2D: function () {
		if (this.main_object.hasOwnProperty("subObjects") && this.modelLoaded) {
			for (var i = 0; i < this.list_point.length; i++) {
				this.list_point[i].project();
			}
		}
	},

	//-------------------------> imageLoader functions..  --------------------------------------------
	init_imgLoader: function () {
		var _this = this;
		this.imageLoader.chfunc = function (imglist) {
			_this.addpictures(imglist);
		};
		this.imageLoader.delfunc = function (fname) {
			_this.removePic(fname);
		}
	},
	addpictures: function (list) {
		this.main_object.addpictures(list);
	},
	removePic: function (fname) {
		//To complete  !!!
		this.main_object.removePic(fname);
	},
	Loadpics: function (list) {
		//console.log("haha on charge les pics");
		this.imageLoader.clearPics();
		this.imageLoader.loadPictures(list);
	}
}