//this is used inside the Display manager :) invoked in the double click event over a model
function Chooser(){

    this.callback=null;  //Function to call when the user make a choice !
	this.visible = false;
	this.CB_called = false;

    this.panel=document.createElement("div");
    this.panel.setAttribute("class","EO_chooser");

    this.panel.innerHTML='<span class="EO_option" c="E"><img src="img/Building.png">                    <p>Ediffice</p></span>';
    this.panel.innerHTML+='<span class="EO_option" c="O"><img src="img/Object.png">                    <p>Objet</p></span>';
    this.panel.innerHTML+='<span class="EO_option" c="S"><img src="img/Echantillon.png">                    <p>Echantillon</p></span>';
    this.init_event();
    this.hide();
    $("panel-right").appendChild(this.panel);
}
Chooser.prototype={

    init_event:function(){
        var _this=this;
        var spans=this.panel.getElementsByClassName("EO_option");
        for(var i=0; i< spans.length;i++){
            spans[i].addEventListener("click",function(){
				_this.CB_called=true;
				_this.hide();
                _this.callback(this.getAttribute("c"));
            },false);
        }
    },
	setpos:function(x,y){
		this.panel.style.display="block";
        console.log("X = "+ x +" Y = "+y);
        this.panel.style.left=(x-320)+"px";
        this.panel.style.top=(y-30)+"px";
	},
    show:function(x,y,hasModel,Callback){
		console.log("CHOOSER is open !")
		this.CB_called = false;
        this.callback=Callback;
        if (hasModel == false) this.panel.getElementsByClassName("EO_option")[2].style.display="none";
        else  this.panel.getElementsByClassName("EO_option")[2].style.display="inline-block";

        this.setpos(x,y);
		this.visible=true;
    },
    hide:function(){
        this.panel.style.display="none";
		this.visible=false;
		if (this.CB_called == false && this.callback != null){
			this.callback("");
			console.log("CallBack function not called (empty param)!");
		}
		console.log("CHOOSER is closed !");
    }

};
