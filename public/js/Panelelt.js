function Panelelt(tittle,Ok_tittle,Cancel_tittle,width,height){
    this.cancelFunction=null;
    this.okFunction=null;
   
    this.panel=document.createElement("div");
    this.panel.setAttribute("class","panel");  //To change to a standart class !
    this.panel.style.display="none";
    
    this.tittle = document.createElement("span");
    this.tittle.setAttribute("class","panel-tittle");
    this.tittle.innerHTML=tittle;
    
    this.panel_zone= document.createElement("div");
    this.panel_zone.setAttribute("class","panel-zone");
    this.panel_zone.style.width=width;
    this.panel_zone.style.height=height;
    
    this.panel_zone_content= document.createElement("div");
    this.panel_zone_content.setAttribute("class","panel-zone-content");
    
    this.panel_zone_btns= document.createElement("div");
    this.panel_zone_btns.setAttribute("class","panel-zone-btn");
    

    this.panel_zone_btns.innerHTML='<input type="button" class="panel-btn align-right" value="'+Cancel_tittle+'" /> ';
    this.panel_zone_btns.innerHTML+='<input type="button" class="panel-btn align-right" value="'+Ok_tittle+'" /> ';    
    this.panel_zone_btns.innerHTML+='<span class="clear"></span>';
    
    
    this.panel_zone.appendChild(this.panel_zone_content);
    this.panel_zone.appendChild(this.panel_zone_btns);
    
    
    this.panel.appendChild(this.tittle);
    this.panel.appendChild(this.panel_zone);
    
    document.body.appendChild(this.panel);    
    this.init_events();
}

Panelelt.prototype={
    add:function(content){
        this.panel_zone_content.appendChild(content);
    },

    setContent:function(content){
        
        this.panel_zone_content.innerHTML = content;

    },
    setTittle:function(t){
        this.tittle.innerHTML=t;
    },
    setOkTittle:function(t){
        this.panel_zone_btns.getElementsByTagName("input")[1].setAttribute("value",t);
    },
    select:function(query){
      return this.panel_zone.querySelector(query);  
    },
    init_events:function(){
        this.cancelEvent();
        this.okEvent();
        this.moveEvent();
    },
    cancelEvent:function(){
        var _this=this;
        this.panel_zone_btns.getElementsByClassName("panel-btn")[0].addEventListener("click",function(){
            _this.hide();
            if (_this.cancelFunction !=null ) _this.cancelFunction();
        },false);
    },
    okEvent:function(){
        var _this=this;
        this.panel_zone_btns.getElementsByClassName("panel-btn")[1].addEventListener("click",function(){
            if (_this.okFunction !=null ) _this.okFunction();
        },false);        
    },
    moveEvent:function(){
        var _this=this;        
        var start_x;
        var start_y;
        var start_l;
        var onMouseDown = function(event){
            start_x = event.clientX;
            start_y = event.clientY;
            start_l =_this.panel.offsetLeft;
            start_t =_this.panel.offsetTop;
            event.preventDefault();
            _this.tittle.addEventListener( 'mouseup',onMouseUp , false );
            _this.tittle.addEventListener( 'mousemove',onMouseMove, false );
        };
        var onMouseUp = function(event){
            _this.tittle.removeEventListener( 'mouseup', onMouseUp, false );
            _this.tittle.removeEventListener( 'mousemove', onMouseMove, false );
        };
        var onMouseMove = function(event){
            _this.panel.style.left = start_l + ( event.clientX - start_x)+ "px";
            _this.panel.style.top =start_t + ( event.clientY - start_y)+ "px";
        };
        this.tittle.addEventListener('mousedown',onMouseDown,false);
    },
    show:function(){
        this.panel.style.display="block";
    },
    hide:function(){
        this.panel.style.display="none";;
    },
    enableOk:function(){
        this.panel_zone_btns.querySelectorAll('input[type="button"]')[1].removeAttribute("disabled","");
    },
    disableOK:function(){
        this.panel_zone_btns.querySelectorAll('input[type="button"]')[1].setAttribute("disabled","");
    }
    
};