function ObjectID(){
    this.saved=false;

    // 1- Catégorie
    this.cat={
        
        label:"Catégories",
        type:{repeat:"n",label:"Type d’objet",val:""},
        dim:{repeat:"n",label:"Dimensions",val:""},
        met:{repeat:"n",label:"Matières et techniques",val:""},
        iem:{repeat:"n",label:"Inscriptions et marques",val:""},
        doe:{repeat:"n",label:"Date ou époque",val:""},
        fab:{repeat:"n",label:"Fabricant",val:""},
        sujet:{repeat:"n",label:"Sujet",val:""},
        titre:{repeat:"n",label:"Titre",val:""},
        ed:{repeat:"n",label:"éléments distinctifs",val:""},
        desc:{repeat:"n",label:"Description",val:""}      
        
    };
    
    // 2- Catégories supplémentaires (recommandées)
    this.catsup={
        label:"Catégories supplémentaires recommandées",
        noid:{repeat:"n",label:"Numéro d’Object ID",val:""},
        ea:{repeat:"n",label:"écrits apparentés",val:""},
        lod:{repeat:"n",label:"Lieu d’origine ou de découverte",val:""},
        rao:{repeat:"n",label:"Renvoi à d’autres objets apparentés",val:""},
        date:{repeat:"n",label:"Date de rédaction",val:""}        
    };
    
    this.photos=[];
}