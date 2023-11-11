<script>
	import Navbar from './components/Navbar.svelte';
	import Map from './components/Map.svelte';
	import LineChart from './components/lineChart.svelte';
	import ndvi_data from './data/NDVI_bielefeld.json';
	import TreesPerDistrict from './data/TreesPerDistrict.png';
	import Chatbot from './components/Chatbot.svelte';
</script>

<html lang="de">


  
<div class="app">
	<Navbar />
	<Map />
	<br/>
	<p>This website works with the data from Bielefeld’s official 
		<a href="https://open-data.bielefeld.de/dataset/baumbestand-umweltbetrieb">tree registry</a>. That is where all trees in public spaces are listed.
		 It does not contain forests and groups of trees. Because of that, the focus of this analysis is on the single trees.
	<br/>


<div>


</div>
</html>
  
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