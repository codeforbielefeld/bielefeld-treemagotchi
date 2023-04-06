This is my final project for the course "Cartography and Visualization" of the Master in "Visual Tools to Empower Citizens". It is an analysis of the data of Bielefeld's tree registry. I have used webmapping, QGIS and satellite imaging. Here I describe my methodology.

# Data

- I have used the data from Bielefeld's [tree registry](https://open-data.bielefeld.de/dataset/baumbestand-umweltbetrieb)
- I also accessed the [administrative borders of the districts](https://open-data.bielefeld.de/dataset/stadtbezirke) that are published on the open data portal of Bielefeld

# Webmapping

I used Maplibre with svelte. You find the code with comments in the components folder in the file "Map.svelte". On the map, there are markers for each tree that is listed in the tree registry. The markers are clustered in order to create a better overview. When zooming in, the bigger circles split into smaller ones. Each tree has a tooltip with information about it. The tooltip shows up when the user hovers over its marker.

In order to prepare the data of the tree registry for the webmap, I have connected the WMS of the tree registry to QGIS and then exported the data as a GeoJSON which was the needed format for Maplibre markers with clusters.

# QGIS

In order to obtain the map that visualizes the number of trees per district, I have first connected the WMS with information about [administrative borders](https://open-data.bielefeld.de/dataset/stadtbezirke). Secondly, I added the GeoJSON file with the data from the tree registry as a layer.
Then, I used vector analysis tools in order to count points in the polyons (the districts). Thirdly, I calculated the trees per square kilometer. For that, I opened the attribute table with data about the districts and their number of trees. Then, I used the field calculator in order to create a new column that contains the number of trees divided by the area of each district.
After having finished the calculations, I changed the styling of the districts-layer. I categorized the districts with regard to their relative number of trees and assigned different colors to different amounts. Finally, I created a layout with the colored districts, a north arrow, a scale and a legend. I exported it as a png without background and imported that one in the App.svelte file in order to present it on the website.

# Satellite imaging (NDVI)

To obtain data about the NDVI index in Bielefeld during the last 10 years, I used Google Earth Engine. The code for that can be found in the folder "GEE_scripts". I exported the result as csv, transformed it to JSON and then imported it in my Svelte project in order to visualize it as a line chart.