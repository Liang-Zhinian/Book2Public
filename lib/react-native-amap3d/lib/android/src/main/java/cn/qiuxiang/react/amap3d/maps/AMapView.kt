package cn.qiuxiang.react.amap3d.maps

import android.content.Context
import android.view.View
import cn.qiuxiang.react.amap3d.toLatLng
import cn.qiuxiang.react.amap3d.toLatLngBounds
import cn.qiuxiang.react.amap3d.toWritableMap
import com.amap.api.maps.AMap
import com.amap.api.maps.CameraUpdateFactory
import com.amap.api.maps.TextureMapView
import com.amap.api.maps.model.*
import com.amap.api.services.core.AMapException
import com.amap.api.services.core.LatLonPoint
import com.amap.api.services.geocoder.GeocodeResult
import com.amap.api.services.geocoder.GeocodeSearch
import com.amap.api.services.geocoder.RegeocodeQuery
import com.amap.api.services.geocoder.RegeocodeResult
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter


class AMapView(context: Context) : TextureMapView(context), GeocodeSearch.OnGeocodeSearchListener  {

    private val eventEmitter: RCTEventEmitter = (context as ThemedReactContext).getJSModule(RCTEventEmitter::class.java)
    private val markers = HashMap<String, AMapMarker>()
    private val lines = HashMap<String, AMapPolyline>()
    private val AMAP: AMap? = getMap()
    private val geocoderSearch: GeocodeSearch = GeocodeSearch(context)
    private var coordinates: ArrayList<LatLng> = ArrayList()

