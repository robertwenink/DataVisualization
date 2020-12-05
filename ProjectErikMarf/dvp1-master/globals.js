// This file contains variables and functions used throughout multiple files.
// Interaction in each component (slider, radar chart and line graph)
// that is reflected in other components is routed via this file.

var sliderTrackWidth =550;

// Variable storing whether the radar chart has rendered once.
var rendered = false;

// Initialize start & end date.
var startDate = new Date(1958, 10);
var endDate = new Date(2018, 10);

// Scaling of the colors.
var beginColor = "#FFA500";
var endColor = "#810081";
var averageColor = secondaryColor;
var colorScale = d3v4.scaleLinear()
    .domain([0, 1])
    .interpolate(d3.interpolateHsl)
    .range([beginColor, endColor]);

// Initializing some colors.
var primaryColor = "#c00022";
var yearColor = colorScale(0.5)

// Changes colour scale based on the min and max of currently selected axis.
function changeColorScaleDomain(xMin, xMax) {
    colorScale.domain([xMin, xMax]);
}

// Refers to the mode (can be weekly or yearly).
var mode = "yearly";

// Changes mode from yearly to weekly and makes appropriate changes.
function changeMode(newMode) {
    mode = newMode;
    primaryColor = (mode === "yearly") ? "#c00022" : "steelblue";
    updateSlider();
    changeCharts();
    setLineGraphRulers();
    return RadarChart();
}

// Functions formatting for neat labelling.
var formatDateIntoYear = d3v4.timeFormat("%Y");
var formatDate = d3v4.timeFormat("%Y");

// Initialize selected axis and years used in both graphs.
var selectedAxis = null;
var dateXaxis = null;
var primaryDate = endDate;
var secondaryDate = startDate;
var primaryYear = null;
var secondaryYear = null;
var secondaryColor = "#CCCCCC";

// Change the axis that is selected.
function changeSelectedAxis(newSelectedAxis) {
    selectedAxis = newSelectedAxis;
    dateXaxis = "Date"
    changeTimeSeries();
    setLineGraph();
    setLineGraphRulers();
}

// Changes the primary selected date. Can be edited via slider.
function changeDates(newPrimaryDate, newSecondaryDate) {
    primaryDate = new Date(year = newPrimaryDate.getFullYear(), month = newPrimaryDate.getMonth(), date = newPrimaryDate.getYear());
    secondaryDate = new Date(year = newSecondaryDate.getFullYear(), month = newSecondaryDate.getMonth(), date = newSecondaryDate.getYear());
    changeYears(newPrimaryDate.getFullYear(), newSecondaryDate.getFullYear());
    setLineGraphRulers();
}

// Changes the selected years. If changed, radar chart rerenders.
function changeYears(newPrimaryYear, newSecondaryYear) {
    // Set secondary year to new secondary year.
    secondaryYear = newSecondaryYear;

    // If primary year is new, change views in radar chart.
    if (!(newPrimaryYear == primaryYear || newPrimaryYear == secondaryYear) || !rendered) {
        rendered = true;
        primaryYear = newPrimaryYear;
        changeCharts();
        return RadarChart();
    }
}

// Initialise date scale, used for line graph and slider.
var dateScale = d3v4.scaleTime()
    .domain([startDate, endDate])
    .range([0, sliderTrackWidth])
    .clamp(true);

// Data vars.
var dataURL = "https://gist.githubusercontent.com/WenxuanHuang/9d94eea5492e7da91797e15566f348ca/raw/9297ea0ec99536ba0f65461c8ac4bba7aebc1e76/Weekly.csv";

var musicURLData = "https://gist.githubusercontent.com/WenxuanHuang/c4dce2e78ce0b970e7abc544ff492aa1/raw/78e4a3c6664e4336980c2ac691ebcb32b2189b96/URL_list.csv"

// Stores names of all axes.
var axesNames = [
    'Danceability',
    'Energy',
    'Explicitness',
    'Loudness',
    'Speechiness',
    'Acousticness',
    'Instrumentalness',
    'Valence',
    'Duration'
]

