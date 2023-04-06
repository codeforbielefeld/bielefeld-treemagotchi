<script>
    import { onMount, onDestroy } from 'svelte';
    import { Map, NavigationControl, Popup } from 'maplibre-gl';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import proj4 from 'proj4';
    import geojson from '../data/bielefeld_singletrees.json';
    import 'maplibre-gl/dist/maplibre-gl.css';
    let map;
    let mapContainer;
     
      const apiKey = 'ALLR7G4pDi4tPaPKedPA';
      //coordinates of the center of Bielefeld
      const initialState = { lng: 8.53, lat: 52.02, zoom: 13 };


        onMount(() => {
        // Define the coordinate systems
        proj4.defs('EPSG:25832', '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs');
        proj4.defs('EPSG:4326', '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs');

        // Convert the coordinates to WGS84
        const transformedGeojson = {
          ...geojson,
          features: geojson.features.map(feature => ({
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: proj4('EPSG:25832', 'EPSG:4326', feature.geometry.coordinates)
            }
          }))
        };

        console.log(transformedGeojson);

        const map = new Map({
          container: 'map',
          style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom
        });

        map.addControl(new NavigationControl(), 'top-right');

        map.on('load', () => {
          map.addSource('markers', {
            type: 'geojson',
            data: transformedGeojson,
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points
          });


            // Add a new layer for the clusters
            map.addLayer({
              id: 'clusters',
              type: 'circle',
              source: 'markers',
              filter: ['has', 'point_count'],
              paint: {
                'circle-color': '#329b51',
                'circle-stroke-color' : '#2A2B2A',
                'circle-stroke-width': 1,
                'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  10,
                  10,
                  15,
                  75,
                  20
                ]
              }
            });

            // Add a new layer for the individual markers
            map.addLayer({
              id: 'marker',
              type: 'circle',
              source: 'markers',
              filter: ['!', ['has', 'point_count']],
              paint: {
                'circle-radius': 5,
                'circle-color': '#329b51',
                'circle-stroke-width': 1,
                'circle-stroke-color': '#2A2B2A'
              }
            });

            // Add tooltip logic for the markers
            var tooltip = new Popup({
              closeButton: false,
              closeOnClick: false
            });

            map.on('mouseenter', 'marker', function(e) {
              // Change the cursor style to indicate interactivity
              map.getCanvas().style.cursor = 'pointer';

              // Get the marker properties and coordinates
              var properties = e.features[0].properties;
              var coordinates = e.features[0].geometry.coordinates.slice();

              // Set the tooltip text and position
              tooltip.setLngLat(coordinates)
                .setHTML('<h3>' + properties.baumart_de + '</h3> <p>Crown width (m): ' + properties.kronendurc + '</p><p>Height (m): ' + properties.baumhoehe_)
                .addTo(map);
            });

            map.on('mouseleave', 'marker', () => {
              // Change the cursor style back to default
              map.getCanvas().style.cursor = '';

              // Remove the tooltip
              tooltip.remove();
            });
        });
      });

  </script>
  

  <div class="map-wrap">
    <a href="https://www.maptiler.com" class="watermark"><img
      src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo"/></a>
    <div class="map" id="map" bind:this={mapContainer}></div>
    <div id="tooltip" class="mapboxgl-tooltip"></div>
  </div>
  

  <style>
  
    .map-wrap {
      position: relative;
      width: 100%;
      height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
    }
  
    .map {
      position: relative;
      width: 100%;
      height: 100%;
    }
  
    .watermark {
      position: absolute;
      left: 10px;
      bottom: 10px;
      z-index: 999;
    }

    .mapboxgl-tooltip {
      position: absolute;
      display: none;
      padding: 4px;
      font-size: 14px;
      line-height: 1.4;
      max-width: 300px;
      color:white;
      background-color: green;
      border-radius: 3px;
      pointer-events: none;
      z-index: 9999;
    }

  </style>