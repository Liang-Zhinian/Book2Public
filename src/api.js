import LocalImage from "./widget/LocalImage";


export default {
    recommend: 'http://api.meituan.com/group/v1/recommend/homepage/city/20?__skck=40aaaf01c2fc4801b9c059efcd7aa146&__skcy=mrUZYo7999nH8WgTicdfzaGjaSQ=&__skno=51156DC4-B59A-4108-8812-AD05BF227A47&__skts=1434530933.303717&__skua=bd6b6e8eadfad15571a15c3b9ef9199a&__vhost=api.mobile.meituan.com&ci=1&client=iphone&limit=40&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-06-17-14-50363&offset=0&position=39.983497,116.318042&userId=10086&userid=10086&utm_campaign=AgroupBgroupD100Fab_chunceshishuju__a__a___b1junglehomepagecatesort__b__leftflow___ab_gxhceshi__nostrategy__leftflow___ab_gxhceshi0202__b__a___ab_pindaochangsha__a__leftflow___ab_xinkeceshi__b__leftflow___ab_gxtest__gd__leftflow___ab_gxh_82__nostrategy__leftflow___ab_pindaoshenyang__a__leftflow___i_group_5_2_deallist_poitype__d__d___ab_b_food_57_purepoilist_extinfo__a__a___ab_trip_yidizhoubianyou__b__leftflow___ab_i_group_5_3_poidetaildeallist__a__b___ab_waimaizhanshi__b__b1___a20141120nanning__m1__leftflow___ab_pind',

    discount: 'http://api.meituan.com/group/v1/deal/topic/discount/city/20?ci=1&client=iphone&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-06-17-14-50363&userid=10086&utm_campaign=AgroupBgroupD100Fab_chunceshishuju__a__a___b1junglehomepagecatesort__b__leftflow___ab_gxhceshi__nostrategy__leftflow___ab_gxhceshi0202__b__a___ab_pindaochangsha__a__leftflow___ab_xinkeceshi__b__leftflow___ab_gxtest__gd__leftflow___ab_gxh_82__nostrategy__leftflow___ab_pindaoshenyang__a__leftflow___i_group_5_2_deallist_poitype__d__d___ab_b_food_57_purepoilist_extinfo__a__a___ab_trip_yidizhoubianyou__b__leftflow___ab_i_group_5_3_poidetaildeallist__a__b___ab_waimaizhanshi__b__b1___a20141120nanning__m1__leftflow___ab_pindaoquxincelue__a__leftflow___ab_i_group_5_5_onsite__b__b___ab_i_group_5_6_searchkuang__a__leftflow&utm_content=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&utm_medium=iphone&utm_source=AppStore&utm_term=5.7&uuid=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&version_name=5.7',

    findLocations:'http://demo.atpath.com:5216/api/Site/FindLocations',

    findSites:'http://demo.atpath.com:5216/api/Site/FindSites',

    adInfo:[
        {title: 'R1', icon: require('./img/nearby/Rotate1.png')},
        {title: 'R2', icon: require('./img/nearby/Rotate2.png')},
        {title: 'R3', icon: require('./img/nearby/Rotate3.png')},
        {title: 'R4', icon: require('./img/nearby/Rotate4.png')},
    ],
    CountryImgList:[
        {country: 'Italy', icon: require('./img/nearby/Drink/area/country/Italy.png')},
        {country: 'Spain', icon: require('./img/nearby/Drink/area/country/Spain.png')},
        {country: 'France', icon: require('./img/nearby/Drink/area/country/France.png')},
        {country: 'United States', icon: require('./img/nearby/Drink/area/country/United_States.png')},
        {country: 'China', icon: require('./img/nearby/Drink/area/country/China.png')},
        {country: 'Argentina', icon: require('./img/nearby/Drink/area/country/Argentina.png')},
        {country: 'Chile', icon: require('./img/nearby/Drink/area/country/Chile.png')},
        {country: 'Australia', icon: require('./img/nearby/Drink/area/country/Australia.png')},
        {country: 'South Africa', icon: require('./img/nearby/Drink/area/country/South_Africa.png')},
        {country: 'Germany', icon: require('./img/nearby/Drink/area/country/Germany.png')},
        {country: 'Portugal', icon: require('./img/nearby/Drink/area/country/Portugal.png')},
        {country: 'Romania', icon: require('./img/nearby/Drink/area/country/Romania.png')},
        {country: 'Greece', icon: require('./img/nearby/Drink/area/country/Greece.png')},
        {country: 'Russia', icon: require('./img/nearby/Drink/area/country/Russia.png')},
        {country: 'New Zealand', icon: require('./img/nearby/Drink/area/country/New_Zealand.png')},
    ],


    adInfoTemp:[
        {title: 'New 11 Member Intro Offer',type:'CLASSES',address:'Precosion Fitness Hk Precosion Fitness Hk Precosion Fitness Hk', icon: require('./img/nearby/Rotate1.png')},
        {title: 'New 12 Member Intro Offer',type:'CLASSES',address:'Precosion Fitness Hk Precosion ', icon: require('./img/nearby/Rotate2.png')},
        {title: 'New 13 Member Intro Offer',type:'CLASSES',address:'Precosion Fitness Hk Precosion Fitness Hk Precosion Fitness Hk', icon: require('./img/nearby/Rotate3.png')},
        {title: 'New 14 Member Intro Offer',type:'CLASSES',address:'Precosion Fitness Hk Precosion ', icon: require('./img/nearby/Rotate4.png')},
    ],

}

