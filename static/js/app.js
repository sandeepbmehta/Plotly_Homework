function buildMetadata(sample) {
  // console.log(`buildMetadata ${sample}`);
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url=`/metadata/${sample}`

  d3.json(url).then(function(data) {
    newFunction(data);
    //console.log(data.WFREQ)
    buildGauge(data.WFREQ);
  });

  
  // @TODO: Complete the following function that builds the metadata panel
  function newFunction(data) {
    var metadata = d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
    metadata.text("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      // metadata.append.text([key, value]);
      metadata.append("h6").text(`${key}:  ${value}`);
    });
  }
    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildGauge(wfreq) {
  var level = wfreq;

  var degrees = 180 - level * 18;
  var radius = 0.5;
  var radians = degrees * Math.PI/180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  var mainPath = 'M .0 0.025 L -.0 -0.025 L',
    pathX=String(x),
    space = ' ',
    PathY= String(y),
    pathEnd = 'Z';
  var path = mainPath.concat(pathX, space, PathY, pathEnd);

  var data = [{
    type: "scatter",
    x:[0],
    y:[0],
    marker: {
      size: 28,
      color: "purple"
    },
    showlegend: false,
    name: "speed",
    text: level,
    hoverinfo: "text+name"
  },
  {
    values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4','2-3', '1-2', '0-1'],
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: ['#00aaff','#1ab2ff','#33bbff', '#4dc3ff', '#66ccff','#80d4ff', '#99ddff','#b3e6ff','#cceeff', 'white']
          },
    labels: "text",
    hoverinfo: "text",
    hole: .5,
    type: "pie",
    showlegend: false
  }];
  var layout = {
    shapes: [{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
    title: 'Belly Button Washing Frequency Scrubs per Week',
    xaxis: {zeroline: false, 
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {zeroline: false, 
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  }
  Plotly.newPlot("gauge", data, layout)
};

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url=`/samples/${sample}`
  d3.json(url).then(function(sample_data) {
        
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sample_data.otu_ids, 
      y: sample_data.sample_values,
      mode: "markers",
      marker: {
         color: sample_data.otu_ids,
         size: sample_data.sample_values
      },
      text: sample_data.otu_labels
    };
    
    var layout = {
      title: "Bubble chart",
      xaxis: {title: 'OTU ID'},
      showlegend: false,
    };

    var trace = [trace1]
    Plotly.newPlot("bubble", trace, layout)

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    console.log(sample_data.otu_labels.slice(0, 10))
    tracepie = {
      "values" : sample_data.sample_values.slice(0, 10),
      "labels" : sample_data.otu_ids.slice(0, 10),
      "name" : sample_data.otu_labels.slice(0, 10),
      "hovertext": sample_data.otu_labels.slice(0, 10),
      "type" : "pie"
    };
    layout = {
      // hoverinfo: "name",
      title: "Top 10 details"
    }
    data = [tracepie]
    Plotly.newPlot("pie", data)
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
