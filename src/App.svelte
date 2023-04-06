<script>
	import Navbar from './components/Navbar.svelte';
	import Map from './components/Map.svelte';
	import LineChart from './components/lineChart.svelte';
	import ndvi_data from './data/NDVI_bielefeld.json';
	import TreesPerDistrict from './data/TreesPerDistrict.png';
</script>
  
<div class="app">
	<Navbar />
	<Map />
	<br/>
	<p>This website works with the data from Bielefeld’s official 
		<a href="https://open-data.bielefeld.de/dataset/baumbestand-umweltbetrieb">tree registry</a>. That is where all trees in public spaces are listed.
		 It does not contain forests and groups of trees. Because of that, the focus of this analysis is on the single trees.
	<br/>
	The following map shows which districts have the most public trees, relatively. It reveals that the districts of Schildesche and Mitte (centre) have the most trees per square kilometre. That might be related to the big recreational area around the lake “Obersee”.
	</p>
	<div>
		<h2>Which district has the most trees per square kilometre?</h2>
		<img src="TreesPerDistrict.jpg" alt="Map showing the density of trees per district"
		width="60%">
		
	</div>
	<p>
		Trees are only one aspect of a green city. There are also parks, forests, gardens and agriculture. The sum of all the vegetation in the city needs to be taken into account. 
		One way of analysing this is the normalized difference vegetation index (NDVI).
		Using satellite imaging data, it measures the difference between near-infrared (which vegetation strongly reflects) and red light (which vegetation absorbs). The result contains information about the condition of the vegetation in a city. 
		The following graph visualizes the development of the average NDVI values of the are of Bielefeld from 2013 to 2023.
		It clearly shows the differences between summer and winter.
	</p>
	<h2>Development of the vegetation in Bielefeld from 2013 to 2023 (NDVI)</h2>
	<LineChart data={ndvi_data}/>
</div>


  
<style>
	.app {
	  text-align: center;
	  align: center;
	  background-color: #F8F4E3;
	  width:90%;
	  height:100%;
	  margin: auto;
	}
</style>