function Accordelt(n,tittle,content){
    
    if (n!="") this.tittle=  n +'- '+tittle;
    else this.tittle=tittle;
    
    this.divcont=document.createElement("div");
    this.divcont.setAttribute("class","accord-element");
    this.divcont.innerHTML='<span class="tittle"><span>&#x25BC;</span>&nbsp;' + this.tittle+'</span>'; // titre de l'accordeon
    
    this.acc_content=document.createElement("div"); //Zone pour les données de l'accordeon
    this.acc_content.setAttribute("class","accord-content");
    
    
    
    this.acc_content.innerHTML+=content;
    this.divcont.appendChild(this.acc_content);
    this.initCollapse();

    return this.divcont;
}

Accordelt.prototype.initCollapse=function(){
    var _this=this;
    this.divcont.children[0].addEventListener("click",function(){
        if(this.parentNode.children[1].style.display!="none"){
            this.children[0].innerHTML='&#x25BA;';
            this.parentNode.children[1].style.display="none";
        }else {
            this.children[0].innerHTML='&#x25BC;';
            this.parentNode.children[1].style.display="block";
        }
    },false);
 
    
};