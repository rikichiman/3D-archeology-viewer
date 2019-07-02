function Echantillon(date,pos3d){
    this.date=date;
    this.analyses = new Array();  // liste des analyses effectués sur cet echantillon
    this.pos3d={
        x:pos3d.x,
        y:pos3d.y,
        z:pos3d.z
    };
}

Echantillon.prototype.Addanalyse = function(A) {
    this.analyses.push(A);
};

