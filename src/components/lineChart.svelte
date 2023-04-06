<script>
    import { scaleTime, scaleLinear } from "d3-scale";
    import { line, curveStep } from 'd3';
    import { max, extent } from "d3-array";
    export let data;

    let timestamps = data.map(d => d.time);

    $: width = 400;
    $: height  = 400;
    const margin = {top: 40, right:40, left:40, bottom:40};
    $: innerWidth = width - margin.left - margin.right;
    $: innerHeight = height - margin.top - margin.bottom;
  
    $: xScale = scaleLinear()
    .domain([0, timestamps.length - 1])
    .range([0, innerWidth])
  
    $: yScale = scaleLinear()
    .domain([0, 1])
    .range([innerHeight, 0])

    $: path = line()
        .x((d) => xScale(timestamps.indexOf(d.time)))
        .y((d) => yScale(d.NDVI))
        .curve(curveStep)(data);

    let xTicks = timestamps.filter(t => timestamps.indexOf(t)%15 == 0);

    const radius = 7;
 
  </script>
  
  <!-- binding chart size to screensize of client-->
  <div class="chart-container"
      bind:clientWidth={width}
      >
  
    <svg width={width} height={height}>
      <g transform="translate({margin.left} {margin.top})">
         
        <path 
            d="{path}"
            fill="none"
            stroke="#329b51"
            opacity=0.3
        />
        </g>
      <!--create a group for the circles and transform-translate it to adapt to margin-->
      <g class="cirlces" transform="translate({margin.left} {margin.top})">

      
      {#each data as d}
      <circle cx={xScale(timestamps.indexOf(d.time))}
              cy={yScale(d.NDVI)}
              r=3
              fill = "#329b51"
              />
      {/each}
  
      </g>

      <!--X Axis-->

      <g class='tick' transform="translate({margin.left} {margin.top})">
        {#each xTicks as tick}
        <text
            x={xScale(timestamps.indexOf(tick))}
            y={innerHeight}
            dy=10
            dominant-baseline="hanging"
            text-anchor="middle">
            {tick}</text>
            {#if tick == "Apr 18, 2013"}
                <line x1={xScale(timestamps.indexOf(tick))} x2={xScale(timestamps.indexOf(tick))} y1="0" y2={innerHeight} stroke="#2A2B2A" />
            {:else}
                <line x1={xScale(timestamps.indexOf(tick))} x2={xScale(timestamps.indexOf(tick))} y1={innerHeight-5} y2={innerHeight+5} stroke="#2A2B2A" />
            {/if}
        {/each}
        <text class="axis-title" y={height-3} x={width} text-anchor="end">Date</text>
    </g>

    <!-- >y Axis-->
    <g>
    <g class='tick'  transform="translate({margin.left} {margin.top})">
    {#each [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] as tick}
    <text
        x=0
        y={yScale(tick)}
        dy="-3"
        dx="-25">
        {tick == 1 ? tick + " (NDVI)" : tick}
    </text>
    <line
        x1="0"
        y1={yScale(tick)}
        x2={width}
        y2={yScale(tick)}
        stroke="#329b51"
        opacity=0.3/>

    {/each}
    </g>

    </g>

    </svg>
  
  
  </div>


  
  <style>
    circle {
      transition: r 300ms ease, opacity 300ms ease;
      cursor: pointer;
    }
  
    circle:focus{
      outline: none;
    }
  </style>