    private val locationStyle by lazy {
        val locationStyle = MyLocationStyle()
        locationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE_NO_CENTER)
        locationStyle
    }

    init {
        super.onCreate(null)

        try {
            map.setMapLanguage("en");
            com.amap.api.maps.MapsInitializer.loadWorldGridMap(true);
            geocoderSearch.setOnGeocodeSearchListener(this);
        } catch (e: Exception) {
            println("Exception"+e)
        }


//        AMap.OnMapLoadedListener {
//            getAddressAsync(
//                    LatLonPoint( coordinate.toLatLng().latitude,  coordinate.toLatLng().longitude)
//            )
//        }

        map.setOnMapClickListener { latLng ->
            for (marker in markers.values) {
                marker.active = false
            }
            emit(id, "onPress", latLng.toWritableMap())
        }

        map.setOnMapLongClickListener { latLng ->
            getAddressAsync(LatLonPoint(latLng.latitude, latLng.longitude))
            emit(id, "onLongPress", latLng.toWritableMap())
        }

        map.setOnMyLocationChangeListener { location ->
            val event = Arguments.createMap()
            event.putDouble("latitude", location.latitude)
            event.putDouble("longitude", location.longitude)
            event.putDouble("accuracy", location.accuracy.toDouble())
            event.putDouble("altitude", location.altitude)
            event.putDouble("speed", location.speed.toDouble())
            event.putInt("timestamp", location.time.toInt())
            emit(id, "onLocation", event)
        }

        map.setOnMarkerClickListener { marker ->
            markers[marker.id]?.let {
                it.active = true
                emit(it.id, "onPress")
            }
            true
        }

        map.setOnMarkerDragListener(object : AMap.OnMarkerDragListener {
            override fun onMarkerDragStart(marker: Marker) {
                emit(markers[marker.id]?.id, "onDragStart")
            }

            override fun onMarkerDrag(marker: Marker) {
                emit(markers[marker.id]?.id, "onDrag")
            }

            override fun onMarkerDragEnd(marker: Marker) {
                emit(markers[marker.id]?.id, "onDragEnd", marker.position.toWritableMap())
            }
        })

        map.setOnCameraChangeListener(object : AMap.OnCameraChangeListener {
            override fun onCameraChangeFinish(position: CameraPosition?) {
                emitCameraChangeEvent("onStatusChangeComplete", position)
            }

            override fun onCameraChange(position: CameraPosition?) {
                emitCameraChangeEvent("onStatusChange", position)
            }
        })

        map.setOnInfoWindowClickListener { marker ->
            emit(markers[marker.id]?.id, "onInfoWindowPress")
        }

        map.setOnPolylineClickListener { polyline ->
            emit(lines[polyline.id]?.id, "onPress")
        }

        map.setOnMultiPointClickListener { item ->
            val slice = item.customerId.split("_")
            val data = Arguments.createMap()
            data.putInt("index", slice[1].toInt())
            emit(slice[0].toInt(), "onItemPress", data)
            false
        }

        map.setInfoWindowAdapter(AMapInfoWindowAdapter(context, markers))

    }



    /**
     * 响应逆地理编码
     */
   fun getAddressAsync(latLonPoint: LatLonPoint) {
        val query = RegeocodeQuery(latLonPoint, 200f,GeocodeSearch.AMAP);// 第一个参数表示一个Latlng，第二参数表示范围多少米，第三个参数表示是火系坐标系还是GPS原生坐标系
       geocoderSearch.getFromLocationAsyn(query)// 设置异步逆地理编码请求
   }
    override fun onGeocodeSearched(result: GeocodeResult?, rCode: Int) {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun onRegeocodeSearched(result: RegeocodeResult?, rCode: Int) {
        var writableMap = Arguments.createMap();
        if (rCode == AMapException.CODE_AMAP_SUCCESS) {
            if (result != null && result.getRegeocodeAddress() != null
                    && result.getRegeocodeAddress().getFormatAddress() != null) {
                val addressName:String? = result.getRegeocodeAddress().getFormatAddress();
                var  addressNameTemp = "";
                if (result.getRegeocodeAddress().getAois().size > 0) {
                    addressNameTemp = result.getRegeocodeAddress().getAois().get(0).getAoiName();
                } else {
                    val len = result.getRegeocodeAddress().getTownship().length;
                    val indexTownship = addressName?.indexOf(result.getRegeocodeAddress().getTownship())!!.plus(len);
                    val addressName2 = addressName.substring(indexTownship);

                            if (addressName2.length > 0) addressNameTemp = addressName
                    else addressNameTemp = result.getRegeocodeAddress().getTownship(); //+ "附近";
                }

                writableMap.putString("addressName", addressNameTemp);
                try {
//                    aMap.animateCamera(CameraUpdateFactory.newLatLngZoom(
//                            point, 15f));
//                    regeoMarker.setPosition(point);
                } catch (e:Exception ) {
                    e.printStackTrace();
                }
            }
            (context as ThemedReactContext)
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                            .emit("amap.onMapClickDone", writableMap)
        }
    }

    fun emitCameraChangeEvent(event: String, position: CameraPosition?) {
        position?.let {
            val data = it.target.toWritableMap()
            data.putDouble("zoomLevel", it.zoom.toDouble())
            data.putDouble("tilt", it.tilt.toDouble())
            data.putDouble("rotation", it.bearing.toDouble())
            if (event == "onStatusChangeComplete") {
                val southwest = map.projection.visibleRegion.latLngBounds.southwest
                val northeast = map.projection.visibleRegion.latLngBounds.northeast
                data.putDouble("latitudeDelta", Math.abs(southwest.latitude - northeast.latitude))
                data.putDouble("longitudeDelta", Math.abs(southwest.longitude - northeast.longitude))
            }
            emit(id, event, data)
        }
    }

    fun emit(id: Int?, name: String, data: WritableMap = Arguments.createMap()) {
        id?.let { eventEmitter.receiveEvent(it, name, data) }
    }

    fun add(child: View) {
        if (child is AMapOverlay) {
            child.add(map)
            if (child is AMapMarker) {
                markers[child.marker?.id!!] = child
            }
            if (child is AMapPolyline) {
                lines[child.polyline?.id!!] = child
            }
        }
    }

    fun remove(child: View) {
        if (child is AMapOverlay) {
            child.remove()
            if (child is AMapMarker) {
                markers.remove(child.marker?.id)
            }
            if (child is AMapPolyline) {
                lines.remove(child.polyline?.id)
            }
        }
    }

    private val animateCallback = object : AMap.CancelableCallback {
        override fun onCancel() {
            emit(id, "onAnimateCancel")
        }

        override fun onFinish() {
            emit(id, "onAnimateFinish")
        }
    }

    fun animateTo(args: ReadableArray?) {
        val currentCameraPosition = map.cameraPosition
        val target = args?.getMap(0)!!
        val duration = args.getInt(1)

        var coordinate = currentCameraPosition.target
        var zoomLevel = currentCameraPosition.zoom
        var tilt = currentCameraPosition.tilt
        var rotation = currentCameraPosition.bearing

        if (target.hasKey("coordinate")) {
            coordinate = target.getMap("coordinate").toLatLng()
        }

        if (target.hasKey("zoomLevel")) {
            zoomLevel = target.getDouble("zoomLevel").toFloat()
        }

        if (target.hasKey("tilt")) {
            tilt = target.getDouble("tilt").toFloat()
        }

        if (target.hasKey("rotation")) {
            rotation = target.getDouble("rotation").toFloat()
        }

        val cameraUpdate = CameraUpdateFactory.newCameraPosition(
                CameraPosition(coordinate, zoomLevel, tilt, rotation))
        map.animateCamera(cameraUpdate, duration.toLong(), animateCallback)
    }

    fun setRegion(region: ReadableMap) {
        map.moveCamera(CameraUpdateFactory.newLatLngBounds(region.toLatLngBounds(), 0))
    }

    fun setCoordinate(coordinates: ReadableMap) {
        getAddressAsync(
                LatLonPoint( coordinates.toLatLng().latitude,  coordinates.toLatLng().longitude)
        )
    }
    fun setLimitRegion(region: ReadableMap) {
        map.setMapStatusLimits(region.toLatLngBounds())
    }

    fun setLocationEnabled(enabled: Boolean) {
        map.isMyLocationEnabled = enabled
        map.myLocationStyle = locationStyle
    }

    fun setLocationInterval(interval: Long) {
        locationStyle.interval(interval)
    }

    fun setLocationStyle(style: ReadableMap) {
        if (style.hasKey("fillColor")) {
            locationStyle.radiusFillColor(style.getInt("fillColor"))
        }

        if (style.hasKey("strokeColor")) {
            locationStyle.strokeColor(style.getInt("strokeColor"))
        }

        if (style.hasKey("strokeWidth")) {
            locationStyle.strokeWidth(style.getDouble("strokeWidth").toFloat())
        }

        if (style.hasKey("image")) {
            val drawable = context.resources.getIdentifier(
                    style.getString("image"), "drawable", context.packageName)
            locationStyle.myLocationIcon(BitmapDescriptorFactory.fromResource(drawable))
        }
    }

    fun setLocationType(type: Int) {
        locationStyle.myLocationType(type)
        map.myLocationStyle = locationStyle
    }
}