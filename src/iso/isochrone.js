import Planner from 'plannerjs';
import intersect from '@turf/intersect';
import { Feature } from './Feature.js';
import { FeatureCollection } from './FeatureCollection.js';

let bosa = {};
let herman = {};
let KBC = {};
let Gaucheret = {};
bosa.longitude = 4.356331;
bosa.latitude = 50.860699;
herman.longitude = 4.350018;
herman.latitude = 50.865685;
KBC.longitude = 4.346777;
KBC.latitude = 50.860929;
Gaucheret.longitude = 4.360043;
Gaucheret.latitude = 50.864025;

/** beginning of multiOverlap algorithms.
async function multipleOverlap(locations,max){
    var generators =[];
    for(location of locations){
        var generator = await makegenerator(location); 
        generators.push(generator);       
    }
    var isochrones = [];
    for( generator of generators){
        var isochrone = await generateIsochroneFromGenerator(generator,max);
        isochrones.push(isochrone);
    }


}
function multipleIntersection(isochrones){
    var result = intersect(isochrones.pop(),isochrones.pop());
    while( result != null && isochrones.length >0){
        result = intersect(result,isochrones.pop());
    }
    if(result == null){
        console.error("no intersection found")
    }
    else{
        //do something with the result
        //question: do we want to return null if no intersection found? probobly right?
    }

}
*/

async function findoptimum(location1, location2, max){
    var generator1 = await makegenerator(location1);
    var generator2 = await makegenerator(location2);
    var collection1 = new FeatureCollection();
    var collection2 = new FeatureCollection();

    if (max < 5) {
        console.error("max should be bigger than 5")// replace this with proper error handling
    } else {
       var intervals = generateIntervals(max);
       console.log("intervals.length = " + intervals.length);
       var i = 1;
       var intersection = null;
       while (i < intervals.length && intersection == null ){
           var time = intervals[i];
           console.log("time = "+ time);
           var isochrone1 = await generateIsochroneFromGenerator(generator1,time);
           var isochrone2 = await generateIsochroneFromGenerator(generator2,time);
           collection1.addOneFeature(isochrone1);
           collection2.addOneFeature(isochrone2);
           intersection = intersect(isochrone1, isochrone2);
           i++;
        }
        if( intersection != null){
            console.log("start intersection");
            console.log(intersection.geometry.coordinates);
            console.log("end of intersection");
            return intersection;
        }
        else{
            //TODO: integrate this message in visuals
            console.log("There is no place for you to meet within " + max +" minutes");
            console.log(intersection);
            return collection1;
        }
       }
}

async function generateAllIsoChrones(location, max){
    let generator = await makegenerator(location);
    let collection = new FeatureCollection();
    let intervals = generateIntervals(max);
    for(let interval of intervals) {
        let isochrone = await generateIsochroneFromGenerator(generator,interval);
        collection.addOneFeature(isochrone);
        console.log("time of isochrone: " + isochrone.properties.time);
    }
    console.log("got out")
    return collection;
}

function generateIntervals(max){
    let NbOfIsos = 5;
    let delta = max/NbOfIsos;
    let intervals = [];
    for(let i = 1; i <= NbOfIsos; i++)  {
        intervals.push(i*delta);
    }
    return intervals;
}

async function generateIsochroneFromGenerator(generator,timeinminutes){
    var data = await generator.getIsochrone(scaleTime(timeinminutes), true);
    var isochrone = data.isochrones[0];//only take the first isochrone, don't take holes into account.
    var polygon = convertToPolygon(isochrone);
    var feature = new Feature(polygon,scaleTime(timeinminutes));
    return feature; 
}

async function makegenerator(location){
    return await new Planner.IsochroneGenerator(location);
}

/* async function generateIsochrone(location,timeinminutes){
    await p.init(location);// initialize every time because we assume the tiles will be cached correctly.
    var data = await p.getIsochrone(scaleTime(timeinminutes), true);
    var isochrone = data.isochrones[0];//only take the first isochrone, don't take holes into account.
    var polygon = convertToPolygon(isochrone);
    var feature = new Feature(polygon,scaleTime(timeinminutes));
    console.log(feature.geometry.coordinates);
    return feature;
}*/

