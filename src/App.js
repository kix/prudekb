import React, { Component } from 'react';
import MapGL, {Marker, Popup, FlyToInterpolator} from 'react-map-gl';
import MarkerPin from './MarkerPin';
import InfoWindow from './InfoWindow';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';

var markers = [
  {longitude: 60.603361380079924, latitude: 56.83859529541126, name: "Плотинка", bearing: -36},
  {longitude: 60.589579032524135, latitude: 56.84785290256262, name: "Макаровский мост", bearing: -50},
  {latitude: 56.843848196152976, longitude: 60.600892337384956, name: "Стрелка Динамо", bearing: 21},
  {latitude: 56.839511273787316, longitude: 60.60116363755444, name: "НабРабМол", bearing: -143},
  {latitude: 56.84565576601448, longitude: 60.59808296988037, name: "Причал Динамо", bearing: 21},
  
  {latitude: 56.847124082004676, longitude: 60.59389735633216, name: 1},
  {latitude: 56.84128008264898, longitude: 60.60044804304683, name: 2},
  {latitude: 56.84393021942463, longitude: 60.60413088052312, name: 3},
  {latitude: 56.8447975427135, longitude: 60.59372644848078, name: 4},
  {latitude: 56.84069642993052, longitude: 60.60455710047975, name: 5},
  {latitude: 56.84246459592091, longitude: 60.59752132994529, name: 6},
  {latitude: 56.844112898802976, longitude: 60.5967315124456, name: 7}
];

class App extends Component {
  state = {
    viewport: {
      latitude: 56.842690645735345,
      longitude: 60.59822075760017,
      zoom: 15.411454,
      bearing: 0,
      pitch: 60,
      width: 500,
      height: 500
    },
    settings: {
      dragPan: true,
      dragRotate: true,
      scrollZoom: true,
      touchZoom: true,
      touchRotate: true,
      keyboard: true,
      doubleClickZoom: true,
      minZoom: 0,
      maxZoom: 20,
      minPitch: 0,
      maxPitch: 85,
    }
  }  
  
  onViewportChange = viewport => {
    if (viewport.latitude > 56.848763529719264
     || viewport.latitude < 56.83458757609529
     || viewport.longitude > 60.60864758531832
     || viewport.longitude < 60.58800143091794
    ) {
      return;
    }
    this.setState({viewport})
  }

  resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    })
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        console.log(latitude, longitude, position.coords);
        markers.push({
          latitude: latitude,
          longitude: longitude,
          name: "Location",
          type: "location"
        })
      },
      (error) => {
        console.log(error);
      }
    );

    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  renderMarker = (location, idx) => {
    return (
      <Marker key={`marker-${idx}`}
        longitude={location.longitude}
        latitude={location.latitude} >
        <MarkerPin size={30} 
          // onClick={() => }
          color={location.type == "location" ? '#fff' : '#bbb' }
          onClick={() => {
            this.flyToMarker(location);
            this.setState({popupInfo: location});
            console.log(this.state)
          }}
        />
      </Marker>
    );
  }

  flyToMarker = location => {
    console.log(location.name);
    const viewport = {
      latitude: location.latitude - 0.0008,
      longitude: location.longitude,
      zoom: 17,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 500,
      bearing: location.bearing,
    }
    this.setState({
      viewport: {...this.state.viewport, ...viewport}
    })
  }

  renderPopup() {
    const {popupInfo} = this.state;

    return popupInfo && (
      <InfoWindow info={popupInfo} onClose={() => this.setState({popupInfo: null})} />
    );
  }

  render() {
    const {viewport, settings} = this.state;
    return (
      <div>
        <h1 className="title">Городской пруд Екатеринбурга</h1>
        <MapGL
          {...viewport}
          {...settings}
          maxPitch={60}
          mapStyle="mapbox://styles/kix/cjivlc2n44z1k2qs4t5tk3ros"
          onViewportChange={this.onViewportChange}
          onClick={(e) => {
            console.log({"latitude": e.lngLat[1], "longitude": e.lngLat[0]});
          }}
          mapboxApiAccessToken="pk.eyJ1Ijoia2l4IiwiYSI6ImNpbHVua2dzbTAwNTl2bW01bnN5YjkwajEifQ.HCmToCsS2EmAnzxojPIqvw"
        >
          { markers.map(this.renderMarker) }
          { this.renderPopup() }
        </MapGL>
      </div>
    );
  }
}

export default App;
