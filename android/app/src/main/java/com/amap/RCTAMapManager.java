package com.amap;


import android.location.Location;
import android.support.annotation.Nullable;
import android.util.SparseArray;

import com.amap.api.maps2d.AMap;
import com.amap.api.maps2d.CameraUpdateFactory;
import com.amap.api.maps2d.MapView;
import com.amap.api.maps2d.model.CameraPosition;
import com.amap.api.maps2d.model.LatLng;
import com.amap.api.maps2d.model.Marker;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

public class RCTAMapManager extends ViewGroupManager<RCTAMapView>  {
    @Override
    public String getName() {
        return "RCTAMapView";
    }

    RCTAMapView mapView;
    private ThemedReactContext mReactContext;
    private AMap aMap;
    private LatLng point;
    boolean zoomControls = false;//显示缩放按钮
    boolean zoomGestures = true;//手势缩放
    boolean scaleControls = false;//比例尺
    boolean compassEnable = false;//指南针
    boolean myLocation = false;//定位按钮
    String MapLanguage = "cn";//语言切换中(T)英(F)
    int stroke_color;//边框颜色
    int fill_color;//填充颜色
    float radius = 3000;//定位圆圈
    float strokeWidth = 1f;//边框宽度
    private Marker regeoMarker;
    private static final SparseArray<Integer> n = new SparseArray();

    private WritableMap writableMap;

    @Override
    protected RCTAMapView createViewInstance(ThemedReactContext reactContext) {
        RCTAMapView rctaMapView = new RCTAMapView(reactContext);
        mReactContext = reactContext;
        mapView = rctaMapView;
        rctaMapView.setOnMapLoadedListener(new AMap.OnMapLoadedListener() {
            @Override
            public void onMapLoaded() {
                setListeners(mapView.getMAPVIEW());
//                getAddressAsync(new LatLonPoint(point.latitude, point.longitude));
//                writableMap = Arguments.createMap();
//                sendEvent(mapView, "onMapLoaded", writableMap);
            }
        });

        return rctaMapView;
    }

    @ReactProp(name = "compassEnable")
    public void setCompassEnable(RCTAMapView view, boolean _compassEnable) {
        compassEnable = _compassEnable;
        view.setCompassEnable(compassEnable);
    }

    @ReactProp(name = "scaleControls")
    public void setScaleControls(RCTAMapView view, boolean _scaleControls) {
        scaleControls = _scaleControls;
        view.setScaleControls(scaleControls);
    }

    @ReactProp(name = "zoomGestures")
    public void setZoomGestures(RCTAMapView view, boolean _zoomGestures) {
        zoomGestures = _zoomGestures;
        view.setZoomGestures(zoomGestures);
    }

    @ReactProp(name = "zoomControls")
    public void setZoomControls(RCTAMapView view, boolean _zoomControls) {
        zoomControls = _zoomControls;
        view.setZoomControls(zoomControls);
    }

    @ReactProp(name = "stroke_color")
    public void setStroke_color(RCTAMapView view, int _stroke_color) {
        stroke_color = _stroke_color;
        view.setSTROKE_COLOR(stroke_color);
    }

    @ReactProp(name = "fill_color")
    public void setFill_color(RCTAMapView view, int _fill_color) {
        fill_color = _fill_color;
        view.setFILL_COLOR(fill_color);
    }

    @ReactProp(name = "myLocation")
    public void setRadius(RCTAMapView view, boolean _myLocation) {
        myLocation = _myLocation;
        view.setMyLocation(myLocation);
    }

    @ReactProp(name = "strokeWidth")
    public void setStrokeWidth(RCTAMapView view, float _strokeWidth) {
        strokeWidth = _strokeWidth;
        view.setStrokeWidth(strokeWidth);
    }

    @ReactProp(name = "MapLanguage")
    public void setStrokeWidth(RCTAMapView view, String _MapLanguage) {
        MapLanguage = _MapLanguage;
        view.setMapLanguage(MapLanguage);
    }

    @ReactProp(name = "testDataFromJson")
    public void setTestDataFromJson(RCTAMapView view, String _testDataFromJson) {
//        MapLanguage = _testDataFromJson;
        view.setTestDataFromJson(_testDataFromJson);
    }


