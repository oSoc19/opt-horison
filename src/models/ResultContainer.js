class ResultContainer{
    constructor(overlap, userIsochrones,center){
        this.overlap = overlap;//Feature
        this.userIsochrones = userIsochrones;//Featurecollection
        this.center = center;// Point        
    }
}

export{ResultContainer};