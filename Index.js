var fs = require('fs');
var express = require('express');
var path    = require("path");
var bodyParser = require('body-parser');
var Busboy = require('busboy');

var app = express();
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//var jsonParser = bodyParser.json();


var userFolder;   //Current project folder !

function clearFolder(folderName){
    if (fs.existsSync("./public/Users/"+folderName)){
            fs.readdir("./public/Users/"+folderName+"/img", function(err, files) {
                for (var i=0;i<files.length;i++){
                    fs.unlinkSync("./public/Users/"+folderName+"/img/"+files[i]);
                }
             });
             fs.readdir("./public/Users/"+folderName+"/Models", function(err, files) {
                for (var i=0;i<files.length;i++){
                    fs.unlinkSync("./public/Users/"+folderName+"/Models/"+files[i]);
                }
             });
    }
}

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname+'/public/indexer.html'));
});

app.post('/login', function(req,res){

	var log = req.body;
	var valide = "no";
	fs.readFile("./public/Users/users.json", 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		listuser = JSON.parse(data); // to access the user / pwd fields !
			for(var i=0; i<listuser.length;i++){
				if( (log.user == listuser[i].user) && (log.pwd == listuser[i].pwd)) valide = "yes";
			}
		res.end(valide);   // send valide = True/False for the login operation
	});
});

app.get('/init/:userFolder',function(req,res){
    //Supprimer l'ancien contenu !!
	userFolder=req.params.userFolder;
	console.log("Le USER est ======>" + userFolder);
    clearFolder(userFolder);
    res.end("");
});

app.post('/upload',function(req,res){
    var busboy = new Busboy({ headers: req.headers });
    var files={};
    var bumpExist= false;

	busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {

		console.log('Field [' + fieldname + ']: value: ' + val);
		userFolder = val; //The user's folder
    });


	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('Uploading: ' + filename);
		console.log(fieldname + " : " +filename);

		var saveTo;

        if (fieldname == "objFile" ) {
            files.objFile = "Users/"+userFolder+"/Models/"+filename;
            saveTo = path.join('./public/Users/'+userFolder+'/Models/', filename);
        }
        else {
			if (fieldname == "texFile"){
				files.texFile ="Users/"+userFolder+"/img/"+filename;
				console.log("kaaayen texture !");
			}else{
				files.bumpFile ="Users/"+userFolder+"/img/"+filename;
				console.log("Kaaayen bump map");
				bumpExist=true;
			}
			saveTo = path.join('./public/Users/'+userFolder+'/img/', filename);
        }
        file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
		console.log('Upload complete');
		if (bumpExist==false) files.bumpFile ="";
		res.writeHead(200, { 'Connection': 'close' });
		console.log(files);
		res.end(JSON.stringify(files));
    });
    console.log("on recoit quelquechose");
    return req.pipe(busboy);
});

app.post('/uploadImg',function(req,res){
    var busboy = new Busboy({ headers: req.headers });
    var files={};
    files.img=[];

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log(fieldname + " : " +filename);
            files.img.push("Users/"+userFolder+"/img/"+filename);
            saveTo = path.join('./public/Users/'+userFolder+'/img/', filename);
            file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
      console.log('Upload complete');
      res.writeHead(200, { 'Connection': 'close' });
      res.end(JSON.stringify(files));
    });
    console.log("on recoit quelquechose");
    return req.pipe(busboy);
});

app.get('/delete', function (req, res) {

  if (fs.existsSync( "./public/"+req.query.fname)){
        fs.unlinkSync("./public/"+req.query.fname);
  }

  res.end();

});

//Retruns all the folder's projects names to the client side --- > To display them
app.get('/ProjectsName', function (req, res) {
  var R={};
    R.lf=[];
  fs.readdir("./public/Projects",function(err,files){

      for(var i=0;i< files.length;i++){
          R.lf.push(files[i]);
          console.log(files[i]);
      }
      res.end(JSON.stringify(R));
  });
});

app.post('/openProject',function(req,res){
	//get the project name and returns its  json file and calls copyToWorkFolder function ;)
	var data = req.body;
	userFolder = data.userFolder;
	var folderName = data.Projectname;
	if (fs.existsSync("./public/Projects/"+folderName)){
		fs.readFile("./public/Projects/"+folderName+"/index.json", 'utf8', function (err,data) {
  			if (err) {
    			return console.log(err);
  			}
			copyToWorkFolder(folderName,data.Fusion);
  			res.end(data);   // send project's JSON data to the client side (3D editor)
		});
	}
});

app.post('/saveProject',function(req,res){
    console.log(req.body);
    var data=req.body;
    if (fs.existsSync("./public/Projects/"+data.fname)){

		clearFolder(data.fname);

    }else { //create the directorie and its subdirectories !

        fs.mkdirSync("./public/Projects/"+data.fname);
        fs.mkdirSync("./public/Projects/"+data.fname+"/img");
        fs.mkdirSync("./public/Projects/"+data.fname+"/Models");
    }
	saveDatas(data.data,data.fname);
    res.end();
});

function saveDatas(Datajs,destFolder){

 fs.readdir("./public/Users/"+userFolder+"/img", function(err, files) {
        for(var i=0; i<files.length;i++)
            fs.createReadStream("./public/Users/"+userFolder+"/img/"+files[i]).pipe(fs.createWriteStream("./public/Projects/"+ destFolder +"/img/"+files[i]));
    });
    fs.readdir("./public/Users/"+userFolder+"/Models", function(err, files) {
        for(var i=0; i<files.length;i++)
            fs.createReadStream("./public/Users/"+userFolder+"/Models/"+files[i]).pipe(fs.createWriteStream("./public/Projects/"+ destFolder +"/Models/"+files[i]));
    });

    fs.writeFileSync("./public/Projects/"+ destFolder +"/index.json", JSON.stringify(Datajs, null, 4));

}

//--> this function is only used in the open project process !
function copyToWorkFolder(projectName, isFusion){   //The work folder is always the "NewProject" folder : Only copy img and 3d models

	if (fs.existsSync("./public/Projects/"+projectName)){
		if (isFusion == false) clearFolder(userFolder);
		fs.readdir("./public/Projects/"+projectName+"/img", function(err, files) {
        for(var i=0; i<files.length;i++)
            fs.createReadStream("./public/Projects/"+projectName+"/img/"+files[i]).pipe(fs.createWriteStream("./public/Users/"+userFolder+"/img/"+files[i]));
    	});

		fs.readdir("./public/Projects/"+projectName+"/Models", function(err, files) {

			for(var i=0; i<files.length;i++)
            	fs.createReadStream("./public/Projects/"+projectName+"/Models/"+files[i]).pipe(fs.createWriteStream("./public/Users/"+userFolder+"/Models/"+files[i]));
    	});
	}
}


var server = app.listen(80, function(){
   console.log('Listening on port 80..');
});
