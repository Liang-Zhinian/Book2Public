/**
 * Created by marno on 2017/4/18
 * Function:
 * Desc:
 */
import {StyleSheet} from 'react-native';
import {Colors} from '../../../resource/';
import * as ScreenUtil from "../../../../../../Common/ScreenUtil";

export default StyleSheet.create({
    image_bottom_menu:{
        height:50,
        width:50,
        marginBottom:10,
    },
    view_menu_container:{
        flexDirection:'row',
        justifyContent:'space-around',
        paddingTop:16
    },
    text_menu_title:{
        color:'white',
        fontSize:ScreenUtil.setSpText(14)
    },
    view_menu_item_container:{
        justifyContent:'center',
        alignItems:'center',
    }

})