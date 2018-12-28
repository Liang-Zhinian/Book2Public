import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    ListView,
    Modal ,
} from 'react-native';
var Dimensions = require('Dimensions');
import screen from '../../common/screen'
import * as ScreenUtil from "./ScreenUtil";
export default class SelectBox extends Component {
    constructor(props){
        super(props);
        this.state=({
            showModal:false,
            course:"Producer",

        });
    }
    componentWillMount(){

    }
    selCourse(course){
        this.setState({
            showModal:false,
            course:course,
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headStyle}>
                    <Text style={styles.headText} onPress={()=>{this.setState({showModal:true})}}>
                        {this.state.course}
                    </Text>
                    <TouchableOpacity style={{marginLeft:10}}
                                      onPress={()=>{this.setState({showModal:true})}}
                                      hitSlop={{top: 15, left: 15, bottom: 15, right: 15}}>
                        <Image style={styles.arrowStyle} source={{uri:'arrow_down'}}/>
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={this.state.showModal}
                    transparent={true}
                    animationType='fade'
                    onRequestClose={() => {}}
                    style={{flex:2,backgroundColor:'#fff'}}
                    ref="modal"  >
                    <TouchableWithoutFeedback onPress={() => {
                        this.setState({showModal: false})
                    }}>
                        <View style={{flex: 1, alignItems: 'center', }}>
                            <TouchableWithoutFeedback onPress={() => {
                            }}>
                                <View style={{
                                    marginTop:20,
                                    backgroundColor: '#c1beff',
                                    width: screen.width,
                                    justifyContent: 'center',
                                    alignItems:'center'

                                }}
                                >
                                    <View style={styles.courseWrap}>
                                        <CourseItem course="Producer" onPress={() => {
                                            this.selCourse('Producer')
                                        }}/>
                                        <CourseItem course="Vineyard" onPress={() => {
                                            this.selCourse('Vineyard')
                                        }}/>
                                    </View>
                                    <View style={[styles.courseWrap, {marginBottom: 10}]}>
                                        <CourseItem course="Wines" onPress={() => {
                                            this.selCourse('Wines')
                                        }}/>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }
}
class CourseItem extends Component{
    render(){
        return(
            <TouchableOpacity style={styles.boxView} onPress={this.props.onPress}>
                <View >
                    <Text style={{fontSize:ScreenUtil.setSpText(13), color:'#000',fontWeight:'200'}}>{this.props.course}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
var cols = 3;
var boxW = 70;
var vMargin = (screen.idth-cols*boxW)/(cols+1);
var hMargin = 25;
const styles = StyleSheet.create({
    arrStyle:{
        width:26,
        height:26,
        resizeMode:'contain',
    },
    boxView:{
        justifyContent:'center',
        alignItems:'center',
        width:screen.width/2,
        // height:boxW,
        marginLeft:vMargin,
        marginTop:10,
        // borderWidth:StyleSheet.hairlineWidth,
        // borderColor:'#999',
    },
    courseWrap:{
        flexDirection:'row',
        justifyContent:'flex-start',
    },
    selCourseText:{
        padding:8,
        fontSize:ScreenUtil.setSpText(18),
    },
    blackText:{
        color:'black',
        fontSize:ScreenUtil.setSpText(16),
    },
    arrowStyle:{
        width:20,
        height:20,
    },
    textWrapView:{
        paddingTop:10,
        paddingBottom:10,
    },
    headText:{
        color:'#fff',
        fontSize:ScreenUtil.setSpText(13),
    },
    headStyle:{
        flexDirection:'row',
        width:screen.width,
        justifyContent:"center",
        alignItems:'center',
    },
    container: {
        // flex: 1,
        alignItems: 'center',
    },

});
