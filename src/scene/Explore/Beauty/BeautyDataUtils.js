function requestBeautyData(data) {
    try {
        return data.map((info) => {
            return {
                key: info.Id,
                id: info.Id,
                imageUrl: info.ImageUri,
                title: info.Name,
                subtitle: info.Address.Street,
                phone: info.ContactInformation.PrimaryTelephone,
                Latitude: info.Geolocation.Latitude,
                Longitude: info.Geolocation.Longitude,
                AdditionalLocationImages: info.AdditionalLocationImages,
                SiteId: info.SiteId,
            }
        });
    } catch (e) {
        console.warn(e)
    }
}
function requestBeautyService(data) {
    try {
        return data.map((info) => {
            return {
               Id:info.Id,
               Name:info.Name,
                title:info.Description,
               DefaultTimeLength:info.DefaultTimeLength,
               ServiceCategoryId:info.ServiceCategoryId,
               ServiceCategory:info.ServiceCategory,
               IndustryStandardCategoryName:info.IndustryStandardCategoryName,
               IndustryStandardSubcategoryName:info.IndustryStandardSubcategoryName,
               Price:info.Price,
               AllowOnlineScheduling:info.AllowOnlineScheduling,
            }
        });
    } catch (e) {
        console.warn(e)
    }
}
export default module.export = {
    requestBeautyData,
    requestBeautyService
}