    @ReactProp(name = "options")
    public void setOptions(RCTAMapView view, final ReadableMap Map) {
        try {
            if (Map.hasKey("centerCoordinate") || Map.hasKey("radius")) {
                ReadableMap centerCoordinateMap = Map.getMap("centerCoordinate");
                float radius = (float) Map.getDouble("radius");
                double latitude = centerCoordinateMap.getDouble("latitude");
                double longitude = centerCoordinateMap.getDouble("longitude");
//                getAddressAsync(new LatLonPoint(latitude, longitude));
                point = new LatLng(latitude, longitude);
                try {
//                    getAddressAsync(new LatLonPoint(point.latitude, point.longitude));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                view.setLatLng(point);
                if (radius > 0) {
                    try {
                        int zoom = n.get((int) radius);
                        if (zoom > 0) {
                            zoom += 2;
                            view.addCircle(point, radius);
                            view.changeCamera(
                                    CameraUpdateFactory.newCameraPosition(new CameraPosition(
                                            point, (float) zoom, 30, 0)));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }else{
                     view.addCircle(point, radius);
                  view.changeCamera(
                                    CameraUpdateFactory.newCameraPosition(new CameraPosition(
                                            point, 18, 30, 0)));
                }
            }
            if (Map.hasKey("zoomLevel")) {
                double zoomLevel = Map.getDouble("zoomLevel");
                view.setZoomLevel(zoomLevel);
            }
            if (Map.hasKey("centerMarker")) {
                String centerMarker = Map.getString("centerMarker");
                view.setCenterMarker(centerMarker);
            }

            if (Map.hasKey("keywords")) {
                String keywords = Map.getString("keywords");

            }

        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    protected void addEventEmitters(
            final ThemedReactContext reactContext,
            final RCTAMapView view) {
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onDidMoveByUser", MapBuilder.of("registrationName", "onDidMoveByUser"))//registrationName 后的名字,RN中方法也要是这个名字否则不执行
                .build();
    }

    //
//    private void setListeners(final RCTAMapView view) {
////        AMapView map = view.getMap();
//    }
//    private GeocodeSearch geocoderSearch;
    private String addressName;

    private void setListeners(final MapView _mapView) {
        final AMap aMap = _mapView.getMap();
//        geocoderSearch = new GeocodeSearch(mReactContext);
//        geocoderSearch.setOnGeocodeSearchListener(this);

        aMap.setOnMyLocationChangeListener(new AMap.OnMyLocationChangeListener() {
            @Override
            public void onMyLocationChange(Location location) {

            }
//            private WritableMap getEventParams(MapStatus mapStatus) {
//                try {
//                    WritableMap writableMap = Arguments.createMap();
//                    WritableMap target = Arguments.createMap();
//                    target.putDouble("latitude", mapStatus.target.latitude);
//                    target.putDouble("longitude", mapStatus.target.longitude);
//                    writableMap.putMap("target", target);
//                    writableMap.putDouble("zoom", mapStatus.zoom);
//                    writableMap.putDouble("overlook", mapStatus.overlook);
//
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//                return null;
//            }

        });

        aMap.setOnMapLoadedListener(new AMap.OnMapLoadedListener() {
            @Override
            public void onMapLoaded() {
                sendEvent(mapView, "onMapLoaded", writableMap);
            }
        });

        aMap.setOnMapClickListener(
                new AMap.OnMapClickListener() {
                    @Override
                    public void onMapClick(LatLng latLng) {
                        //地图点击事件
//                        writableMap = Arguments.createMap();
//                        writableMap.putDouble("latitude", latLng.latitude);
//                        writableMap.putDouble("longitude", latLng.longitude);
//                        CameraUpdate cameraUpdate = CameraUpdateFactory.changeLatLng(latLng);
//                        _mapView.getMap().animateCamera(cameraUpdate);
//                        getAddressAsync(new LatLonPoint(latLng.latitude, latLng.longitude));
//                        RegeocodeAddress regeocodeAddress = new RegeocodeAddress();
//                        regeocodeAddress = getAddress(new LatLonPoint(latLng.latitude, latLng.longitude));
//                        addressName = regeocodeAddress.getFormatAddress();

//                        getAddressAsync(new LatLonPoint(latLng.latitude, latLng.longitude));
//                        writableMap.putString("addressName", addressName);
                        sendEvent(mapView, "onMapClick", null);
                    }
                }
        );
        aMap.setOnMapLongClickListener(new AMap.OnMapLongClickListener() {
            @Override
            public void onMapLongClick(LatLng latLng) {

                //地图点击事件
                writableMap = Arguments.createMap();
                writableMap.putDouble("latitude", latLng.latitude);
                writableMap.putDouble("longitude", latLng.longitude);
//                getAddressAsync(new LatLonPoint(latLng.latitude, latLng.longitude));
                sendEvent(mapView, "onMapLongClick", writableMap);
            }
        });
        aMap.setOnMarkerClickListener(new AMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                try {
                    writableMap = Arguments.createMap();
                    writableMap.putString("Id",marker.getId());
                    writableMap.putString("Snippet",marker.getSnippet());
                    writableMap.putString("Title",marker.getTitle());
                    writableMap.putInt("Period",marker.getPeriod());
                    writableMap.putDouble("latitude",marker.getPosition().latitude);
                    writableMap.putDouble("longitude",marker.getPosition().longitude);
                    sendEvent(mapView, "onMarkerClick", writableMap);
                    return true;
                } catch (Exception e) {
                    e.printStackTrace();
                    return false;
                }
            }
        });
    }

//    /**
//     * 响应逆地理编码
//     */
//    public void getAddressAsync(final LatLonPoint latLonPoint) {
//        RegeocodeQuery query = new RegeocodeQuery(latLonPoint, 200,
//                GeocodeSearch.AMAP);// 第一个参数表示一个Latlng，第二参数表示范围多少米，第三个参数表示是火系坐标系还是GPS原生坐标系
//        geocoderSearch.getFromLocationAsyn(query);// 设置异步逆地理编码请求
//    }
//
//    public RegeocodeAddress getAddress(final LatLonPoint latLonPoint) {
//        RegeocodeQuery query = new RegeocodeQuery(latLonPoint, 200,
//                GeocodeSearch.AMAP);// 第一个参数表示一个Latlng，第二参数表示范围多少米，第三个参数表示是火系坐标系还是GPS原生坐标系
//        RegeocodeAddress regeocodeAddress = new RegeocodeAddress();
//        try {
//            geocoderSearch.getFromLocation(query);
//        } catch (AMapException e) {
//            e.printStackTrace();
//        }
//        return regeocodeAddress;
//    }
//
//
//    @Override
//    public void onRegeocodeSearched(RegeocodeResult result, int rCode) {
//        if (rCode == AMapException.CODE_AMAP_SUCCESS) {
//            if (result != null && result.getRegeocodeAddress() != null
//                    && result.getRegeocodeAddress().getFormatAddress() != null) {
//                addressName = result.getRegeocodeAddress().getFormatAddress();
//                String addressNameTemp = "";
//                if (result.getRegeocodeAddress().getAois().size() > 0) {
//                    addressNameTemp = result.getRegeocodeAddress().getAois().get(0).getAoiName();
//                } else {
//                    int indexTownship = addressName.indexOf(result.getRegeocodeAddress().getTownship()) + result.getRegeocodeAddress().getTownship().length();
//                    addressName = addressName.substring(indexTownship);
//                    addressNameTemp = addressName.length() > 0 ? addressName : result.getRegeocodeAddress().getTownship(); //+ "附近";
//                }
//
//                writableMap = Arguments.createMap();
//                writableMap.putString("addressName", addressNameTemp);
//                try {
//                    aMap.animateCamera(CameraUpdateFactory.newLatLngZoom(
//                            point, 15));
//                    regeoMarker.setPosition(point);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//            }
//            mReactContext
//                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                    .emit("amap.onMapClickDone", writableMap);
//        }
//    }
//
//    @Override
//    public void onGeocodeSearched(GeocodeResult geocodeResult, int i) {
//
//    }

    private void sendEvent(RCTAMapView mapView, String eventName, @Nullable WritableMap params) {
        WritableMap event = Arguments.createMap();
        event.putMap("params", params);
        event.putString("type", eventName);
        mReactContext
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(mapView.getId(),
                        "topChange",
                        event);
    }

    static {
        n.append(2000000, 3);
        n.append(1000000, 4);//
        n.append(500000, 5);//
        n.append(200000, 6);//
        n.append(100000, 7);//
        n.append(50000, 7);//
        n.append(45000, 8);//
        n.append(40000, 8);//
        n.append(35000, 8);//
        n.append(30000, 8);//
        n.append(25000, 9);//
        n.append(20000, 9);//
        n.append(19000, 9);//
        n.append(15000, 9);//
        n.append(12000, 9);//
        n.append(10000, 10);//
        n.append(9000, 10);//
        n.append(6000, 10);//
        n.append(5000, 11);//
        n.append(4000, 11);
        n.append(3000, 11);//
        n.append(2000, 12);//
        n.append(1000, 13);//
        n.append(500, 14);//
        n.append(400, 14);//
        n.append(250, 15);//
        n.append(100, 16);//
        n.append(50, 17);//
        n.append(25, 18);//
        n.append(10, 19);//
        n.append(10, 20);
        n.append(5, 21);
        n.append(2, 22);
    }


}