var featureDescriptions = {
    'Acousticness': "Predicts whether a track is is acoustic. The raw data obtained is a confidence measure from 0.0 to 1.0 of whether the track is acoustic, where 1.0 represents high confidence the track is acoustic. This raw data is averaged out over all the tracks in one (weekly) chart and then normalized to a scale from 0.0 to 1.0 where 0.0 represents the chart with the lowest average acousticness and 1.0 represents the chart with the highest average acousticness.",
    'Danceability': "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 indicates the chart which has on average the least danceable songs and a value of 1.0 is assigned to the chart with the highest average danceability.",
    'Energy': "Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy. The raw data was normalized to a scale from 0.0 to 1.0, where 0.0 indicates the chart with the lowest average energy and 1.0 indicates the chart with the highest average energy.",
    'Instrumentalness': "Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental but rap or spoken word tracks are “vocal”. The closer the instrumentalness value is to 1.0, the greater the likelihood the track contains no vocal content. The data is normalized to a scale from 0.0 to 1.0. Low values indicate the charts with the lowest average likelihood of instrumental songs and high values indicate the charts with the highest average likelihood of instrumental songs. Due to scaling this does not necessarily mean that values above 0.5  represent charts with 50% instrumental songs. ",
    'Loudness': "The raw data was obtained as the average loudness of a track in decibels (dB). These loudness values are averaged across all the songs in one chart and the data is normalized to a scale from 0.0 to 1.0.  Where 0.0 indicates the chart with the lowest average loudness in its songs and 1.0 indicates the chart with the highest average loudness.  Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude).",
    'Speechiness': "Speechiness detects the presence of spoken words in a track. The raw data obtained from Spotify is scaled from 0.0 to 1.0. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. These values have again be normalized  to a scale from 0.0 to 1.0 for our data of the weekly charts. The value 0.0 indicates the chart with the lowest average speechless and the value 1.0 indicates the chart with the highest average speechiness.",
    'Valence': "The valence of a song is a measure describing the musical positiveness conveyed by a track. This data is normalized - again to a scale from 0.0 to 1.0 - with 0.0 being the chart (of all considered charts between 1985 and 2019) with the lowest average valence in all its songs and 1.0 being the chart with the highest average valence. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
    'Duration': "A scale of the duration of a track. Raw data was obtained in milliseconds per track. The data is averaged over all the songs that were in the billboard in one week and then normalized o a scale from 0.0 to 1.0 (0.0 being the chart with the shortest average duration and 1.0 being the chart with the longest average duration) to  better showcase the differences between the charts. ",
    'Explicitness': "A measure of the amount of explicit songs in a chart. The raw data indicated  whether or not a track has explicit lyrics ( true = yes it does; false = no it does not OR unknown). This data is averaged out over all songs in a chart and the value displayed in the chart represents the fraction of songs - within a chart - that are explicit. In this case, 1.0 would indicate a chart for which all songs are explicit and 0.0 would indicate a chart which does not contain any explicit songs."
};

// Load in the chart data once (is used by both graphs).
var chartsData = [];
d3.csv(dataURL, function(data) {
    chartsData = data;
});

var yearlyData = [];
d3.csv("https://gist.githubusercontent.com/WenxuanHuang/9507e6b88a5aa1ac3a1ae17bb9076e70/raw/90aac5944f324ab1fae37c4ff0fc20b5eda45240/Yearly.csvhttps://gist.githubusercontent.com/WenxuanHuang/9507e6b88a5aa1ac3a1ae17bb9076e70/raw/90aac5944f324ab1fae37c4ff0fc20b5eda45240/Yearly.csv", function(data) {
    yearlyData = data;
});

// Placeholder for the data that is currently selected.
var primaryCharts = [];
var secondaryCharts = [];

// Sets the currently selected charts.
function changeCharts() {
    primaryCharts = [];
    secondaryCharts = [];
    data = [];
    if (mode == "weekly") {
        data = chartsData;
    } else {
        data = yearlyData;
    }
    for (var i = 0; i < data.length; i++) {
        row = data[i];
        rowYear = parseInt(row.Year);

        // If the year of the row mathes selected year(s), append to list.
        if (rowYear == primaryYear) {
            primaryCharts.push(
                formattedRow(row)
            );
        }
        if (rowYear == secondaryYear) {
            secondaryCharts.push(
                formattedRow(row)
            );
        }
    }
}

// Placeholder for the time and trendseries that is currently selected.
var timeSeries = []; // For weekly data.
var trendSeries = []; // For yearly data.

// Sets the currently selected charts.
function changeTimeSeries() {

    timeSeries = [];
    trendSeries = [];

    // Load time series for selected variable.
    for (var i = 1; i < chartsData.length; i++) {
        firstRow = chartsData[i - 1];
        firstRowValue = firstRow[selectedAxis];
        firstRowDate = new Date(firstRow.Date);

        secondRow = chartsData[i];
        secondRowValue = secondRow[selectedAxis];
        secondRowDate = new Date(secondRow.Date);

        timeSeries.push([{
                'date': firstRowDate,
                'value': firstRowValue
            },
            {
                'date': secondRowDate,
                'value': secondRowValue
            }
        ])
    }

    // Load trend series for selected variable.
    for (var i = 1; i < yearlyData.length; i++) {
        firstRow = yearlyData[i - 1];
        firstRowValue = firstRow[selectedAxis];
        firstRowDate = new Date(firstRow.Year);

        secondRow = yearlyData[i];
        secondRowValue = secondRow[selectedAxis];
        secondRowDate = new Date(secondRow.Year);

        trendSeries.push([{
                'date': firstRowDate,
                'value': firstRowValue
            },
            {
                'date': secondRowDate,
                'value': secondRowValue
            }
        ])
    }
}

// Returns an axes format as used by the radar chart.
function formattedRow(row) {
    var formatted = [];
    for (var i = 0; i < axesNames.length; i++) {
        name = axesNames[i];
        formatted.push({
            axis: name,
            value: row[name],
            year: row["Year"]
        })
    }
    return formatted;
}