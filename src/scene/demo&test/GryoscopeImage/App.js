import React, { Component } from "react";
import { StyleSheet,ImageBackground, Text, View, Image } from "react-native";
import { Gyroscope } from "react-native-sensors";
import {screen} from "../../../common";
import Cube from '../../Cube/Cube';
const Dimensions = require("Dimensions");
const PixelRatio = require("PixelRatio");
const window = Dimensions.get("window");

const deviceWidth = window.width;
const deviceHeight = window.height;

const imageWidth = 8 * deviceWidth;
const imageHeight = deviceHeight;

const middleOfTheScreenX = (imageWidth - deviceWidth) / 2;

export default class App extends Component {
  constructor(props) {
    super(props);

    new Gyroscope({
      updateInterval: 12
    })
      .then(observable => {
        observable.subscribe(({x, y,z,timestamp }) => {
            if (Math.floor(Math.abs(y)*100)===0) return;
            if (this.timestamp != 0)
            {
                // event.timesamp表示当前的时间，单位是纳秒（1百万分之一毫秒）
                let dT = (timestamp - this.timestamp) / (1000);
                this.setState({angle: [this.state.angle[0] + x * dT,this.state.angle[1] + y * dT]},
                    ()=>{
                        let degX = Math.floor(this.state.angle[0] * (180/Math.PI) % 90)*screen.width/90;
                        let degY = Math.floor(this.state.angle[1] * (180/Math.PI) % 90)*screen.width/90;
                    // if (Math.abs(degX) > 90||Math.abs(degY) > 90) return;
                        this.refs['swiper'].sensorDeg(degX,degY)
                     }
                );
            }
            this.timestamp = timestamp;
          this.setState(state => ({
            y: y + state.y
          }));
        });
      })
      .catch(error => {
        console.log("The sensor is not available");
      });

    this.state = {
        angle:[0,0],
      image: `https://placeimg.com/${PixelRatio.getPixelSizeForLayoutSize(
        imageWidth
      )}/${PixelRatio.getPixelSizeForLayoutSize(imageHeight)}/any`,
      y: 0
    };
  }

    timestamp = 0;

    HomeView() {
        var hooo= [
            <View ref='f0' style={styles.surface}>
                <ImageBackground source={require('../../../img/home/Beauty.png')}
                                 style={[styles.pageImg,{flexDirection:'column',justifyContent:'center' ,alignSelf:'center',alignItems: 'center',}]}>
                    {/*<Square/>*/}
                    {/*<View style={{flexDirection:'row', alignItems: 'center',backgroundColor:'#ff001100',width:screen.width,height:screen.width/3}}/>*/}
                    <View style={{flexDirection:'column',backgroundColor:'#2b90cd5e',padding:5,width:screen.width,height:screen.width/3}}>
                        <Text style={{
                            fontSize: 17,
                            color: '#fff',
                            fontFamily: 'arial'
                        }}>
                            EXPLORE
                        </Text>
                        <Text style={{
                            fontSize: 40,
                            color: '#fff',
                            fontFamily: 'arial'
                        }}>
                            Discover beauty {"\n"}
                            shops near you
                        </Text>
                    </View>
                    {/*<View style={{flexDirection:'column', alignItems: 'center',backgroundColor:'#2b90cd00',width:screen.width,height:screen.width/3}}/>*/}
                </ImageBackground>
            </View>,
            <View ref='f1' style={styles.surface}>
                <ImageBackground source={require('../../../img/home/Fitness.png')}
                                 style={[styles.pageImg,{flexDirection:'column',justifyContent:'center' ,alignSelf:'center',alignItems: 'center',}]}>
                    <View style={{flexDirection:'column',backgroundColor:'#2b90cd5e',padding:5,width:screen.width,height:screen.width/3}}>
                        <Text style={{
                            fontSize: 17,
                            color: '#fff',
                            fontFamily: 'arial'
                        }}>
                            SPECIAL OFFERS
                        </Text>
                        <Text style={{
                            fontSize: 40,
                            color: '#fff',
                            fontFamily: 'arial'
                        }}>
                            Good deals for you {"\n"}
                        </Text>
                        <Text style={{
                            fontSize: 17,
                            color: '#fff',
                            fontFamily: 'arial'
                        }}>
                            Find great offers from the best locations in{"\n"}
                            fitness,wellness and beauty.
                        </Text>
                    </View>
                </ImageBackground>
            </View>,
            <View ref='f2' style={styles.surface}>
                <ImageBackground source={require('../../../img/home/Wellness.png')}
                                 style={[styles.pageImg,{flexDirection:'column',justifyContent:'center' ,alignSelf:'center',alignItems: 'center',}]}>
                    <View style={{flexDirection:'column',backgroundColor:'#2b90cd5e',padding:5,width:screen.width,height:screen.width/3}}>
                        <Text style={{
                            fontSize: 17,
                            color: '#fff',
                            fontFamily: 'arial'
                        }}>
                            EXPLORE
                        </Text>
                        <Text style={{
                            fontSize: 40,
                            color: '#fff',
                            fontFamily: 'arial'
                        }}>
                            Discover fitness {"\n"}
                            classes near you{"\n"}
                        </Text>
                    </View>
                </ImageBackground>
            </View>,
            <View ref='f3' style={styles.surface}>
                <ImageBackground source={require('../../../img/home/Beauty.png')}
                                 style={[styles.pageImg,{flexDirection:'column',justifyContent:'center' ,alignSelf:'center',alignItems: 'center',}]}>
                    <View style={{flexDirection:'column',backgroundColor:'#2b90cd5e',padding:5,width:screen.width,height:screen.width/3}}>
                        <Text style={{
                            fontSize: 17,
                            color: '#fff',
                            fontFamily: 'arial'
                        }}>
                            EXPLORE
                        </Text>
                        <Text style={{
                            fontSize: 40,
                            color: '#fff',
                            fontFamily: 'arial'
                        }}>
                            Discover wellness {"\n"}
                            classes near you{"\n"}
                        </Text>
                    </View>
                </ImageBackground>
            </View>
        ]
        return hooo
    }

  render() {
    const positionOnScreenX = -imageWidth / 2;
    // The y axis of the sensor data resembles what we need for the x axis
    // in the image
    const movementX = -this.state.y / 10 * imageWidth;
    return (
      <View style={styles.container}>
        <Image
            // rotateY={(positionOnScreenX + movementX)/100}
          translateX={500}
          style={[styles.image,{ transform: [{rotateY:(-Math.floor(this.state.angle[0] * (180/Math.PI) % 90))+'deg'}]}]}
          source={{ uri: this.state.image }}
        />
          <View    style={[styles.cubeStyle,
              // {transform: [{rotateY:(Math.floor(this.state.angle[0] * (180/Math.PI) % 90))+'deg'}]}
          ]}>
              {/*<Text>{Math.floor(this.state.angle[0] * (180/Math.PI) % 90)} deg</Text>*/}
              <Cube ref='swiper'
                    position={0}
                    touchState={() => {
                    }}
              >
                  {this.HomeView()}
              </Cube>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    height: screen.height*0.3,
    width: screen.width*0.95
  },

    surface: {
        width: screen.width,
        height: screen.width,
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#282828a3',
        backgroundColor: '#fff',
        flex: 1,
    },
    pageImg: {
        width: screen.width,
        height: screen.width,
        // resizeMode: 'contain',// 设置图片填充模式
        borderRadius: 5,
        flexDirection: 'row',
    },
    cubeStyle: {
        // flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#95acff'
    },
});
