import {StyleSheet} from "react-native";
import {screen} from "../common";

export const commonStyle = {
    center:{
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    tabViewStylePage: {
        paddingTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
    },
    cubeStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cubeStyleDrink: {
        flex: 1,
        // flexDirection: 'column',
        // alignItems: 'center',
    },
    searchIcon: {
        width: 20,
        height: 20,
    },
    searchText: {
        paddingLeft: 10,
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        color: '#e5e5e5',
        fontFamily:'arial'
    },
    searchText2: {
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#ffffff'
    },
    searchBar: {
        width: screen.width *0.95,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ffffff50',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        marginTop:5,
        paddingTop: 10,
        paddingBottom: 10,
    },
    BarLeftIcon:{
        zIndex: 999,
        paddingBottom: 10,
        paddingTop: 10,
        paddingRight: 50,
        paddingLeft: screen.width * 0.025
    },
    BarRightIcon:{
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 50,
        paddingRight: screen.width * 0.025,
    },
    BarTitle:{
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
                                backgroundColor:'#0000'
    },
    Bar:{
        alignItems: 'center',
        flexDirection: 'row',
        width: screen.width,
        marginTop: 5,
        justifyContent: 'space-between'
    },
    linearGradient: {
        paddingTop: screen.statusBarHeight,
        alignSelf: 'center',
        flex: 1,
        width: screen.width,
    },
    container: {
        flex: 1,
        backgroundColor:'#ffffff00'
    },

    callbackIcon: {
        width: 20,
        height: 20,
        margin: 10,
        alignSelf: 'flex-start',
        tintColor: '#fff'
    },
    banner: {
        width: screen.width,
        height: screen.height * 0.4,
        resizeMode: 'cover',
        backgroundColor: '#000',
    },
    tipHeader: {
        height: 50,
        width: screen.width,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#f3f3f3'
    },
    mapImageStyle: {
        width: screen.width,
        height: screen.width * 0.4,
        borderRadius: 45,
    },
    arrow: {
        width: 16,
        height: 16,
        tintColor: '#5a5a5a',
    },

    surface: {
        width: screen.width,
        height: screen.width,
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#5b5b5b3d',
        backgroundColor: '#fff',
        flex: 1,
    },
    pageImg: {
        width: screen.width,
        height: screen.width,
        borderRadius: 5,
    },
    tabTextStyle: {
        fontSize: 12,
        textAlignVertical: 'center',
    },
    tabViewTextStyle: {
        borderRadius: 5,
        width: screen.width * 0.25,
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
    },
    tabTextInfoStyle: {
        paddingTop: 10,
        paddingBottom: 10,
        width: screen.width * 0.95 / 4,
        alignItems: 'center',
    },
    tabViewStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: screen.width * 0.95,
        flexDirection: 'row',
    },

    containerExplore: { //有重复
        flex: 1,
        paddingTop: screen.statusBarHeight,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },

    searchBox: {//搜索框
        width: screen.width * 0.95,
        flexDirection: 'row',
    },
};
