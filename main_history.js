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
 }
 
 function onClickQ2(f, s){
    secondAnswered = true;
    console.log("user answered letter " + f + " for Q2");
    document.getElementById(f).onclick = null;
    document.getElementById(s).onclick = null;
 }
 
 var dataset;
 var firstAnswered = false, secondAnswered = false;
 
 d3.json('Dataset_normal.json', function(data) {
    dataset = data;
    main_history();
 });
 
 function main_history(){
    //Width and height
    var w = 800;
    var h = 450;
    var padding = 30;
 
    //Util variables
    var t = 0;
    var delayTime = 1000;
    var amount_history = 10;
    var amount_functions = 4;
 
    var means = [];
    var errors = [];

    for(let i = 0; i < amount_functions; i++){
        means.push([]);
        errors.push([]);
    }
 
    for(let i = 0; i < amount_functions; i++){
        for(let j = 0; j < amount_history; j++){
            means[i].push(dataset['means'][i][t]);
            errors[i].push(dataset['confidence_intervals'][i][t]);
        }
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
                .paddingInner(0.2);
 
    var yScale = d3.scaleLinear()
                .domain([0, maxi])
                .range([h - padding, padding]);

    var insideScale = d3.scaleBand()
                    .domain(d3.range(amount_history))
                    .range([0, xScale.bandwidth()])
                    .paddingInner(0.05);
 
 
    var xLabels =  ["A", "B", "C", "D"];
             
    var xAxis = d3.axisBottom()
                .scale(xScale)
                .ticks(4)
                .tickFormat(function(d, i) {return xLabels[i]});
 
    var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);
 
    //Create SVG element
    var my_svg = d3.select("#bar-graph")
                .append("svg")
                .attr("width", w)
                .attr("height", h);


    var color = ["rgb(153, 51, 153)", "rgb(255, 215, 0)", "rgb(0, 163, 108)", "rgb(0, 0, 255)"];

    // my_svg.selectAll('.history_bar')
    // .data(d3.range(amount_functions))
    // .enter()
    // .append('g')
    // .attr('class','history_bar')
    // .attr('transform',id=>'translate(' + xScale(id) + ',' + h + ')')
    //             .append('circle')
    //         .attr('x',0)
    //         .attr('y',0)
    //         .attr('r',30);

    // my_svg.selectAll('svg')
    // .data(d3.range(amount_functions))
    // .enter()
    // .append('svg')
    // .attr('x', function(d, i) {return xScale(id)})
    // .attr('y', 0)
    // .attr('width', xScale.bandwidth())
    // .attr('height', h)
    // .attr('id', function(d, i) { return String('child-svg-' + i)});

    debugger

    for(let id = 0; id < amount_functions; id++){  
        var child_name = String('child-svg-' + id);
        my_svg.append("svg")
              .attr("x", xScale(id))
              .attr("y", 0)
              .attr("width", xScale.bandwidth())
              .attr("height", h)
              .attr("id", child_name);
            
        child_name = '#' + child_name;
        
        //Rectangle bars
        my_svg.selectAll(child_name) 
            .data(means[id])
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return xScale(id) + insideScale(i);
            })
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("width", xScale.bandwidth() / amount_history)
            .attr("height", function(d) {
                return h - padding - yScale(d);
            })
            .attr("fill", color[id])
            .attr("class", "rect-svg-" + id);

        //Error bars
        my_svg.selectAll(child_name) 
            .data(errors[id])
            .enter()
            .append("line")
            .attr("x1", function(d, i) {
                return xScale(id) + insideScale(i) + insideScale.bandwidth()/2;
            })
            .attr("x2", function(d, i) {
                return xScale(id) + insideScale(i) + insideScale.bandwidth()/2;
            })
            .attr("y1", function(d) {
                return yScale(d[0]);
            })
            .attr("y2", function(d){
                return yScale(d[1]);
            })
            .attr("stroke", "red")
            .attr("class","error-bar-" + id);
    }
    
    //Create X axis
    my_svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + (h - padding) + ")")
          .call(xAxis);
     
    //Create Y axis
    my_svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + padding + ",0)")
          .call(yAxis);

    debugger
 
    async function updates(){
       // Updating charts every second
       var n = dataset['means'][0].length;
       while(t < n){
          t++;

          for(let i = 0; i < amount_functions; i++){
            means[i].shift();
            means[i].push(dataset['means'][i][t]);

            errors[i].shift();
            errors[i].push(dataset['confidence_intervals'][i][t]);
          }
 
          await sleep(delayTime);
 
        //   console.log("means = " + means);
        //   console.log("errors = " + errors);
        
          //Update bars and errors bars
          for(let i = 0; i < amount_functions; i++){
            var child_rect_name = String('.rect-svg-' + i);
            var child_error_name = String('.error-bar-' + i);

            //Update bars
            d3.selectAll(child_rect_name)
              .data(means[i])
              .attr("y", function(d) {
                return yScale(d);
              })
              .attr("height", function(d) {
                return h - padding - yScale(d);
              });

            //Update errors
            d3.selectAll(child_error_name)
                .data(errors[i])
                .attr("y1", function(d) {
                    return yScale(d[0]);
                })
                .attr("y2", function(d){
                    return yScale(d[1]);
                });
          }
 
          var percent = 100 * (t / n);
          changePercentage(percent);

          console.log("updated");
          if(firstAnswered && secondAnswered) break;
       }
    }
 
    updates();
 }