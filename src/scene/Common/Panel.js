import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Animated, LayoutAnimation
} from 'react-native'
import PropTypes from 'prop-types'
import {screen} from "../../common";
import * as ScreenUtil from "./ScreenUtil";
const ICONS = {
    up: require('../../img/mine/icon_homepage_up_arrow.png'),
    down: require('../../img/mine/icon_homepage_down_arrow.png')
};
//折叠菜单
export default class Panel extends Component {
    static propTypes = {
        expanded: PropTypes.bool,
        title: PropTypes.string,
        onToggle: PropTypes.func,
    };

    static defaultProps = {
        expanded: true
    };

    constructor (props) {
        super(props)

        this.state = {
            expanded: props.expanded,
            animation: new Animated.Value(45)
        }
    }

    toggle = () => {
        const { onToggle } = this.props;
        const { expanded, maxHeight, minHeight, animation } = this.state;
        const initialValue = expanded ? minHeight + maxHeight : minHeight;
        const finalValue = expanded ? minHeight : minHeight + maxHeight;

        this.setState({expanded: !expanded});
        animation.setValue(initialValue);
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
        Animated.timing(animation, {
            toValue: finalValue,
            duration: 200, // 动画时间
        }).start()

        // onToggle()
    };

    render () {
        const { expanded, animation, maxHeight } = this.state;
        const icon = expanded ? 'up' : 'down';

        return (
            <Animated.View style={[styles.container, {height: animation},this.props.style]}>
                <TouchableOpacity activeOpacity={0.8}
                                  onPress={this.toggle}
                                  style={styles.titleContainer}
                      onLayout={event => this.setState({minHeight: event.nativeEvent.layout.height})}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <View style={styles.button} >
                        <Image style={styles.buttonImage} source={ICONS[icon]} />
                    </View>
                </TouchableOpacity>
                {/*fixed bug in recent version of react-native that maxHeight will be changed when body is collapsed*/}
                <View style={styles.body}
                      onLayout={event => {
                          !maxHeight && this.setState({
                              maxHeight: event.nativeEvent.layout.height
                          })
                      }}>
                    {this.props.children}
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        overflow:'hidden',
        paddingLeft: 10,
        paddingRight: 10,
        width:screen.width*0.95,
        alignSelf:'center',
        marginBottom:5,
        borderRadius:3,
    },
    titleContainer: {
        flexDirection: 'row',
        height:45,
        alignItems: 'center'
    },
    title: {
        flex: 1,
        padding: 5,
        color:'#393939',
        fontSize:ScreenUtil.setSpText(15),
        fontFamily:'arial',
        fontWeight:'500',
        justifyContent:'center'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonImage: {
        width: 20,
        height: 20,
        tintColor:'#7c7c7c',
    },
    body: {
        // padding: 10,
        // paddingTop: 0
    }
});