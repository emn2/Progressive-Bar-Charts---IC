function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

function changePercentage(percentage){
   d3.select('#data_loaded').text("Data loaded: " + percentage.toFixed(2) + "%")
}

function onClickQ1(f, s){
   firstAnswered = true;
   console.log("user answered letter " + f + " for Q1");
   document.getElementById(f).onclick = null;
   document.getElementById(s).onclick = null;

   // if((f == 'q1A' && means[0] > means[2]) || (f == 'q1B' && means[0] < means[2])){ //check if the user answered it correctly
   //    document.getElementById(f).classList.add("correct");
   //    //document.getElementById(f).correct = true;      
   // }
   // else document.getElementById(f).classList.add("wrong"); 

   // document.getElementById(s).classList.add("disabled"); 
}

function onClickQ2(f, s){
   secondAnswered = true;
   console.log("user answered letter " + f + " for Q2");
   document.getElementById(f).onclick = null;
   document.getElementById(s).onclick = null;

   // if((f == 'q2A' && means[1] > means[3]) || (f == 'q2B' && means[1] < means[3])){ //check if the user answered it correctly
   //    document.getElementById(f).classList.add("correct");     
   // }
   // else document.getElementById(f).classList.add("wrong"); 

   // document.getElementById(s).classList.add("disabled"); 
}

var dataset;
var firstAnswered = false, secondAnswered = false;

d3.json('Dataset_normal.json', function(data) {
   dataset = data;
   main();
});

function main(){
   //Width and height
   var w = 800;
   var h = 450;
   var padding = 30;

   //Util variables
   var t = 0;
   var delayTime = 1000;
   var amount_functions = 4;

   var means = [];
   var errors = [];

   for(let i = 0; i < amount_functions; i++){
      means.push(dataset['means'][i][t])
      errors.push(dataset['confidence_intervals'][i][t])
   }

   var maxi = 0;
   for(let i in dataset['means']){
      maxi = Math.max(maxi, d3.max(dataset['means'][i]));
      maxi = Math.max(maxi, d3.max(dataset['confidence_intervals'][i][0]));
      maxi = Math.max(maxi, d3.max(dataset['confidence_intervals'][i][1]));
   }

   var xScale = d3.scaleBand()
               .domain(d3.range(amount_functions))
               .range([padding, w - padding * 2])
               .paddingInner(0.5);

   var yScale = d3.scaleLinear()
               .domain([0, maxi])
               .range([h - padding, padding]);


   var xLabels =  ["A", "B", "C", "D"];
            
   var xAxis = d3.axisBottom()
               .scale(xScale)
               .ticks(4)
               .tickFormat(function(d, i) {return xLabels[i]});

   var yAxis = d3.axisLeft()
               .scale(yScale)
               .ticks(5);

   //Create SVG element
   var svg = d3.select("#bar-graph")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

   var color = ["rgb(153, 51, 153)", "rgb(255, 215, 0)", "rgb(0, 163, 108)", "rgb(0, 0, 255)"];

   //Create bars initially
   svg.selectAll("rect")
      .data(means)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
         return xScale(i);
      })
      .attr("y", function(d) {
         return yScale(d);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
         return h - padding - yScale(d);
      })
      .attr("fill", function(d, i) {
         return color[i];
      });

   //Error bars
   svg.selectAll('line')
      .data(errors)
      .enter()
      .append("line")
      .attr("x1", function(d, i) {
         return xScale(i) + xScale.bandwidth()/2;
      })
      .attr("x2", function(d, i) {
         return xScale(i) + xScale.bandwidth()/2;
      })
      .attr("y1", function(d) {
         return yScale(d[0]);
      })
      .attr("y2", function(d){
         return yScale(d[1]);
      })
      .attr("stroke", "red")
      .attr("class","errorBar");
   
   
   //Create X axis
   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis);
   
   //Create Y axis
   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);

   async function updates(){
      // Updating charts every second
      var n = dataset['means'][0].length;
      while(t < n){
         t++;
   
         for(let i = 0; i < amount_functions; i++){
            means[i] = dataset['means'][i][t];
            errors[i] = dataset['confidence_intervals'][i][t];
         }

         await sleep(delayTime);

         console.log("means = " + means);
         console.log("errors = " + errors);

         //update bars
         svg.selectAll("rect")
            .data(means)
            .attr("y", function(d) {
               return yScale(d);
            })
            .attr("height", function(d) {
               return h - padding - yScale(d);
            })

         //update error
         d3.selectAll('.errorBar')
           .data(errors)
           .attr("y1", function(d) {
               return yScale(d[0]);
           })
           .attr("y2", function(d){
               return yScale(d[1]);
           });


         var percent = 100 * (t / n);
         changePercentage(percent);

         console.log("updated");
         if(firstAnswered && secondAnswered) break;
      }
   }


   updates();
}