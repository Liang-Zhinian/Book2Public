import React from 'react';
import {BVLinearGradient, StyleSheet,} from 'react-native';
import {screen} from '../../common/index'
import LinearGradient from 'react-native-linear-gradient';

export default class SettingScene extends React.Component {
    static navigationOptions = ({navigation}: any) => ({
        header: null,
    });
    constructor(props: Props) {
        super(props);

        this.state = {
            LeftWidth:screen.width*0.95/2,
            sliderWidth:20,
        };

        this.count = 0;
    }


    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <LinearGradient colors={screen.colorTemp}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[styles.linearGradient]}>
                {/*<View style={{*/}
                    {/*// position: 'absolute',*/}
                    {/*// top: screen.statusBarHeight,*/}
                    {/*// zIndex: 10,*/}
                    {/*alignItems: 'center',*/}
                    {/*justifyContent:'space-between',*/}
                    {/*flexDirection: 'row',*/}
                    {/*width: screen.width,*/}
                {/*}}>*/}
                    {/*<TouchableOpacity activeOpacity={0.5} onPress={() => {*/}
                        {/*this.props.navigation.goBack();*/}
                    {/*}}>*/}
                        {/*<Image source={LocalImage.goBackIcon}*/}
                               {/*style={[styles.callbackIcon, {}]}*/}
                               {/*onPress={() => {*/}
                                   {/*this.props.navigation.goBack();*/}
                               {/*}}*/}
                        {/*/>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<Text style={{color:'#fff'}}>FAQ</Text>*/}
                    {/*<TouchableOpacity activeOpacity={0.5} onPress={() => {*/}
                        {/*this.props.navigation.goBack();*/}
                    {/*}}>*/}
                        {/*<View  style={[styles.callbackIcon, {}]}/>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}
                {/*/!*<Button title={'测试写入'} onPress={()=>{this.fun01()}}/>*!/*/}
                {/*<Button title={'测试读取'} titleStyle={{color:'#fff',backgroundColor:'#407dff',borderRadius:50,padding:5}} style={{margin:5,}} onPress={()=>{this.fun01()}}/>*/}
                {/*<Button title={'测试清除'} titleStyle={{color:'#fff',backgroundColor:'#407dff',borderRadius:50,padding:5}} style={{margin:5,}} onPress={()=>{this.fun03()}}/>*/}

            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6697ff',
    },
    linearGradient: {
        // justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        width: screen.width,
        paddingTop:screen.statusBarHeight,
    },
    searchIcon: {
        backgroundColor: 'transparent',
        width: 20,
        height: 20,
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    callbackIcon: {
        width: 20,
        height: 20,
        margin: 10,
        alignSelf: 'flex-start',
    },
});