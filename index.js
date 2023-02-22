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

function getMapValues(map) {
    const result = [];
    for(let i in map){
       result.push(map[i]);
    }
    result.pop();
    return result;
}

function onClickQ1(f, s){
    firstAnswered = true;
    console.log("user answered letter " + f + " for Q1");
    document.getElementById(f).onclick = null;
    document.getElementById(s).onclick = null;

    if((f == 'q1A' && means[0] > means[2]) || (f == 'q1B' && means[0] < means[2])){ //check if the user answered it correctly
        document.getElementById(f).correct = true;      
    }
    else document.getElementById(f).wrong = true;

    document.getElementById(s).disabled = true;
}

function onClickQ2(f, s){
    secondAnswered = true;
    console.log("user answered letter " + f + " for Q2");
    document.getElementById(f).onclick = null;
    document.getElementById(s).onclick = null;

    if((f == 'q2A' && means[1] > means[3]) || (f == 'q2B' && means[1] < means[3])){ //check if the user answered it correctly
        document.getElementById(f).correct = true;      
    }
    else document.getElementById(f).wrong = true;

    document.getElementById(s).disabled = true;
}