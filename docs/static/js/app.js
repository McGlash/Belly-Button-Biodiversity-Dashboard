//create function to initialize dashboard

function init(){
    //read json file into js
    d3.json("data/samples.json").then(sampleFile => {

        console.log(sampleFile)

// Insert option into the dropdown menu of participant ids

        var participantId = sampleFile.names

        var dropdownMenu = document.getElementById("selDataset");
        for(var i = 0; i < participantId.length; i++) {
            var newOption = document.createElement("option");
            var text = document.createTextNode(participantId[i]);
            newOption.appendChild(text);
            dropdownMenu.appendChild(newOption);
        };

//show finding for first participant listed 

    //demographics

        //pull demographic info
        var participantProfiles = Object.values(sampleFile.metadata)

        //add to panel
        var demographicPanel = d3.select(".list-group");

        var participant = participantProfiles[0];

        Object.entries(participant).forEach(([key, value]) => {
            demographicPanel.append("li").attr("class", "list-group-item").text(`${key} : ${value}`);
        });

    //charts

    charts(sampleFile, 0, participantProfiles)
    });
};

//charts function

function charts(file, id, metadata){

        //pull bacteria info

        var bacteriaLabels = file.samples.map(person => person.otu_labels);
        var bacteriaIds = file.samples.map(person => person.otu_ids);
        var bacteriaValues = file.samples.map(person => person.sample_values);

        //setup 

        var labels = bacteriaLabels[id].splice(0,10)
        var ids = bacteriaIds[id].splice(0,10)
        var values = bacteriaValues[id].splice(0,10)
        var washFrequency = metadata[id].wfreq

        //barchart

        var barData = [{
            type : "bar", 
            y : ids, 
            x : values,
            orientation : "h", 
            text : labels,
            marker: {
                color: "#4F7942"}
        }];

        var layoutbar = {title: 'Relative Abundance of Bacteria Species (top 10)',
                     yaxis: {title: 'Operational taxonomic unit (OTU) ID',
                            type: 'category',
                            titlefont: {
                                family: "Arial, sans-serif",
                                size: 18,
                                color: '#a2ac86'
                            }
                    },
                     xaxis : {title : "Number of reads",
                            titlefont: {
                                family: "Arial, sans-serif",
                                size: 18,
                                color: '#a2ac86'
                            }
                            
                    }
        };
        
        Plotly.newPlot('bar', barData, layoutbar);

         //bubble

        var bubbleChart = [{
            x: ids,
            y: values,
            mode: 'markers',
            text : labels,
            marker: {
              color: ids,
              size: values,
              sizeref: 0.05,
              sizemode: 'area'
            }
          }];

        var layoutbar = {title: 'Relative Abundance of Bacteria Species (top 10)',
                    yaxis: {title: 'Number of reads',
                            type: 'category',
                            titlefont: {
                                family: "Arial, sans-serif",
                                size: 18,
                                color: '#a2ac86'
                            },
                            type : "reversed" 
                    },                        
                    xaxis : {title : "OTU ID",
                            titlefont: {
                                family: "Arial, sans-serif",
                                size: 18,
                                color: '#a2ac86'
                            }
                    }
        };
        
        Plotly.newPlot('bubble', bubbleChart, layoutbar);

        //gauge
        var dataGauge = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: washFrequency,
              title: { text: "SpeedBelly Button <br>Washing Frequency<br><br><span style='font-size:15; color:'#a2ac86'>Scrubs per week</span>", 
              font: { size: 18, family: "Arial, sans-serif" }},
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                axis: {range: [null, 9], nticks : 9},
                bar: { color: "white" },
                steps: [
                  { range: [0, 1], color: "#E5E6DA"},
                  { range: [1, 2], color: "#D6D7C3"},
                  { range: [2, 3], color: "#CBCCB0" },
                  { range: [3, 4], color: "#ADB086" },
                  { range: [4, 5], color: "#9BBC7A" },
                  { range: [5, 6], color: "#93C571" },
                  { range: [6, 7], color: "#7AB850" },
                  { range: [7, 8], color: "#61953D" },
                  { range: [8, 9], color: "#548235" }
                ]
              }
            }
          ];
          
          var gaugeLayout = { width: 325, height: 325, margin: { t: 65, r: 0, l: 0, b: 0 }, 
                        };
          Plotly.newPlot("gauge", dataGauge, gaugeLayout);
};

//create function to change graphs based on input

function optionChanged (){

    d3.json("data/samples.json").then(sampleFile => {

       //get the id selected
        var dropdownMenu = d3.select("#selDataset");
        var selected = dropdownMenu.property("value")

       //demographics

        //pull demographic info
        var participantProfiles = Object.values(sampleFile.metadata)

        var participantId = participantProfiles.map(person => person.id)

        //find index of selected participant
        var index = participantId.findIndex(function (element) { 
            return element == selected; 
        }); 

        // //update info panel
        var demographicPanel = d3.select(".list-group");

        d3.selectAll(".list-group-item").remove();

        var participant = participantProfiles[index];

        Object.entries(participant).forEach(([key, value]) => {
              demographicPanel.append("li").attr("class", "list-group-item").text(`${key} : ${value}`);
           });

    //charts

    charts(sampleFile, index, participantProfiles);

    });
};

init();


