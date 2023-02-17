function getSubarray(array, fromIndex, toIndex) {
   return array.slice(fromIndex, toIndex+1);
}

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

var raw_data;

d3.csv('Dataset1.csv', function(data) {
   data.forEach(function(d){ 
      for(let i in d){
         d[i] = Number(d[i]);
      }
   })
   raw_data = data;
});

async function updates(){
   // Updating charts every second
   var n = raw_data[0].length;
   console.log("n = " + n);
   while(idx < n){
      for(let i = 0; i < data.length; i++){
         data[i] = (idx*(data[i]) + d3.mean(getSubarray(raw_data[i], idx, idx + 1))*2) / (idx + 2);
         // console.log("data[" + i + "] = " + data[i]);
      }

      // console.log("idx = " + idx);
      idx = idx + 2;
      
      await sleep(delayTime);

      svg.selectAll("rect")
         .data(data)
         .attr("y", function(d) {
            return h - yScale(d);
         })
         .attr("height", function(d) {
            return yScale(d);
         })
      svg.selectAll("text")
         .data(data)
         .text(function(d) {
            return d;
         })
         .attr("x", function(d, i) {
            return xScale(i) + xScale.bandwidth() / 2;
         })
         .attr("y", function(d) {
            return h - yScale(d) + 14;
         });

      console.log("updated");
   }
}

//Width and height
var w = 600;
var h = 250;

var max = d3.max(raw_data, function (d) {
   return d3.max(d);
});

debugger

var xScale = d3.scaleBand()
            .domain(d3.range(raw_data.length))
            .rangeRound([0, w])
            .paddingInner(0.05);

var yScale = d3.scaleLinear()
            .domain([0, maxi])
            .range([0, h]);

//Create SVG element
var svg = d3.select("body")
         .append("svg")
         .attr("width", w)
         .attr("height", h);

/*
   Initial test: start with 2 points per bar and update its size by 2 every second
*/

var idx = 2;
var delayTime = 1000;

var color = ["rgb(0, 163, 108)", "rgb(0, 0, 255)"];

var data = []
for(let i = 0; i < 2; i++)
   data.push(d3.mean(getSubarray(raw_data[i], 0, 1)));


updates();
