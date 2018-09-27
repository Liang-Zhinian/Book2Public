import React, {PureComponent} from 'react'

import {AppRegistry, BVLinearGradient,TextInput,NetInfo} from 'react-native'

import RootScene from './src/RootScene';

TextInput.defaultProps.selectionColor = 'white';
require('react-native');
require('ErrorUtils').setGlobalHandler(function (err) {
    console.log(err);
});
setTimeout(()=>{
    throw new Error('Ouch');
}, 10000);

// require('./src/app'); // 正常启动app

export default class Book2 extends PureComponent<{}> {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: null,
            connectionInfo:null,
        };
    }
    //页面的组件渲染完毕（render）之后执行
    componentDidMount() {
        //检测网络是否连接
        NetInfo.isConnected.fetch().done((isConnected) => {
            this.setState({isConnected});
        });

        //检测网络连接信息
        NetInfo.fetch().done((connectionInfo) => {
            this.setState({connectionInfo});
        });

        //监听网络变化事件
        NetInfo.addEventListener('change', (networkType) => {
            this.setState({isConnected: networkType})
        })
    }

    render() {
        // console.log(this.state.isConnected,this.state.connectionInfo);
        return (
            <RootScene />
        );
    }
}

console.disableYellowBox = true; // 关闭全部黄色警告
AppRegistry.registerComponent('Book2', () => Book2);
