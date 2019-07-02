var renderer = function(c){
    this.renderer = new THREE.WebGLRenderer( { alpha: true });
    //this.renderer.setClearColor(0xEEEEEE);
    this.renderer.setSize(c.clientWidth, c.clientHeight);
    c.appendChild( this.renderer.domElement );
};

renderer.prototype.render = function(scn,cam){
    this.renderer.render(scn, cam);   
}
renderer.prototype.getdElt = function(){
    return this.renderer.domElement; 
}