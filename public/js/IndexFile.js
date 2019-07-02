//This constructor describes the four "rubric" of the Minimal Indexation file
function IndexFile(){
    this.saved=true;
    // 1- Nom et réferences
    this.ref={
        label:"Nom et réferences",
        ne: {repeat:"n",label:"Nom de l'edifice",val:""},
        nur:{repeat:"n",label:"Numéro unique de réference",val:""},
        ddr:{repeat:"n",label:"Date de rédaction",val:""},
        oa:{repeat:"n",label:"Organisme auteur de la notice",val:""},
    };
    // 2- Localisation
    this.local={
        label:"Localisation",
        etat:{repeat:"n",label:"Etat",val:""},
        dg:{repeat:"n",label:"Division géographique",val:""},
        sdg:{repeat:"n",label:"Subdivision géographiqe",val:""},
        ssdg:{repeat:"n",label:"Sous-subdivision géographique",val:""},
        dp:{repeat:"n",label:"Désignation postale",val:""},
        nv:{repeat:"n",label:"Numéro dans la voie",val:""},
        ntv:{repeat:"n",label:"Nom et type de voie",val:""},
        ville:{repeat:"n",label:"Ville ou village",val:""},
        cp:{repeat:"n",label:"Code postal",val:""},
        cx:{repeat:"n",label:"Coordonnée X",val:""},
        cy:{repeat:"n",label:"Coordonnée Y",val:""},
        sc:{repeat:"n",label:"Système cartographique",val:""},
    
    };
    // 3- Fonction et catégorie architecturale
    this.fca={
        label:"Fonction et catégorie architecturale",
        cat:{repeat:"n",label:"Catégorie",val:""},
        fonc:{
            repeat:"y",
            fields:{
                label:"Fonction",
                fc:{repeat:"n",label:"Fonction",val:[]},  //fct1, fct2,..
                dt:{repeat:"n",label:"Date",val:[]}  //"1920","1925"
            }
        }
    };
    // 4- Datation   --- TODO : Considerer les champs qui se repetent !!
    this.datation={
        label:"Datation",
        per:{repeat:"n",label:"Période",val:""},
        sie:{repeat:"n",label:"Siècle",val:""},
    };
    // 5- Personnes et organismes associés à l'histoire de l'édifice
    this.polhe={
        label:"Personnes et organismes associés à l’histoire",
        per:{
            repeat:"y",
            fields:{
                label:"Personne",
                poo:{repeat:"n",label:"Personne",val:[{name:"Amine",roles:[{role:"president",date:"2012"},{role:"soldat",date:"2020"}]},{name:"Speed",roles:[{role:"president",date:"2012"},{role:"soldat",date:"2020"}]}]}, // Format :     {name:"",roles:[{role:"",date:""},{role:"",date:""},...]}
                role:{
                    repeat:"y",
                    fields:{
                        label:"Role",
                        ro:{repeat:"n",label:"Role"},
                        dtr:{repeat:"n",label:"Date"},
                    }
                }
            }
        }
     };
    // 6- Matériaux de construction et techniques
    this.MCT={
        label:"Matériaux de construction et techniques",
        mtgo:{repeat:"n",label:"Matériaux du gros œuvre",val:""},
        mdc:{repeat:"n",label:"Matériaux de couverture",val:""},
    };     
    // 7- Etat de conservation
    this.ec={
        label:"Etat de conservation",
        egdc:{repeat:"n",label:"Etat général de conservation",val:""}
    };
    // 8- Protection / status juridique
    this.psj={
        label:"Protection/statut juridique",
        tdp:{repeat:"n",label:"Type de protection",val:""},
        ndp:{repeat:"n",label:"Niveau de protection",val:""},
        ddp:{repeat:"n",label:"Date de protection",val:""}
    };
    // 9- Notes
    this.note={
        label:"Notes",
        ch:{repeat:"n",label:"Commentaire historique",val:""}
    };
    
    this.photos=[];
}

// Add some function to search info inside this object....LATER !