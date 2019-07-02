//this class represent the annotation mechanism
function Annotation(x,y,id,type,DM){    //cc is an object {container , camera , 3Dmodel}
    this.raycaster = new THREE.Raycaster();  // For all the collisions detection    
    this.clickfunction=null;
    this.hoverfunction=null;
    this.id = id;
    this.posx= x;
    this.posy=y;
    this.coord3D={
        x:0,
        y:0,
        z:0
    };
    this.DM=DM;  // this is the reference to the display manager
    this.dragged=false;
    this.newPos=false;  // to check if the new dragged in position is valide :))
    this.type=type;
    this.annt= this.make_annt(type); 
    this.init_events();  //needs to be implemented
}

Annotation.prototype = {
    set2Dpos:function(x,y){
        this.annt.style.top=y + "px";
        this.annt.style.left=x + "px";
    },
    set3Dpos:function(vector){
        this.coord3D.x=vector.x;
        this.coord3D.y=vector.y;
        this.coord3D.z=vector.z;
    },
    make_annt:function(type){
        var annot_dom = $("annot_container");
        var annt=document.createElement("div");
        if (type == "E" ){
            // Ediffice
            annt.setAttribute("class", "annotation");
        }else if (type== "O"){
            //ObjectID
            annt.setAttribute("class", "annotation object");
        }else {
            //Echantillon 
            annt.setAttribute("class", "annotation echantillon");  //css needs to be implemented
        }
        annt.innerHTML=this.id;
        annt.setAttribute("id", "annotation" + this.id);
        annt.style.top=(this.posy-30)+"px";
		annt.style.left=(this.posx-320)+"px";
        annot_dom.appendChild(annt);
        return annt;
    },
    init_events:function(){
        this.click_event();
        this.hover_event();
        this.drag_event();
    },
    click_event:function(){
        var _this=this;
        this.annt.addEventListener("click",function(){
            $("label").style.display="none";
            //console.log(_this.dragged);
            if(_this.dragged==false)   _this.clickfunction();
            //_this.dragged=false;
        },false);
    },
    hover_event:function(){
        var _this=this;
        this.annt.addEventListener("mouseover",function(){
            $("label").style.display="block";
			$("label").style.top=(this.offsetTop + 20)+"px";
            $("label").style.left=(this.offsetLeft + 20)+"px";
            //call getchildname  in Display_manager;
            $("label").innerHTML= (_this.hoverfunction!=null)?_this.hoverfunction(parseInt(this.innerHTML)-1):"Echantillon "+parseInt(this.innerHTML);  
        },false);
        this.annt.addEventListener("mouseout",function(){
                $("label").style.display="none";
                _this.dragged=false;
                _this.click=true;
                //console.log( _this.dragged);
		},false);
    },
    drag_event:function(){
        //dragging the annotation over the 3D model and change its position
        var annt=this.annt; 
        var _this=this;       
        var start_x;
        var start_y;
        var start_l;
        var pos;
        var onMouseDown = function(event){
            start_x = event.clientX;
            start_y = event.clientY;
            start_l =annt.offsetLeft;
            start_t =annt.offsetTop;
            startPOS= {    // This is the initial pos of the Annotation inside the container
                left:annt.style.left,
                top:annt.style.top
            };
           //_this.change_style("p");
            event.preventDefault();
            annt.addEventListener( 'mouseup',onMouseUp , false );
            annt.addEventListener( 'mousemove',onMouseMove, false );
        };
        var onMouseUp = function(event){
            annt.removeEventListener('mouseup', onMouseUp, false);
            annt.removeEventListener('mousemove', onMouseMove, false);
            if(_this.newPos == true) {
                _this.set3Dpos(pos);
                if (_this.type !="S") _this.DM.main_object.subObjects[_this.id-1].pos3d=pos;
                else _this.DM.main_object.samples[_this.id-1].pos3d=pos;
                _this.newPos=false;
            }else { //reset the initial position before the drag operation :)
                annt.style.left=startPOS.left;
                annt.style.top=startPOS.top;
            }
            _this.change_style("u");
            console.log(_this);
            if (annt.style.left == startPOS.left) _this.dragged=false;
        }
        var onMouseMove = function(event){
            annt.style.left = start_l + (event.clientX - start_x)+ "px";
            annt.style.top =start_t + (event.clientY - start_y)+ "px";
            _this.dragged=true;
            pos=_this.DM.unproject_to3D(event.clientX,event.clientY);
            if (pos == 0) { _this.newPos=false; _this.change_style("nv"); }
            else { _this.newPos=true; _this.change_style("mv"); }
        };
        annt.addEventListener('mousedown',onMouseDown,false);
    },
    change_style:function(stat){
        if (stat == "p") { //pressed stat

            if (this.type=="E") this.annt.setAttribute("class", "annotation pressed");
            else if (this.type=="O") this.annt.setAttribute("class", "annotation object pressed");
                else this.annt.setAttribute("class", "annotation Echantillon pressed");
        }else if (stat == "u") { //UP stat

            if (this.type=="E") this.annt.setAttribute("class", "annotation");
            else if (this.type=="O") this.annt.setAttribute("class", "annotation object");
            else this.annt.setAttribute("class","annotation Echantillon");

        }else if (stat == "mv"){  //Valid move
            if (this.type=="E") this.annt.setAttribute("class", "annotation pressed valid");
            else if (this.type=="O") this.annt.setAttribute("class", "annotation object pressed valid");
            else this.annt.setAttribute("class", "annotation Echantillon pressed valid");

        }else{ //unvalid move
            if (this.type=="E") this.annt.setAttribute("class", "annotation pressed unvalid");
            else if (this.type=="O") this.annt.setAttribute("class", "annotation object pressed unvalid");
            else this.annt.setAttribute("class", "annotation Echantillon pressed unvalid");
        }
    },
    project:function(){  
        var vector = new THREE.Vector3();
		var halfWidth = this.DM.c.clientWidth / 2;
		var halfHeight = this.DM.c.clientHeight / 2;
		vector.set(this.coord3D.x,this.coord3D.y,this.coord3D.z);
		vector.project(this.DM.camera);
		vector.x = Math.round(( vector.x * halfWidth ) + halfWidth);
        vector.y = Math.round(- ( vector.y * halfHeight ) + halfHeight);

        this.set2Dpos(vector.x,vector.y);
        this.checkvisible();
    },
    checkvisible:function(){
        var vector = new THREE.Vector3();
		vector.set(this.coord3D.x, this.coord3D.y, this.coord3D.z);
		this.raycaster.set(this.DM.camera.position, vector.sub(this.DM.camera.position).normalize());
		var intersects = this.raycaster.intersectObject(this.DM.scene.children[3], true);
		if (intersects.length > 0) {
			intersects[0].point.round();
			if (intersects[0].point.x == this.coord3D.x) {
				this.annt.style.opacity = "1";
			} else {
				this.annt.style.opacity = "0.3";
			}
		}
    }
};