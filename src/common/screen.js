import {Dimensions, Platform, PixelRatio, StatusBar} from 'react-native'

const dp2px = dp => PixelRatio.getPixelSizeForLayoutSize(dp);
const px2dp = px => PixelRatio.roundToNearestPixel(px);
// let designSize = {width: 720, height: 1280}; //假设设计尺寸为：720*1280
let pxRatio = PixelRatio.get();
let win_width = Dimensions.get("window").width;
let win_height = Dimensions.get("window").height;
// let width = dp2px(win_width);
// let height = dp2px(win_height);
// let design_scale = designSize.width / width;
// height = height * design_scale
// let scale = 1 / pxRatio / design_scale;

export default {
    width: win_width,
    height: win_height,
    onePixel: 1 / PixelRatio.get(),
    statusBarHeight: (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight+10),
    colorTemp: ['#0f143a', '#4A4C7D', '#f4cad8'],
    colorTemp2: ['#3397ff', '#64c8ff', '#f4f4f4'],
    // sliderColor:['#309bff', '#89ceff', '#309bff'],
    // sliderColor:['#1207ff', '#2d68bb', '#3b14d2'],
    sliderColor:['#000000', '#000000', '#000000'],
    gradualColorBottom: ['#0f143a', '#4A4C7D', '#9999f4']
}