export function regeocodeLocation(longitude:string ,latitude:string) {
    const key = 'ee020207116b9d61aebdb6f08d9a319f';
    // console.log('http://restapi.amap.com/v3/geocode/regeo?output=json&location='+longitude+','+latitude+'&key='+key+'&radius=1000&extensions=all')
    return 'http://restapi.amap.com/v3/geocode/regeo?output=json&location='+longitude+','+latitude+'&key='+key+'&radius=1000&extensions=all';
    const api = 'http://restapi.amap.com/v3/geocode/regeo';
    const location = `${longitude},${latitude}`;
    const url = `${api}?output=json&location=${location}&key=${key}&radius=1000&extensions=all`;
    var formatted_address = '';
    fetch(url, {
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json',}
    })
        .then(resp => {
            return resp.json()
        })
        .then(json => {
            if (json.info != 'OK') return;

            formatted_address = json.regeocode.aois.length > 0 ? json.regeocode.aois[0].name : json.regeocode.addressComponent.township.toString();
            if (Array.isArray(formatted_address) && formatted_address.length == 0) {
                formatted_address = '';
            }
            // console.log(formatted_address)
        })
        .catch((error) => {
            console.warn('请求错误',error);
            this.regeocodeLocation(longitude, latitude);
            throw error;
        });

}