function convertToPolygon(isochrone){
    let flipForMapBox = true;
    const polygon = [];
    if(flipForMapBox){//flips the coordinates if necessary
        polygon.push(isochrone[0].map((p)=>[p.longitude,p.latitude]));  
    }
    else{
    polygon.push(isochrone[0].map((p)=>[p.latitude,p.longitude]));
    }
    polygon[0].push(polygon[0][0]);//adds the first point to the end of the polygon so it makes a full circle
    return polygon;

}

function scaleTime(timeinminutes){
    // var sectomilli = 1000;
    var sectomilli = 1000; // TODO: fake because car profile
    var mintosec = 60;
    return timeinminutes * sectomilli * mintosec;
}

async function run(){
    var overlap = await findoptimum(bosa, herman, 5);
    console.log("overlap: " + overlap.type);
    return overlap;
}

/*********************************************************************************************************************************
 *  everything past this line is for local storage purposes for the demo!
 * *******************************************************************************************************************************
 */
var bosaIsochrones = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"coordinates":[[[4.3543306319680735,50.85857265405347],[4.354260008164596,50.85866923861991],[4.3541201196778605,50.85887122844227],[4.35396365177944,50.859100357702836],[4.352869475499279,50.86074270170392],[4.352379906969891,50.86148743169186],[4.35230117565701,50.86173564930937],[4.352331065236271,50.86184465681511],[4.352473317532076,50.86202317974727],[4.354731074448779,50.86304395357679],[4.354904275058654,50.86310683657767],[4.3549601857840265,50.863121367438126],[4.35670482176493,50.86338771968855],[4.35708438950633,50.86343768983687],[4.358632075141654,50.86281513207857],[4.358696278697992,50.86278584505766],[4.358942660358807,50.8625955633154],[4.360016784540117,50.86138883659928],[4.360286569043577,50.860746386454714],[4.360313989372766,50.86064239115455],[4.360313427347059,50.86062506173262],[4.360090122070467,50.860117075806784],[4.359565654222922,50.859666991546824],[4.358763733847639,50.85911159753945],[4.3586985056323195,50.859090279801656],[4.356748425290698,50.85845956344033],[4.356607456268361,50.858416575168725],[4.356053614226415,50.85839468108523],[4.356005585051413,50.85839334450823],[4.3543306319680735,50.85857265405347]]],"type":"Polygon"},"properties":{"time":240}},{"type":"Feature","geometry":{"coordinates":[[[4.363168029273749,50.85809176551055],[4.361566346595601,50.85742038353298],[4.358932643039427,50.85653885653734],[4.3587646559881374,50.856486429092975],[4.355889116390788,50.85576507142099],[4.355682954003081,50.85573385753301],[4.355151181942611,50.85566029370494],[4.354382947725373,50.85566100609294],[4.352572742170593,50.85591064410686],[4.352195043325036,50.85612348471429],[4.349745049114034,50.85928351213251],[4.349293606622906,50.86046227834067],[4.349503385599682,50.86160020257577],[4.350954497582125,50.863750304145825],[4.351691848972697,50.864664945152285],[4.352086711965193,50.864862550166514],[4.358412866929767,50.86631042669413],[4.360384768333889,50.86548004312261],[4.361044135030499,50.8650067882206],[4.361110334880183,50.864935901877864],[4.364029599031446,50.86116222296739],[4.364020690664273,50.85944621994098],[4.363168029273749,50.85809176551055]]],"type":"Polygon"},"properties":{"time":480}},{"type":"Feature","geometry":{"coordinates":[[[4.368485417889175,50.85842966747952],[4.367257710529179,50.857401928095875],[4.366725299005099,50.856973706943236],[4.366368987822321,50.85668730579143],[4.365500632834887,50.8560002861217],[4.363290165893588,50.85469540077254],[4.358296105427217,50.85355027406392],[4.35784015589062,50.85347841369069],[4.357604971866695,50.85344135150666],[4.356580942656832,50.85328924570903],[4.353505081254465,50.8528485096123],[4.352754098527201,50.85289128078853],[4.351407339491355,50.853007053312616],[4.348350927044503,50.855480220310966],[4.34718852869137,50.85725007482152],[4.3469051713101825,50.857813927940256],[4.3464923255879295,50.8587944318007],[4.347932479961658,50.8662719503945],[4.3481162186645905,50.86636221071395],[4.359173663540631,50.86910581338133],[4.3595046,50.8691447],[4.359664828652005,50.86915612035042],[4.359852894342823,50.86910213302923],[4.361523127408915,50.868467141717325],[4.361820633361235,50.868324657595075],[4.362168394984407,50.86809516638217],[4.363589772250877,50.86707448533389],[4.364836258772836,50.86570850244603],[4.366279201888081,50.86374336210311],[4.3675896164552785,50.86165883648592],[4.367646937611703,50.86156432731397],[4.368485417889175,50.85842966747952]]],"type":"Polygon"},"properties":{"time":720}},{"type":"Feature","geometry":{"coordinates":[[[4.349729967407317,50.850231486298526],[4.347916913331031,50.85150364904243],[4.343605516014588,50.85537833873803],[4.342602882773036,50.85804026208297],[4.342202051710356,50.85921953849238],[4.344220395604321,50.86715899278951],[4.3445184919797715,50.867968775699154],[4.344606728925687,50.86820035729993],[4.344730650855427,50.86825326019496],[4.344797112664418,50.86828015814916],[4.3602812116101815,50.871993466616956],[4.3603399,50.8720017],[4.360610631824837,50.8719888377408],[4.36073579560972,50.871980877061496],[4.360900096101125,50.87196783108793],[4.360946447415231,50.8719581977038],[4.3609938163880315,50.87194320472631],[4.364773978920362,50.870307168311946],[4.368921888246003,50.86575900551862],[4.369206179736435,50.865323727220826],[4.372112041299207,50.86063852038485],[4.372908925795946,50.85736384755687],[4.369802007456953,50.85473483475611],[4.368765933177993,50.85427170044937],[4.368569108331436,50.85418514452143],[4.362562106004194,50.85190661104377],[4.362382089135105,50.85184483578074],[4.353598744908066,50.850488978536866],[4.353108238572762,50.85041498065803],[4.351689406349275,50.85031531078748],[4.349729967407317,50.850231486298526]]],"type":"Polygon"},"properties":{"time":960}},{"type":"Feature","geometry":{"coordinates":[[[4.374209916809611,50.853634170603684],[4.371900037770599,50.85260829894921],[4.371194344878592,50.85229508526399],[4.368348752879888,50.851131395790574],[4.360895292585335,50.849013272084704],[4.353959169142901,50.84813806830365],[4.353390258210273,50.848068587180876],[4.349922050706411,50.847789364030035],[4.347823101930862,50.84783155157825],[4.347042664949099,50.84798529344652],[4.346892495353979,50.84802043190669],[4.3468105026606185,50.8480474198191],[4.346127776000836,50.84857007282616],[4.341043486534607,50.852967020963824],[4.3407806493267485,50.853428151377116],[4.338908787907034,50.857039832198225],[4.338859112665464,50.857167053867315],[4.338098332652024,50.859233385746165],[4.338050849594502,50.860046317940515],[4.3380536679357995,50.86014549516233],[4.338801674520526,50.86282743231668],[4.34175564903788,50.87031605433309],[4.341891733412135,50.87046215311238],[4.358637209469077,50.87478833039414],[4.360145772822269,50.87479542571493],[4.361041535115153,50.87479694643218],[4.361484951051175,50.87478314390864],[4.3616701187760984,50.874739554102064],[4.361694692517261,50.87473173067762],[4.3625465,50.8744117],[4.364548811994497,50.87354550973818],[4.36500073048594,50.873307622872204],[4.36738455900749,50.872024056174766],[4.369304514196783,50.87056386242838],[4.37272759564384,50.86719587953111],[4.373727799050251,50.86617951065307],[4.373837914434764,50.86599282061008],[4.376600241300692,50.85966762994681],[4.376664027624788,50.859285787654976],[4.376704291070395,50.858889173257374],[4.3762287945370915,50.856747882935124],[4.37611770309543,50.856444860269455],[4.374209916809611,50.853634170603684]]],"type":"Polygon"},"properties":{"time":1200}}]}
var hermanIsochrones = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"coordinates":[[[4.346244623378752,50.86732430529262],[4.34993741426557,50.867539469097906],[4.349963364169251,50.867540369883905],[4.352274352522592,50.86762012113769],[4.352320735726441,50.867539100476016],[4.35236387804232,50.867462964998225],[4.353761195436231,50.86474200520337],[4.3537938,50.864419],[4.3536687,50.864298],[4.3534195,50.8641427],[4.352791673040352,50.86395588778435],[4.349046187570778,50.8632684931251],[4.348508876763623,50.863290724556244],[4.347468079686722,50.86362840081017],[4.3467729113907225,50.86509052145114],[4.346317842603232,50.866181592707356],[4.3461918907004815,50.866668660351834],[4.346244623378752,50.86732430529262]]],"type":"Polygon"},"properties":{"time":240}},{"type":"Feature","geometry":{"coordinates":[[[4.343517009067139,50.86943036638682],[4.3545592843700796,50.8700993843007],[4.354619324624708,50.870014865347656],[4.356357164514538,50.866360453540494],[4.356677057364051,50.86536038396478],[4.357065661966173,50.86388952620651],[4.357125551587037,50.862712021192706],[4.356858775524244,50.86256254763337],[4.355731987355093,50.86212075344092],[4.355558467022788,50.862078783223616],[4.355489078125426,50.862062325540236],[4.3521185478429025,50.8614190550413],[4.346893121880706,50.86053462657138],[4.3466954628527255,50.86053094237104],[4.346636624681605,50.8605360854604],[4.34642329870389,50.86076514454538],[4.3444151865570975,50.86337849468564],[4.343692479352538,50.86453225181041],[4.343627070623931,50.864645765937965],[4.343394819796847,50.8652741513866],[4.343370605168065,50.86549302081321],[4.343246959297462,50.868089310847125],[4.343272269544757,50.869344249581204],[4.343434740927914,50.86940748915399],[4.343517009067139,50.86943036638682]]],"type":"Polygon"},"properties":{"time":480}},{"type":"Feature","geometry":{"coordinates":[[[4.341685482379775,50.87180251611307],[4.3417840981203994,50.87185207936413],[4.342028219672749,50.871925993289146],[4.35356970380238,50.87279361654702],[4.357241556137067,50.872600381491395],[4.360586043623351,50.86794015889534],[4.360690503859604,50.86763962846541],[4.361049749543249,50.865632448844096],[4.361503075779216,50.86173531508894],[4.360960553306367,50.86148909253586],[4.3590665155286565,50.860634046169714],[4.3572571050212945,50.859979063537835],[4.355359180595892,50.859464649212875],[4.3548410611553185,50.85936856066577],[4.354819649064922,50.859364796132645],[4.345279593501604,50.8578495518407],[4.345194352119901,50.85783858918826],[4.344640197870368,50.85807674071503],[4.344277680865202,50.85846752222734],[4.340750656294504,50.86261617526642],[4.3394568841185714,50.865006460942354],[4.341051455336093,50.87118759660965],[4.341685482379775,50.87180251611307]]],"type":"Polygon"},"properties":{"time":720}},{"type":"Feature","geometry":{"coordinates":[[[4.3657635,50.8608289],[4.364964655390796,50.860359262834486],[4.3608490779150015,50.85847823638531],[4.360707262541238,50.85841790168334],[4.359766545204094,50.858107151114794],[4.359648439656865,50.85807286842274],[4.357846595473148,50.85760165696597],[4.355872281380095,50.85710204293109],[4.348087290960113,50.8555687190173],[4.3479201134735055,50.85554398908009],[4.3457638163707735,50.85540573255708],[4.342967090843091,50.85535170732992],[4.3428373,50.8553799],[4.3423279522889695,50.85559202470244],[4.34049770931779,50.85693643148068],[4.3373289785343365,50.86076129860403],[4.3354066967991916,50.864425281763914],[4.335658420233999,50.865339240111794],[4.336346336359868,50.86728171495588],[4.336378355912794,50.86736420007612],[4.339870605358001,50.8736851672083],[4.339874394805542,50.873690687606306],[4.340930302117714,50.87424984805278],[4.353931281992902,50.87562934324301],[4.359822312922638,50.874628731204595],[4.3609391709637375,50.87439215155233],[4.364149589506493,50.86992130682599],[4.365098423134016,50.866061654489535],[4.365170442502743,50.865764111835084],[4.365788022397726,50.861087481765935],[4.3657635,50.8608289]]],"type":"Polygon"},"properties":{"time":960}},{"type":"Feature","geometry":{"coordinates":[[[4.363653659026416,50.87681701569656],[4.364379875871778,50.87558390734867],[4.367970974595925,50.86829416205691],[4.369701446265576,50.86117205221588],[4.367394382933255,50.85880080314641],[4.367358315139609,50.858772527276635],[4.365342769607778,50.85758742036873],[4.362723057544614,50.85614820514552],[4.362433509585291,50.85603811280537],[4.359250817335461,50.85521886379827],[4.359223664533008,50.85521231915621],[4.359099153287149,50.85518293028053],[4.3478962272578805,50.852599014595086],[4.347501291404209,50.85252149340946],[4.3455731188190585,50.852425637304336],[4.3447771515242986,50.85245303280412],[4.340451205318031,50.85271725627328],[4.336402709731447,50.85616284263058],[4.333990890723838,50.858853951163745],[4.333987518311673,50.85885773464417],[4.333678959625518,50.859205029600496],[4.333672064392479,50.85921411964628],[4.333663340994532,50.85922568799193],[4.330974466373852,50.863087617396616],[4.331935067116781,50.86767376510385],[4.332028256346464,50.86786527251313],[4.335312854092114,50.87343917610444],[4.337332672127956,50.875711571322555],[4.338332800769792,50.87639131237993],[4.3399224554447375,50.876960450315345],[4.354988804003897,50.87839549599997],[4.363653659026416,50.87681701569656]]],"type":"Polygon"},"properties":{"time":1200}}]} ;
var KBCIsochrones = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"coordinates":[[[4.349539200142286,50.86285698346211],[4.347108183057059,50.858704016124754],[4.347107565622099,50.8587030880065],[4.3459456027660055,50.85831489432421],[4.3456089282368975,50.85820532453562],[4.345560206692729,50.858197917833564],[4.3453268477890035,50.85823203501788],[4.344872321526667,50.8584587535156],[4.344780208071526,50.85853352195811],[4.344327223860847,50.85937963158056],[4.344058225501634,50.860130709437875],[4.344048841466102,50.86017654685633],[4.344754586264608,50.862715396269465],[4.348962649424145,50.863115222939456],[4.349305112886567,50.86299321696653],[4.349539200142286,50.86285698346211]]],"type":"Polygon"},"properties":{"time":240}},{"type":"Feature","geometry":{"coordinates":[[[4.3505670235291385,50.865771739546204],[4.351247759164905,50.86579759224954],[4.351249330681195,50.86579763354261],[4.35145083163231,50.86569466095182],[4.35155488839385,50.865563580305846],[4.351654,50.8650169],[4.3512719,50.8574425],[4.351213701191662,50.857355478924674],[4.350964217856505,50.85724669794247],[4.350532236310956,50.85707881160652],[4.346881603801211,50.855738899529854],[4.345819173604144,50.85564496537578],[4.343142485158817,50.85562962533314],[4.340870303817309,50.85724059705691],[4.34069683999037,50.857480573209855],[4.34069496707199,50.85748332139492],[4.340193975935942,50.85927589178532],[4.340094052031253,50.859839469835336],[4.340058399436229,50.860260554077556],[4.3401402,50.8606026],[4.340494637211264,50.861404601334385],[4.341291793489734,50.863029258662024],[4.341792162279177,50.86390328528273],[4.34222134624534,50.864497033172526],[4.342538788034354,50.86461266131969],[4.343978736455255,50.864913759131895],[4.3443438104411785,50.86497889856973],[4.3505670235291385,50.865771739546204]]],"type":"Polygon"},"properties":{"time":480}},{"type":"Feature","geometry":{"coordinates":[[[4.3406847652126475,50.85305616628472],[4.340602001805347,50.85307455610867],[4.338793584975142,50.854722410426305],[4.337849511726615,50.855789717960846],[4.336655151420156,50.857647817437794],[4.3363257203059025,50.85991129003563],[4.3362127,50.8614489],[4.3361993,50.861632],[4.3381838,50.8650029],[4.3388409,50.8658497],[4.3389667,50.8659833],[4.339370821322075,50.866267703091424],[4.340369392500287,50.86666631631459],[4.341964018145334,50.86721872859998],[4.353139324882304,50.86846788617376],[4.353343171439979,50.8684754747323],[4.353386710499712,50.8684746646281],[4.355624532455797,50.865913204934074],[4.3556369213181005,50.865584161739534],[4.355529812015655,50.858236128940185],[4.355461518319821,50.85626755447717],[4.354597346276966,50.855786260153586],[4.354288813983779,50.85564699862741],[4.34755810011241,50.85293571215556],[4.347497955003371,50.85291635246291],[4.345659927774845,50.85284977947196],[4.3406847652126475,50.85305616628472]]],"type":"Polygon"},"properties":{"time":720}},{"type":"Feature","geometry":{"coordinates":[[[4.331765951630127,50.86299532243633],[4.335316358514952,50.86746110052317],[4.3356463,50.8678304],[4.3357101,50.8678731],[4.340954,50.8700799],[4.340993877854879,50.87009330759769],[4.355179228122047,50.871152145220655],[4.355513964889262,50.87115491448821],[4.3556099857355495,50.87104745203198],[4.3586375,50.8668639],[4.359746926150688,50.86222928804891],[4.3597512601418655,50.86217629438794],[4.359767731517396,50.85506702466997],[4.349564851417923,50.850360774887555],[4.349532180099937,50.85035692812709],[4.347678052124847,50.850143583454276],[4.3449897675462354,50.85022071036339],[4.344699340128615,50.85023215028474],[4.338298402932352,50.850628487121995],[4.3376863640348375,50.85077048925136],[4.33476706083041,50.853557446488665],[4.332561454364628,50.856391685743],[4.332209320904338,50.858605682884516],[4.3316819,50.8627478],[4.3316762,50.8628472],[4.331765951630127,50.86299532243633]]],"type":"Polygon"},"properties":{"time":960}},{"type":"Feature","geometry":{"coordinates":[[[4.334799271208712,50.848932411463885],[4.334658699206305,50.848992487076536],[4.3335690025318545,50.84962875121049],[4.3284030076285935,50.85493145460466],[4.3282896887360796,50.85516278609187],[4.326999883294426,50.86163661845045],[4.327003944633104,50.86332203042192],[4.327988232071372,50.864676678234375],[4.331933970247608,50.86998528308413],[4.341874641984901,50.872665509563966],[4.341989868509817,50.87267712638381],[4.342131122181318,50.872689721725884],[4.351294085631606,50.873492114978845],[4.3536486,50.873659],[4.3551942137222,50.87361828346694],[4.356698000137233,50.87353811315457],[4.358649100382797,50.8732160220696],[4.358695429201594,50.873178500852106],[4.360091384920811,50.871784087130294],[4.362474028801838,50.8687135096369],[4.36347942425005,50.86711139616389],[4.363488223596322,50.86706948061565],[4.363587111302234,50.866336719076465],[4.3641464,50.8612511],[4.364056609271474,50.859787033643904],[4.363443669051201,50.853999609917324],[4.362296101465798,50.85302842018879],[4.3615362,50.8524955],[4.359359496723811,50.85146539707765],[4.357345914435312,50.85053481444552],[4.353930112439074,50.84912035825575],[4.350635826470491,50.84799990309694],[4.3497391711862265,50.84788755341137],[4.345858249244206,50.847518443967566],[4.345820533633213,50.84752023205946],[4.339850133063801,50.84792756135315],[4.338104975370576,50.84818604995226],[4.335730177253883,50.84857469890287],[4.334799271208712,50.848932411463885]]],"type":"Polygon"},"properties":{"time":1200}}]};
var GaucheretIsochrones = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"coordinates":[[[4.35717878985287,50.86385433732213],[4.3571486859538835,50.86449891423416],[4.357345004803246,50.86482171359601],[4.3583721353314795,50.86555033572544],[4.3592389990980935,50.865988549704525],[4.359975537231264,50.8663355780138],[4.360350030120144,50.86650991406442],[4.360930577871803,50.86676179267147],[4.3611441848823596,50.86671537436858],[4.361819684761623,50.86656840240633],[4.362782143865245,50.865922648731576],[4.362949757115098,50.865800941545736],[4.362984397967021,50.865765874920235],[4.362962686781329,50.86564286552689],[4.362882868195923,50.86537313984364],[4.361587657236676,50.862520945119826],[4.36146109802849,50.862251384970676],[4.3613620150779315,50.86221521677451],[4.360006040519833,50.86175541383956],[4.358560947684009,50.86202879623077],[4.358225278114842,50.86220792756805],[4.358063630247855,50.862385516180254],[4.357928434542984,50.86254634158894],[4.35717878985287,50.86385433732213]]],"type":"Polygon"},"properties":{"time":240}},{"type":"Feature","geometry":{"coordinates":[[[4.354371487411386,50.86220597380055],[4.353944189347565,50.863506596873854],[4.35404968179893,50.86415502430917],[4.35534545683854,50.86594961357392],[4.356325256730653,50.86683482236503],[4.357434678722503,50.86777150706909],[4.361709113361241,50.86926720099212],[4.36243382740665,50.869370282302484],[4.363098587923744,50.86928381955624],[4.363213676059789,50.86926041098751],[4.364316159626072,50.86864324911689],[4.3657819331667875,50.86713887259779],[4.366088945642164,50.864351491422624],[4.36495954413382,50.86106748842341],[4.364876110135427,50.86099560931392],[4.359671924195525,50.85913000939233],[4.3589099708351355,50.85899273422433],[4.35675370737769,50.85944633409887],[4.356741778627196,50.85945371630541],[4.356674258524827,50.859500989883585],[4.356638338655606,50.85953768858015],[4.3556495291087,50.86058573346932],[4.354500584499605,50.86186511860947],[4.354371487411386,50.86220597380055]]],"type":"Polygon"},"properties":{"time":480}},{"type":"Feature","geometry":{"coordinates":[[[4.370332134330429,50.86345950043712],[4.370331058515492,50.86345187291778],[4.3703259,50.863439],[4.3702880800349675,50.86337645913836],[4.368738449771719,50.86138446428747],[4.367205589009978,50.85951546681015],[4.36699273256543,50.85934859491422],[4.365776615480588,50.85880672560651],[4.361873610854053,50.857369177557544],[4.359836265742405,50.85668429642209],[4.3588907,50.8564467],[4.3588072,50.8564306],[4.357496510062289,50.85637303661093],[4.355685525582797,50.85640458212884],[4.355153935529731,50.85666358345874],[4.353948782239338,50.85772602240057],[4.353891629001644,50.857777787528754],[4.351940175857446,50.85966225746159],[4.351557449117063,50.86011585884122],[4.350955761009827,50.86087866032529],[4.349904322795323,50.865271670765054],[4.349927696898981,50.86558387591146],[4.349935954019198,50.86561348960048],[4.357733116687497,50.87045677925959],[4.360684194371399,50.87207586548194],[4.360841714693845,50.872108219591794],[4.36106306123701,50.87214238115354],[4.362508173416966,50.87189917444351],[4.3625911543154325,50.87188433483236],[4.3658955,50.871198],[4.366399018048165,50.870924243931256],[4.3681017931186865,50.86953214193791],[4.368106161082923,50.86952273261339],[4.370332134330429,50.86345950043712]]],"type":"Polygon"},"properties":{"time":720}},{"type":"Feature","geometry":{"coordinates":[[[4.374139786283551,50.863875080655845],[4.373222585043159,50.860396997286585],[4.370664603916161,50.857964075377446],[4.365061680291418,50.85544950356231],[4.3627923510271005,50.85453925774259],[4.3620801079391995,50.85441596503385],[4.3594111,50.8541629],[4.3571919,50.8539594],[4.355522724034154,50.85380833728168],[4.353725261899266,50.853786780514966],[4.353516085757699,50.853909332593986],[4.349227991857395,50.85793916726307],[4.3488643525709545,50.85834069907674],[4.348722427267209,50.85853934621291],[4.34866609308509,50.858627500208655],[4.347904123459494,50.85986705136664],[4.346209732107148,50.86626182635624],[4.346110192614553,50.866646754770436],[4.346161485158581,50.86736723576732],[4.3572915006056565,50.87409461179611],[4.358552406197582,50.874833033759344],[4.358604844776931,50.87484999216848],[4.359159353316186,50.874865619938205],[4.360185785296792,50.874882604873974],[4.361845201178516,50.87472807787843],[4.361897735348355,50.874719809857176],[4.368320183772209,50.87255286204116],[4.370590532728083,50.87173307049224],[4.3711262694509845,50.87147233185571],[4.371370215625003,50.871246068308956],[4.372319558968795,50.87019772165036],[4.372493134533142,50.86997527638113],[4.37414831778536,50.86616700669164],[4.374139786283551,50.863875080655845]]],"type":"Polygon"},"properties":{"time":960}},{"type":"Feature","geometry":{"coordinates":[[[4.378806886273419,50.863496325687244],[4.377540920853908,50.859796858543575],[4.377507942781861,50.85973743656296],[4.377212231565654,50.85938060858028],[4.374145193131334,50.85656357005509],[4.370279367186988,50.85459563336295],[4.369599197168805,50.85428355159242],[4.364504867172904,50.85238246036407],[4.3624518,50.8517618],[4.36084971075392,50.85154271737682],[4.352409055497397,50.85097226844497],[4.3521308,50.8510493],[4.351674766553696,50.85126112107827],[4.345287165562211,50.856615670475016],[4.344384901624748,50.85936281162966],[4.343278229100247,50.86404102389747],[4.343175600701475,50.86937381807915],[4.351472703319437,50.87452571088228],[4.35508018825408,50.87672900216235],[4.356344862973954,50.87744418079381],[4.35655599047162,50.87752293630292],[4.356674031242773,50.87755717450606],[4.356762222849431,50.87755866910722],[4.360697968406776,50.877560938353696],[4.3607358818251765,50.877558179167565],[4.36509350644704,50.8771227156518],[4.37057801648856,50.87491884411463],[4.373634312007567,50.87349802550557],[4.375805745728867,50.87195630872265],[4.3760923,50.8717072],[4.3764869,50.8711972],[4.376846090074935,50.8707313900359],[4.378515394354974,50.866609244785906],[4.378806886273419,50.863496325687244]]],"type":"Polygon"},"properties":{"time":1200}}]} ;

export { findoptimum, run, intersect };
