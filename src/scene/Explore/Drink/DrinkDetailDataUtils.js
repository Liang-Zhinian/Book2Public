function requestData(data) {
    try {
        return data.map((info) => {
            return {
                key: info.Vineyard_Id,
                id: info.Vineyard_Id,
                imageUrl: null,
                title: info.Vineyard,
                subtitle: info.MapLink,
                phone: null,
                Latitude: info.Latitude,
                Longitude: info.Longitude,
                AdditionalLocationImages: null,
                firmId: info.Vineyard_Id,
            }
        });
        // //数据打乱
        // dataList.sort(() => {
        //     return 0.5 - Math.random()
        // });
    } catch (e) {
        console.warn(e)
    }
}


function requestProducerData(data) {
    try {
        return data.map((info) => {
            return {
                key: info.Entity_Id,
                id: info.Entity_Id,
                imageUrl: null,
                title: info.EntityName,
                subtitle: info.MapLink,
                phone: info.TelNo1,
                Latitude: info.Latitude,
                Longitude: info.Longitude,
                AdditionalLocationImages: null,
                firmId: info.Entity_Id,
                Email:info.Email,
                URL:info.URL
            }
        });
        // //数据打乱
        // dataList.sort(() => {
        //     return 0.5 - Math.random()
        // });
    } catch (e) {
        console.warn(e)
    }
}

function requestWineData(data) {
    console.log('requestWineData',data);
    try {
        // if (data.length > 0) {
            return data.map((info) => {
                return {
                    key: info.Wine_Id,
                    id: info.Wine_Id,
                    imageUrl: null,
                    title: info.WineName,
                    AdditionalLocationImages: null,
                    firmId: info.Producer_Id,
                    Appellation:info.Appellation,
                    Colour:info.Colour

                }
            });
        // }

    } catch (e) {
        console.warn(e)
    }
}
function requestAreaData(data) {
    try {
        return data.map((info) => {
            return {
                id: info.region_id,
                name: info.regionname,
                spellName: info.regionname,
                fullname: info.regionname,
                sortLetters: info.regionname.substring(0,1).toUpperCase() ,
            }
        });
    } catch (e) {
        console.warn(e)
    }
}
function requestFormatProducerData(data) {
    try {
        let sortList=[];
        return data.map((info) => {
            return {
                id: info.Entity_Id,
                name: info.EntityName,
                spellName: info.EntityName,
                fullname: info.EntityName,
                sortLetters: info.EntityName.substring(0,1).toLowerCase() ,
            }
        });
    } catch (e) {
        console.warn(e)
    }
}
export default module.export = {
    requestData,
    requestProducerData,
    requestWineData,
    requestAreaData,
    requestFormatProducerData,
}