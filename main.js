var means = [];

function getSubarray(array, fromIndex, toIndex) {
   return array.slice(fromIndex, toIndex+1);
}

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}

function changeText(percentage){
   var element = document.getElementById("data_loaded");
   element.innerHTML = "Data loaded: " + percentage.toFixed(2) + "%";
}

function getConfidenceInterval(numElements,m,s,confidence){
   //t_crit = st.norm.ppf(confidence);
   //return [m-s*t_crit/Math.sqrt(numElements), m+s*t_crit/Math.sqrt(numElements)];
   return [m-1, m+1];
}

function getMapValues(map) {
   const result = [];
   for(let i in map){
      result.push(map[i]);
   }
   result.pop();
   return result;
}
//options[i].classList.add("disabled");
function onClickQ1(f, s){
   firstAnswered = true;
   console.log("user answered letter " + f + " for Q1");
   document.getElementById(f).onclick = null;
   document.getElementById(s).onclick = null;

   if((f == 'q1A' && means[0] > means[2]) || (f == 'q1B' && means[0] < means[2])){ //check if the user answered it correctly
      document.getElementById(f).classList.add("correct");
      //document.getElementById(f).correct = true;      
   }
   else document.getElementById(f).classList.add("wrong"); 

   document.getElementById(s).classList.add("disabled"); 
}

function onClickQ2(f, s){
   secondAnswered = true;
   console.log("user answered letter " + f + " for Q2");
   document.getElementById(f).onclick = null;
   document.getElementById(s).onclick = null;

   if((f == 'q2A' && means[1] > means[3]) || (f == 'q2B' && means[1] < means[3])){ //check if the user answered it correctly
      document.getElementById(f).classList.add("correct");     
   }
   else document.getElementById(f).classList.add("wrong"); 

   document.getElementById(s).classList.add("disabled"); 
}

var dataset;
var firstAnswered = false, secondAnswered = false;

d3.csv('Dataset1.csv', function(data) {
   data.forEach(function(d){ 
      for(let i in d){
         d[i] = Number(d[i]);
      }
   })
   dataset = data;

   main();
});

function main(){
   var raw_data = [];
   for(let i in dataset){
      var a = getMapValues(dataset[i]);
      raw_data.push(a);
   }

   raw_data.pop();

   //Width and height
   var w = 600;
   var h = 250;
   var error_w = 10;

   var padding = 30;

   //Util variables
   var idx = 88;
   var delayTime = 1000;
   var amount_functions = 4;

   var data = [];
   var sumSquares = [];
   var errors = [];
   for(let i = 0; i < amount_functions; i++){
      means.push(d3.mean(raw_data[i]));
      sumSquares.push(d3.sum(getSubarray(raw_data[i], 0, idx - 1).map(t=>t*t)));
      data.push(d3.mean(getSubarray(raw_data[i], 0, idx - 1)));
      errors.push(Math.abs(means[i] - data[i]));
   }

   var maxi = d3.max(raw_data, function (d) {
      return d3.max(d);
   });

   var maxi_error = d3.max(errors);

   var xScale = d3.scaleBand()
               .domain(d3.range(amount_functions))
               .range([padding, w - padding * 2])
               .paddingInner(0.5);

   var yScale = d3.scaleLinear()
               .domain([0, maxi])
               .range([padding, h - padding]);

   var eScale = d3.scaleLinear()
               .domain([0, maxi])
               .range([padding, h - padding])

   var xLabels =  ["A", "B", "C", "D"];
            
   var xAxis = d3.axisBottom()
               .scale(xScale)
               .ticks(4)
               .tickFormat(function(d, i) {return xLabels[i]});

   var yAxis = d3.axisLeft()
               .scale(yScale)
               .ticks(5)
               .tickFormat(function(d) {return 50 - d});


   //Create SVG element
   var svg = d3.select(document.getElementById("bar-graph"))
            .append("svg")
            .attr("width", w)
            .attr("height", h);

   var color = ["rgb(153, 51, 153)", "rgb(255, 215, 0)", "rgb(0, 163, 108)", "rgb(0, 0, 255)"];

   //Create bars initially
   svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
         return xScale(i);
      })
      .attr("y", function(d) {
         return h - yScale(d) - padding;
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
         return yScale(d);
      })
      .attr("fill", function(d, i) {
         return color[i];
      });

   //Error bars
   var aux = svg.selectAll('line')
      .data(errors)
      .enter()
      .append("line")
      .attr("x1", function(d, i) {
         return xScale(i) + xScale.bandwidth()/2;
      })
      .attr("x2", function(d, i) {
         return xScale(i) + xScale.bandwidth()/2;
      })
      .attr("y1", function(d, i) {
         return h - yScale(data[i]) - padding + eScale(d);
      })
      .attr("y2", function(d, i){
         return h - yScale(data[i]) - padding - eScale(d);
      })
      .attr("stroke", "red")
      .attr("class","errorBar");
   
   //  debugger
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
      var offset = 84;
      var n = raw_data[0].length;
      while(idx < n){
         var variances = [];
         var intervals = [];
   
         for(let i = 0; i < data.length; i++){
            data[i] = (idx*(data[i]) + d3.mean(getSubarray(raw_data[i], idx, idx + offset - 1))*offset) / (idx + offset);
            sumSquares[i] += d3.sum(getSubarray(raw_data[i], idx, idx + offset - 1).map(t=>t*t));
            var nSoFar = idx + offset;
            variances.push(nSoFar * data[i] * data[i] + sumSquares[i] - 2*data[i]*(data[i]*nSoFar))/(nSoFar-1);
            intervals.push(getConfidenceInterval(nSoFar, data[i],Math.sqrt(variances[i]),0.95));
         }
         // console.log(data);
         idx = idx + offset;
         
         await sleep(delayTime);

         //update bars
         svg.selectAll("rect")
            .data(data)
            .attr("y", function(d) {
               return h - yScale(d) - padding;
            })
            .attr("height", function(d) {
               return yScale(d);
            })

         //update error
         d3.selectAll('.errorBar')
         .data(intervals)
         .attr("y1", function(d, i) {
            return h-yScale(d[0])-padding;
         })
         .attr("y2", function(d, i){
            return h-yScale(d[1])-padding;
         });

         //
         var percent = 100 * (idx / n);
         changeText(percent);

         console.log("updated");
         if(firstAnswered && secondAnswered) break;
      }
   }


   updates();
}