export function getArea(type, pid) {
    // console.log('http://demo.atpath.com:17509/api/Region/GetRegion?type=' + type + '&pid=' + pid)
    return fetch('http://demo.atpath.com:17509/api/Region/GetRegion?type=' + type + '&pid=' + pid, {
        method: 'GET',
        // data: {type: type},
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}
export function getAllVineyard(index,size){
    return fetch('http://demo.atpath.com:17509/api/Vineyard/GetVineyard?name=&index='+index+'&size='+size , {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}
export function getVineyardBySubAreaId(vId,page,size){
    //vId (由地区api中Sub_Area获取)
    // console.log(
    //     'http://demo.atpath.com:17509/api/Vineyard/GetBySubArea?vId=' + vId+'&index='+page+'&size='+size
    // );
    return fetch('http://demo.atpath.com:17509/api/Vineyard/GetBySubArea?vId=' + vId+'&index='+page+'&size='+size , {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}

export function getVineyardByName(letter,name,index,size){
    // console.log('http://demo.atpath.com:17509/api/Vineyard/GetVineyard'+letter+'?Name='+name+'&index='+index+'&size='+size )
    return fetch('http://demo.atpath.com:17509/api/Vineyard/GetVineyard'+letter+'?Name='+name+'&index='+index+'&size='+size , {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}

export function getVineyardByGPS(Lat,Lng,Distance) {
    // console.log('http://demo.atpath.com:17509/api/Vineyard/GetByGPS?Lat=' + Lat + '&Lng=' + Lng + '&Distance=' + Distance);
    return fetch('http://demo.atpath.com:17509/api/Vineyard/GetByGPS?Lat=' + Lat + '&Lng=' + Lng + '&Distance=' + Distance, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}

export function getProducerByGPS(Lat,Lng,Distance) {
    // console.log('http://demo.atpath.com:17509/api/Producer/GetByGPS?Lat=' + Lat + '&Lng=' + Lng + '&Distance=' + Distance);
    return fetch('http://demo.atpath.com:17509/api/Producer/GetByGPS?Lat=' + Lat + '&Lng=' + Lng + '&Distance=' + Distance, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}
export function getAllProducer(letter,name,index,size,type,id){
    return fetch('http://demo.atpath.com:17509/api/Producer/GeProducer'+letter+'?Name='+name+'&index='+index+'&size='+size+'&type='+type+'&id='+id , {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}
export function getProducerById(letter,name,index,size,type,id){
    return fetch('http://demo.atpath.com:17509/api/Producer/GeProducer?id='+id+'&Name='+name+'&index='+index+'&size='+size+'&type='+type, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            // console.log(responseJson.Data);
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}
export function getProducerByName(Name,index,size,type){
    // console.log('http://demo.atpath.com:17509/api/Producer/GeProducerByA?Name='+Name+'&index='+index+'&size='+size+'&type='+type)
    return fetch('http://demo.atpath.com:17509/api/Producer/GeProducerByA?Name='+Name+'&index='+index+'&size='+size+'&type='+type , {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        }).catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}
export function getWineByProducer(producer_id,index,size,vineyard_id){
    // console.log('http://demo.atpath.com:17509/api/Wines/GetWine?producer_id='+producer_id+'&Name=&color_id=&appellation_id='+'&index='+index+'&size='+size+'&vineyard_id='+vineyard_id);
    return fetch('http://demo.atpath.com:17509/api/Wines/GetWine?producer_id='+producer_id+'&Name=&color_id=&appellation_id='+'&index='+index+'&size='+size+'&vineyard_id='+vineyard_id, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}
export function getWineByVineyard(VineyardName,vineyard_id,index,size){
    // console.log('http://demo.atpath.com:17509/api/Wines/GetWine?producer_id=&Name=&color_id=&appellation_id='+'&index='+index+'&size='+size+'&vineyard_id='+vineyard_id);
    return fetch('http://demo.atpath.com:17509/api/Wines/GetWine?producer_id=&Name=&color_id=&appellation_id='+'&index='+index+'&size='+size+'&vineyard_id='+vineyard_id, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}
export function getWineByName(name,index,size){
    console.log('http://demo.atpath.com:17509/api/Wines/GetWine?producer_id=&Name='+name+'&color_id=&appellation_id='+'&index='+index+'&size='+size+'&vineyard_id=');
    return fetch('http://demo.atpath.com:17509/api/Wines/GetWine?producer_id=&Name='+name+'&color_id=&appellation_id='+'&index='+index+'&size='+size+'&vineyard_id=', {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}

export function getWineByQRCode(QRCode){
    return fetch('http://demo.atpath.com:17509/api/Wines/GetByQRCode?QRCode='+QRCode, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            //Producer_Id
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}

//api/Wines/GetByQRCode

//根据经纬度、半径（单位是千米）和搜索文字获取商家列表信息
export function GetBusinessLocationsWithinRadius(latitude,longitude,radius,searchText,pageSize,pageIndex){
    let url = 'http://isd4u.com:5216/api/v1/s/Finder/GetBusinessLocationsWithinRadius'
        + '?latitude=' + latitude
        + '&longitude=' + longitude
        + '&radius=' + radius
        + '&searchText=' + searchText
        + '&pageSize=' + pageSize
        + '&pageIndex=' + pageIndex;
    // console.log(url);
    return fetch(url, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            //Producer_Id
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}

//根据siteId和locationId获取单个商家信息
// siteId,
// locationId
export function GetBusinessLocationsWithinSiteId(siteId,locationId,pageSize,pageIndex){
    let url = 'http://book2.atpath.com:5216/api/v1/s/locations/'
        +'ofSiteId/'+ siteId
        + '/locationId' + locationId
        + '?pageSize=' + pageSize
        + '&pageIndex=' + pageIndex;
    return fetch(url, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            //Producer_Id
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}
//根据经纬度、半径（单位是千米）和搜索文字获取可提供服务列表信息
// http://book2.atpath.com:5216/api/v1/s/Finder/GetSeriviceItemsWithinRadius
export function GetSeriviceItemsWithinRadius(latitude,longitude,radius,searchText,pageSize,pageIndex){
    let url = 'http://book2.atpath.com:5216/api/v1/s/Finder/GetSeriviceItemsWithinRadius'
        + '?latitude=' + latitude
        + '&longitude=' + longitude
        + '&radius=' + radius
        + '&searchText=' + searchText
        + '&pageSize=' + pageSize
        + '&pageIndex=' + pageIndex;
    return fetch(url, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            //Producer_Id
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}
//根据siteId和service item id获取可提供服务列表信息
// http://book2.atpath.com:5216/api/v1/s/Site/withSiteId/{siteId}/ServiceItems
export function ServiceItems(siteId,ids,pageSize,pageIndex){
    let url = 'http://isd4u.com:5216/api/v1/s/Site/withSiteId/'+siteId+'/ServiceItems';
        // + '?siteId=' + siteId
        // + '&ids=' + ids
        // + '&pageSize=' + pageSize
        // + '&pageIndex=' + pageIndex;
    // console.log('ServiceItems',url);
    return fetch(url, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((responseJson) => {
            //Producer_Id
            return responseJson.Data;
        })
        .catch((error) => {
            console.warn('请求错误',error);
            throw error;
        });
}

export function recommendUrlWithId(id: string) {
    return 'http://api.meituan.com/group/v1/deal/recommend/collaborative?__skck=40aaaf01c2fc4801b9c059efcd7aa146&__skcy=hWCwhGYpNTG7TjXWHOwPykgoKX0%3D&__skno=433ACF85-E134-4FEC-94B5-DA35D33AC753&__skts=1436343274.685593&__skua=bd6b6e8eadfad15571a15c3b9ef9199a&__vhost=api.mobile.meituan.com&cate=0&ci=1&cityId=20&client=iphone&did=' + id + '&district=-1&fields=id%2Cslug%2Cimgurl%2Cprice%2Ctitle%2Cbrandname%2Crange%2Cvalue%2Cmlls%2Csolds&hasbuy=0&latlng=0.000000%2C0.000000&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-07-08-15-36746&offset=0&scene=view-v4&userId=10086&userid=10086&utm_campaign=AgroupBgroupD100Fab_i550poi_ktv__d__j___ab_i_group_5_3_poidetaildeallist__a__b___ab_gxhceshi0202__b__a___ab_pindaoquxincelue0630__b__b1___ab_i_group_5_6_searchkuang__a__leftflow___i_group_5_2_deallist_poitype__d__d___ab_i550poi_xxyl__b__leftflow___ab_b_food_57_purepoilist_extinfo__a__a___ab_waimaiwending__a__a___ab_waimaizhanshi__b__b1___ab_i550poi_lr__d__leftflow___ab_i_group_5_5_onsite__b__b___ab_xinkeceshi__b__leftflowGhomepage_guess_27774127&utm_content=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&utm_medium=iphone&utm_source=AppStore&utm_term=5.7&uuid=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&version_name=5.7'
}

export  function CoordinateConverter(longitude:string ,latitude:string) {
    return 'http://restapi.amap.com/v3/assistant/coordinate/convert?locations='+longitude+','+latitude+'&coordsys=gps&key=ee020207116b9d61aebdb6f08d9a319f';
}

export  function amapStaticImg(longitude:string ,latitude:string) {
    return 'http://restapi.amap.com/v3/staticmap?location='+longitude+','+latitude+'&zoom=17&size=750*300&markers=mid,,:'+longitude+','+latitude+'&key=ee020207116b9d61aebdb6f08d9a319f';

}
//http://restapi.amap.com/v3/staticmap?location=116.481485,39.990464&zoom=10&size=750*300&markers=mid,,A:116.481485,39.990464&key=6912dce4d721f10e97753912cdb9e885

export function groupPurchaseDetailWithId(id: string) {
    return 'http://api.meituan.com/group/v1/deal/list/id/' + id + '?__skck=40aaaf01c2fc4801b9c059efcd7aa146&__skcy=4NDQ%2BojQ%2BZGArOWQCEgWI19Pzus%3D&__skno=803C28CE-8BA8-4831-B2DE-7BCD484348D9&__skts=1435888257.411030&__skua=bd6b6e8eadfad15571a15c3b9ef9199a&__vhost=api.mobile.meituan.com&ci=1&client=iphone&movieBundleVersion=100&msid=48E2B810-805D-4821-9CDD-D5C9E01BC98A2015-07-03-09-14430&userid=10086&utm_campaign=AgroupBgroupC1080988208017226240_c0_e68cafa9e104898bb8bfcd78b64aef671D100Fab_i_group_5_3_poidetaildeallist__a__b___ab_chunceshishuju__a__a___ab_gxhceshi__nostrategy__leftflow___ab_gxhceshi0202__b__a___ab_pindaochangsha__a__leftflow___ab_xinkeceshi__b__leftflow___ab_gxtest__gd__leftflow___ab_waimaiwending__a__a___ab_gxh_82__nostrategy__leftflow___i_group_5_2_deallist_poitype__d__d___ab_b_food_57_purepoilist_extinfo__a__a___ab_pindaoshenyang__a__leftflow___ab_pindaoquxincelue0630__b__b1___ab_waimaizhanshi__b__b1___a20141120nanning__m1__leftflow___b1junglehomepagecatesort__b__leftflow___ab_i_group_5_5_onsite__b__b___ab_i_group_5_6_searchkuang__a__leftflowGhomepage_guess_27774127&utm_content=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&utm_medium=iphone&utm_source=AppStore&utm_term=5.7&uuid=4B8C0B46F5B0527D55EA292904FD7E12E48FB7BEA8DF50BFE7828AF7F20BB08D&version_name=5.7'
}

export function groupPurchaseDetailWithLOLA(longitude: string,latitude: string) {
    return 'http://api.map.baidu.com/geocoder/v2/?location='+longitude+','+latitude+'&output=json&pois=1&ak=QGe7g0GGCeBpuaD3xvCrD4u1QHVhjY4a&coord_type=wgs84'
}

export function getHomePages(){
    homePage= [
        {sign:false,type:'Beauty',category:'CubeImages-Beauty',tag: 'EXPLORE',title:'Discover beauty shops near you',prompt:'', img: LocalImage.home1},
        {sign:false,type:'Wellness',category:'CubeImages-AllGoodDeals',tag: 'SPECIAL OFFERS',title:'Good deals for you ',prompt:'.', img: LocalImage.home2},
        {sign:false,type:'Fitness',category:'CubeImages-Fitness',tag: 'EXPLORE',title:'Discover fitness classes near you',prompt:'', img: LocalImage.home3},
        {sign:false,type:'Drink',category:'CubeImages-Wellness',tag: 'EXPLORE',title:'Discover wellness classes near you',prompt:'', img: LocalImage.home4},

    ];

    // let response = await fetch(api.homePage)
    // let json = await response.json()
    return homePage;
}


export function getExploreSceneTestBEAUTY(){
    homePage= [
        {id:'f996cb01-6b0c-4dfa-9687-78e59df6d0b1',siteId:'f996cb01-6b0c-4dfa-9687-78e59df6d0b1',sign:true,type:'Wellness',category:'Face_Treatments',tag: 'EXPLORE',title:'',prompt:'', img: require('./img/home/Beauty/1-Face_Treatments_EN.png')},
        {id:'b2',siteId:'b2',sign:true,type:'Beauty',category:'Hair_Salon_and_Treatments',tag: 'SPECIAL OFFERS',title:'BEAUTY 2 for you ',prompt:'Find great ', img: require('./img/home/Beauty/2-Hair_Salon_Treatments_EN.png')},
        {id:'b3',siteId:'b3',sign:true,type:'Beauty',category:'Makeup_Lashes_Brows',tag: 'EXPLORE',title:'BEAUTY 3 classes near you',prompt:'', img: require('./img/home/Beauty/3-MAKEUP_LASHES_BROWS_EN.png')},
        {id:'b4',siteId:'',sign:true,type:'Beauty',category:'Nails',tag: 'EXPLORE',title:'BEAUTY 4 classes near you',prompt:'', img: require('./img/home/Beauty/4-Nails_EN.png')},
        {id:'b5',siteId:'',sign:true,type:'Beauty',category:'Tanning',tag: 'EXPLORE',title:'BEAUTY 5 classes near you',prompt:'', img: require('./img/home/Beauty/5-Tanning_EN.png')},
        {id:'b6',siteId:'',sign:true,type:'Beauty',category:'Tattoo_Pierce',tag: 'EXPLORE',title:'BEAUTY 6 classes near you',prompt:'', img: require('./img/home/Beauty/6-Tattoo_Piercing_EN.png')},

    ];
    // let response = await fetch(api.homePage)
    // let json = await response.json()
    return homePage;
}

export function getExploreSceneTestWINE(){
    homePage= [
        {id:'b1',siteId:'',sign:true,type:'Drink',category:'Vineyard',tag: 'EXPLORE',title:'BEAUTY 4 classes near you',prompt:'', img: require('./img/home/Wine/1-FindWinesFromVineyards_EN.png')},
        {id:'b2',siteId:'',sign:true,type:'Drink',category:'Producer',tag: 'EXPLORE',title:'BEAUTY 1 classes near you',prompt:'', img: require('./img/home/Wine/2-FindWinesFromProducers_EN.png')},
        {id:'b3',siteId:'',sign:true,type:'Drink',category:'Wine',tag: 'EXPLORE',title:'BEAUTY 1 classes near you',prompt:'', img: require('./img/home/Wine/3-FindWinesBasedOnName_EN.png')},
        {id:'b4',siteId:'',sign:true,type:'Drink',category:'QR',tag: 'EXPLORE',title:'BEAUTY 2 classes near you',prompt:'', img: require('./img/home/Wine/4-ScanQRCodeFindWine_EN.png')},


    ];
    // let response = await fetch(api.homePage)
    // let json = await response.json()
    return homePage;
}
export function getExploreSceneTestFITNESS(){
    homePage= [
        {id:'F1',sign:true,type:'Fitness',category:'Gymnastics',tag: 'EXPLORE',title:'FITNESS 1 shops near you',prompt:'', img: require('./img/home/Fitness/1-Gymnastics_EN.png')},
        {id:'F2',sign:true,type:'Fitness',category:'Yoga',tag: 'SPECIAL OFFERS',title:'FITNESS 2 for you ',prompt:'', img: require('./img/home/Fitness/2-Yoga_EN.png')},
        {id:'F3',sign:true,type:'Fitness',category:'Swimming',tag: 'EXPLORE',title:'FITNESS 3 classes near you',prompt:'', img: require('./img/home/Fitness/3-Swimming_EN.png')},
        {id:'F4',sign:true,type:'Fitness',category:'Table_Tennis',tag: 'EXPLORE',title:'FITNESS 4 classes near you',prompt:'', img: require('./img/home/Fitness/4-Table_Tennis_EN.png')},
        {id:'F5',sign:true,type:'Fitness',category:'Tennis',tag: 'EXPLORE',title:'FITNESS 5 classes near you',prompt:'', img: require('./img/home/Fitness/5-Tennis_EN.png')},
        {id:'F6',sign:true,type:'Fitness',category:'Basketball',tag: 'EXPLORE',title:'FITNESS 6 classes near you',prompt:'', img: require('./img/home/Fitness/6-Basketball_EN.png')},
        {id:'F7',sign:true,type:'Fitness',category:'Football',tag: 'EXPLORE',title:'FITNESS 7 classes near you',prompt:'', img: require('./img/home/Fitness/7-Football_EN.png')},
        {id:'F8',sign:true,type:'Fitness',category:'Dancing',tag: 'EXPLORE',title:'FITNESS 8 classes near you',prompt:'', img: require('./img/home/Fitness/8-Dancing_EN.png')},
        {id:'F9',sign:true,type:'Fitness',category:'Martial_Arts',tag: 'EXPLORE',title:'FITNESS 9 classes near you',prompt:'', img: require('./img/home/Fitness/9-Martial_Arts_EN.png')},

    ];
    // let response = await fetch(api.homePage)
    // let json = await response.json()
    return homePage;
}

export function getExploreSceneTestWELLNESS(){
    homePage= [
        {id:'W1',sign:true,type:'Wellness',category:'Massage',tag: 'EXPLORE',title:'WELLNESS 1 classes near you',prompt:'', img: require('./img/home/Wellness/1-Massage_EN.png')},
        {id:'W2',sign:true,type:'Wellness',category:'Acupuncture',tag: 'SPECIAL OFFERS',title:'WELLNESS 2 for you ',prompt:'F.', img: require('./img/home/Wellness/2-Acupuncture_EN.png')},
        {id:'W3',sign:true,type:'Wellness',category:'Meditation',tag: 'EXPLORE',title:'WELLNESS 3 classes near you',prompt:'', img: require('./img/home/Wellness/3-Meditation_EN.png')},
        {id:'W4',sign:true,type:'Wellness',category:'Nutrition',tag: 'EXPLORE',title:'WELLNESS 4 shops near you',prompt:'', img: require('./img/home/Wellness/4-Nutrition_EN.png')},
        {id:'W5',sign:true,type:'Wellness',category:'Naturopathic_Medicine',tag: 'EXPLORE',title:'WELLNESS 5 classes near you',prompt:'', img: require('./img/home/Wellness/5-Naturopathic_Medicine_EN.png')},
        {id:'W6',sign:true,type:'Wellness',category:'Physical_Therapy',tag: 'EXPLORE',title:'WELLNESS 6 classes near you',prompt:'', img: require('./img/home/Wellness/6-Physical_Therapy_EN.png')},
        {id:'W7',sign:true,type:'Wellness',category:'Prenatal_Care',tag: 'EXPLORE',title:'WELLNESS 7 classes near you',prompt:'', img: require('./img/home/Wellness/7-Prenatal_Care_EN.png')},
        {id:'W8',sign:true,type:'Wellness',category:'Coaching_Healing',tag: 'EXPLORE',title:'WELLNESS 8 classes near you',prompt:'', img: require('./img/home/Wellness/8-Coaching_Healing_EN.png')},
        {id:'W9',sign:true,type:'Wellness',category:'Cryotherapy',tag: 'EXPLORE',title:'WELLNESS 9 classes near you',prompt:'', img: require('./img/home/Wellness/9-Cryotherapy_EN.png')},
        {id:'W10',sign:true,type:'Wellness',category:'Heated_Therapy',tag: 'EXPLORE',title:'WELLNESS 10 classes near you',prompt:'', img: require('./img/home/Wellness/10-Heated_Therapy_EN.png')},
        {id:'W11',sign:true,type:'Wellness',category:'Water_Therapy',tag: 'EXPLORE',title:'WELLNESS 11 classes near you',prompt:'', img: require('./img/home/Wellness/11-Water_Therapy_EN.png')},

    ];
    // let response = await fetch(api.homePage)
    // let json = await response.json()
    return homePage;
}

