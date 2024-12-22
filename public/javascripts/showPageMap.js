mapboxgl.accessToken =
  'pk.eyJ1IjoicGhpbGlwcGRldiIsImEiOiJjbTR5dzR4ancxMW5iMmxwdG1kdmY2dmNjIn0.VgpbbQGls1_orhgst60tzA'
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/navigation-night-v1',
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
})

new mapboxgl.Marker()

  .setLngLat(campground.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`${campground.title}`))
  .addTo(map)

map.addControl(new mapboxgl.NavigationControl())
