package com.amap;

import com.amap.api.maps2d.model.LatLng;
import com.amap.api.services.core.LatLonPoint;
import com.amap.api.services.core.PoiItem;
import com.amap.api.services.poisearch.PoiResult;
import com.amap.api.services.poisearch.PoiSearch;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.List;


public class RCTAMapModule extends ReactContextBaseJavaModule implements PoiSearch.OnPoiSearchListener {
    ReactApplicationContext mContext;

    private PoiSearch poiSearch;
    private PoiSearch.Query query;// Poi查询条件类
    private int defaultRadius = 3000;

    public RCTAMapModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        PoiSearch poiSearch = new PoiSearch(mContext, null);
        this.poiSearch = poiSearch;
    }

    @Override
    public String getName() {
        return "AMapModule";
    }

    @ReactMethod
    public void setOptions(final int reactTag, final ReadableMap options) {
        mContext.getCurrentActivity().runOnUiThread(new Runnable() {
            public void run() {
                final RCTAMapView mapView = ((RCTAMapView) mContext.getCurrentActivity().findViewById(reactTag));
                if (options.hasKey("centerCoordinate")) {
                    ReadableMap centerCoordinateMap = options.getMap("centerCoordinate");
                    mapView.setLatLng(new LatLng(centerCoordinateMap.getDouble("latitude"), centerCoordinateMap.getDouble("longitude")));
                }
                if (options.hasKey("zoomLevel")) {
                    double zoomLevel = options.getDouble("zoomLevel");
                    mapView.setZoomLevel(zoomLevel);
                }
            }
        });
    }

    @ReactMethod
    public void setCenterCoordinate(final int reactTag, final ReadableMap coordinate) {
        mContext.getCurrentActivity().runOnUiThread(new Runnable() {
            public void run() {
                final RCTAMapView mapView = ((RCTAMapView) mContext.getCurrentActivity().findViewById(reactTag));
                mapView.setCenterLocation(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"));
            }
        });
    }

    @ReactMethod
    public void searchPoiByCenterCoordinate(ReadableMap params) {

        String types = "";
        if (params.hasKey("types")) {
            types = params.getString("types");
        }
        String keywords = "";
        if (params.hasKey("keywords")) {
            keywords = params.getString("keywords");
        }

        PoiSearch.Query query = new PoiSearch.Query(keywords, types);

        if (params.hasKey("offset")) {
            int offset = params.getInt("offset");
            query.setPageSize(offset);// 设置每页最多返回多少条poiitem
        }
        if (params.hasKey("page")) {
            int page = params.getInt("page");
            query.setPageNum(page);//设置查询页码
        }
        poiSearch.setQuery(query);
        if (params.hasKey("coordinate")) {
            ReadableMap coordinateMap = params.getMap("coordinate");
            double latitude = coordinateMap.getDouble("latitude");
            double longitude = coordinateMap.getDouble("longitude");
            int radius = defaultRadius;
            if (params.hasKey("radius")) {
                radius = params.getInt("radius");
            }
            poiSearch.setBound(new PoiSearch.SearchBound(new LatLonPoint(latitude, longitude), radius)); //设置周边搜索的中心点以及半径(单位: 米, 默认3公里)
            doSearchQuery(keywords, "", latitude, longitude, radius);
        }
//         poiSearch.setOnPoiSearchListener(this);
//        poiSearch.searchPOIAsyn();
    }

    /**
     * 开始进行poi搜索
     */
    protected void doSearchQuery(String keyWord, String city, Double latitude, Double longitude, int radius) {
        query = new PoiSearch.Query(keyWord, "", city);// 第一个参数表示搜索字符串，第二个参数表示poi搜索类型，第三个参数表示poi搜索区域（空字符串代表全国）
        query.setPageSize(20);// 设置每页最多返回多少条poiitem
        query.setPageNum(0);// 设置查第一页
        LatLonPoint lp = new LatLonPoint(latitude, longitude);//
        if (lp != null) {
            poiSearch = new PoiSearch(mContext, query);
            poiSearch.setOnPoiSearchListener(this);
            poiSearch.setBound(new PoiSearch.SearchBound(lp, radius, true));//
            // 设置搜索区域为以lp点为圆心，其周围5000米范围
            poiSearch.searchPOIAsyn();// 异步搜索
        }
    }


    @Override
    public void onPoiSearched(PoiResult result, int rCode) {
        List<PoiItem> poiItems;
        WritableMap dataMap = Arguments.createMap();
        if (rCode == 1000) {
            if (result != null && result.getQuery() != null) {// 搜索poi的结果
                // 取得搜索到的poiitems有多少页
                poiItems = result.getPois();// 取得第一页的poiitem数据，页数从数字0开始

                WritableArray array = Arguments.createArray();
                for (PoiItem poi : poiItems) {
                    WritableMap data = Arguments.createMap();
                    data.putString("uid", poi.getPoiId());
                    data.putString("name", poi.getTitle());
                    data.putString("type", poi.getTypeDes());
                    data.putDouble("longitude", poi.getLatLonPoint().getLongitude());
                    data.putDouble("latitude", poi.getLatLonPoint().getLatitude());


                    data.putString("address", poi.getSnippet());
                    data.putString("tel", poi.getTel());
                    data.putInt("distance", poi.getDistance());
                    data.putString("cityCode", poi.getCityCode());
                    data.putString("cityName", poi.getCityName());
                    data.putString("provinceCode", poi.getProvinceCode());
                    data.putString("provinceName", poi.getProvinceName());
                    data.putString("adCode", poi.getAdCode());
                    data.putString("adName", poi.getAdName());
                    array.pushMap(data);
                }
                dataMap.putArray("searchResultList", array);
            }
        } else {
            WritableMap error = Arguments.createMap();
            error.putString("code", String.valueOf(rCode));
            dataMap.putMap("error", error);
        }

        mContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("amap.onPOISearchDone", dataMap);
    }

    @Override
    public void onPoiItemSearched(PoiItem poiItem, int i) {

    }
}
