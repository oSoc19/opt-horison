class ResultContainer{
    constructor(overlap, userIsochrones,center){
        this.overlap = overlap;//Feature
        this.userIsochrones = userIsochrones;//Featurecollection
        this.overlapCenter = center;// Point        
    }
}

export{ResultContainer};