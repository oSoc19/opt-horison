export default class ResultContainer {
    /**This class is a container for the results used by the UI.
     * It contains:
     *  -The overlap of all isochrones.
     *  -The isochrones generated for each user, this is used to display on the map.
     *  -The center of the overlapping area.
    */

    constructor(overlap, userIsochrones, center){
        this.overlap = overlap; //Feature
        this.userIsochrones = userIsochrones;//Featurecollection
        this.overlapCenter = center; // Point
    }
};

export { ResultContainer };
