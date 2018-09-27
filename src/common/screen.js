

import { Dimensions, Platform, PixelRatio,StatusBar } from 'react-native'

export default {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    onePixel: 1 / PixelRatio.get(),
    statusBarHeight: (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight),
    colorTemp: ['#0f143a', '#4A4C7D', '#f4cad8'],
    gradualColorBottom:['#0f143a', '#4A4C7D', '#9999f4']
}