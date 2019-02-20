// Originally taken from view-source:https://web3-dev10.wcms.statcan.ca/chart_app.js on 20.02.2019

// Polyfills
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; 
        padString = String((typeof padString !== 'undefined' ? padString : ' '));
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); 
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

var vlib = new vector_lib.VectorLib();
var Vector = vector_lib.Vector;




var lang = 'en';
var vectorHistory = {}; // TODO: Limit history to 10.
var series = [];
var currSeries = null;
updated = false;

// TODO: Find out what the most accessible colours are
var colors = [
    {
        // WET Blue
        'backgroundColor': 'rgba(51, 80, 117, 0.30)',
        'borderColor': 'rgba(51, 80, 117, 0.60)'	
    },
    {
        // Purple
        'backgroundColor': 'rgba(165, 26, 149, 0.30)',
        'borderColor': 'rgba(165, 26, 149, 0.60)'	
    },
    {
        // Orange
        'backgroundColor': 'rgba(239, 156, 11, 0.30)',
        'borderColor': 'rgba(239, 156, 11, 0.60)'	
    },
    {
        // Green
        'backgroundColor': 'rgba(16, 209, 116, 0.30)',
        'borderColor': 'rgba(16, 209, 116, 0.60)'	
    },
    {
        // Red
        'backgroundColor': 'rgba(239, 10, 10, 0.30)',
        'borderColor': 'rgba(239, 10, 10, 0.60)'	
    },
    {
        // Cyan
        'backgroundColor': 'rgba(50, 248, 255, 0.30)',
        'borderColor': 'rgba(50, 248, 255, 0.60)'	
    },
    {
        // Yellow
        'backgroundColor': 'rgba(248, 255, 49, 0.30)',
        'borderColor': 'rgba(248, 255, 49, 0.60)'	
    }
];

var frequencies = {
    1: {'label': {'en': "Daily", 'fr': "Quotidienne"}},
    2: {'label': {'en': "Weekly", 'fr': "Hebdomadaire"}},
    4: {'label': {'en': "Biweekly", 'fr': "Aux 2 semaines"}},
    6: {'label': {'en': "Monthly", 'fr': "Mensuelle"}},
    7: {'label': {'en': "Bimonthly", 'fr': "Aux 2 mois"}},
    9: {'label': {'en': "Quarterly", 'fr': "Trimestrielle"}},
    11: {'label': {'en': "Semi-annual", 'fr': "Semestrielle"}},
    12: {'label': {'en': "Annual", 'fr': "Annuelle"}},
    13: {'label': {'en': "Every 2 years", 'fr': "Aux 2 ans"}},
    14: {'label': {'en': "Every 3 years", 'fr': "Aux 3 ans"}}
};

$('.control-update').keypress(checkEnter).click(update);

$('#add-series').click(function() { 
    currSeries = null;

    $('#vexp').val(null);
    $('#label-en').val(null);
    $('#label-fr').val(null);
    $('#round-mode').val('none');
    $('#round-decimals').val(null);
    $('#frequency-mode').val('last');
    $('#transformation').val('none');
    $('#edit-series-modal').modal('show');
});

$('#save-series').click(function() {
    $('#edit-series-modal').modal('hide');

    let metadata = {
        'vexp': $('#vexp').val(),
        'label': { 'en': $('#label-en').val(), 'fr': $('#label-fr').val() },
        'roundMode': $('#round-mode').val(),
        'roundDecimals': $('#round-decimals').val(),
        'frequencyMode': $('#frequency-mode').val(),
        'transformation': $('#transformation').val()
    };

    if (currSeries == null) {
        addSeries(metadata);
    }
    else {
        series[currSeries].metadata = metadata;
        let node = $('.series-group').eq(currSeries);
        node.find($('.series-vexp')).text(metadata.vexp);
        node.find($('.series-label')).text(metadata.label[lang]);
    }

    update();
});

function addSeries(metadata) {
    let seriesDiv = $('<div>').addClass('series-group container-fluid');
    
    let infoCol = $('<div>').addClass('col-xs-10');
    let seriesVexp = $('<span>')
            .addClass('series-vexp')
            .text(metadata.vexp);
    let seriesLabel = $('<span>')
            .addClass('series-label')
            .text(metadata.label[lang]);
    let num = $('.series-group').length + 1;
    let label = $('<label>')
            .append(num + ". ")
            .append(seriesVexp)
            .append(" - ").append(seriesLabel);    
    infoCol.append(label)

    let buttonCol = $('<div>').addClass('col-xs-2');
    let edit = $('<span>')
            .addClass('glyphicon glyphicon-pencil btn-glyph')
            .addClass('edit-series')
            .click(editSeries);
    let remove = $('<span>')
            .addClass('glyphicon glyphicon-trash btn-glyph')
            .addClass('remove-series')
            .click(removeSeries);   
    buttonCol.append(edit).append("<br/>").append(remove);

    seriesDiv.append(
            $('<div>').addClass('row').append(infoCol).append(buttonCol));

    series.push({'metadata': metadata, 'vector': undefined})

    $('#series').append(seriesDiv);
}

function editSeries() {
    let parent = $(this).parentsUntil($('.series-group')).parent();
    currSeries = $('.series-group').index(parent);

    let metadata = series[currSeries].metadata;
    $('#vexp').val(metadata.vexp);
    $('#label-en').val(metadata.label.en);
    $('#label-fr').val(metadata.label.fr);
    $('#round-mode').val(metadata.roundMode);
    $('#round-decimals').val(metadata.roundDecimals);
    $('#frequency-mode').val(metadata.frequencyMode);
    $('transformation').val(metadata.transformation);

    $('#edit-series-modal').modal('show');
}

function removeSeries() {
    let parent = $(this).parentsUntil($('.series-group')).parent();
    let i = $('.series-group').index(parent);
    console.log("REMOVE: " + i);
    parent.remove();
    series.splice(i, 1);
    update();
}

function checkEnter(evn) {
    if (evn.which == 13) update();
}

function update() {
    let caller = $(this);
    if ($('.series-group').length == 0) return

    // TODO: Where are we putting the language dropdown for the preview?
    //lang = $('#language-dropdown').val();
    
    let expressions = [];
    for (let i = 0; i < series.length; i++) {
        expressions.push(series[i].metadata.vexp);
    }

    let chart = {
        'metadata': {
            'title': {'en': $('#title-en').val(), 'fr': $('#title-fr').val()},
            'grid': $('#add-grid').prop('checked'),
            'xLabel': $('#x-axis-label').val(),
            'yLabel': $('#y-axis-label').val()
        }, 
        'datasets': []
    };

    let vectorIds = vlib.getVectorIds(expressions.join("-"));
    getVectorData(vectorIds, function(vectorData) {
        let rawVectors = {};
        for (let vectorId in vectorData) {
            rawVectors[vectorId] = vectorData[vectorId].vector;
        }

        let allFreqs = [];
        for (let v in vectorData) {
            allFreqs.push(vectorData[v].metadata.baseFrequency);
        }
        
        for (let i = 0; i < series.length; i++) {
            let metadata = series[i].metadata;
            metadata.baseFrequency = allFreqs[0];
            metadata.frequency = allFreqs[0];

            let vector;
            try {
                vector = vlib.evaluate(metadata.vexp, rawVectors);

                // Transform
                let transform = metadata.transformation;
                let transforms = {
                    'annualize': vector.annualize,
                    'pppc': vector.periodToPeriodPercentageChange,
                    'ppd': vector.periodToPeriodDifference,
                    'apppc': vector.samePeriodPreviousYearPercentageChange,
                    'appd': vector.samePeriodPreviousYearDifference
                };          
                if (transform in transforms) {
                    vector = transforms[transform].apply(vector);
                }

                // Frequency
                let freqTransforms = {
                    6: vector.monthly,
                    12: vector.annual
                };
                let frequency = $('#frequency').val();
                if (frequency != 'none') {
                    metadata.frequency = Number(frequency);

                    vector = freqTransforms[Number(frequency)].apply(
                            vector, [metadata.frequencyMode]);
                }
    
                // Reset last N reference periods control if date range changed.
                if (caller.attr('id') == 'start-date' || caller.attr('id') == 'end-date') {
                    $('#latest-n').val("");
                }

                if ($('#latest-n').val() == "") {
                    vector = vector.range(
                            $('#start-date').val(), $('#end-date').val());
                } 
                else {
                    vector = vector.latestN(Number($('#latest-n').val()));
                    $('#start-date').val(datestring(vector.refper(0)));
                    $('#end-date').val(datestring(vector.refper(vector.length - 1)));
                }

                // Apply rounding.
                if (metadata.roundMode != "none") {
                    let decimals = metadata.roundDecimals;
                    let modes = {
                        'default': vector.round, 
                        'banker': vector.roundBankers
                    };
                    vector = modes[metadata.roundMode].apply(vector, [decimals]);    
                }
            }
            catch (ex){
                alert(ex.message);
            }	

            // Autoset empty titles.
            // TODO: Move logic to modal.
            /*
            let vectorIds = vlib.getVectorIds(expr);
            if (vectorIds.length == 1) {
                let en = $('.label-en').eq(i).val();
                let fr = $('.label-fr').eq(i).val();
                if (caller.hasClass('vector-expression') || en == "") {
                    en = vectorData["v" + vectorIds[0]].metadata.label.en;
                }
                if (caller.hasClass('vector-expression') || fr == "") {
                    fr = vectorData["v" + vectorIds[0]].metadata.label.fr;
                }
                $('.label-en').eq(i).val(en);
                $('.label-fr').eq(i).val(fr);
            }
            */

            series[i].vector = vector;
            chart.datasets.push(series[i]);
        }

        // Get cube ids.
        let cubes = [];
        for (let vectorId in vectorData) {
            cubes.push(vectorData[vectorId].metadata.cube);
        }
        cubes = setlist(cubes);
        cubes.sort();
        chart.metadata.cubes = cubes;

        render(chart)
    });
}

function getVectorData(vectorIds, callback) {
    let cachedIds = vectorIds.filter(function(id) { 
        return "v" + id in vectorHistory;
    });
    let reqIds = vectorIds.filter(function(id) {
        return !("v" + id in vectorHistory);
    });
    let data = {};

    let ret = function() {
        // Add cached vectors.
        for (let v = 0; v < cachedIds.length; v++) {
            let vectorId = cachedIds[v];
            console.log("Using data from last request: v" + vectorId);
            data["v" + vectorId] = vectorHistory["v" + vectorId];
        }

        callback(data);
    };

    if (reqIds.length > 0) {
        console.log(cachedIds);
        updated = false;

        let dataReq = new PostRequest("./api/getVectors", reqIds);
        dataReq.send(function(response) {
            console.log("Get data:");
            console.log(reqIds);

            
            data = getData(response);

            let infoReq = new PostRequest("./api/getVectorInfos", reqIds)
            infoReq.send(function(metaResponse) {
                // Merge metadata.
                getMetadata(data, metaResponse);
                
                // Cache vectors.
                for (let vectorId in data) {
                    vectorHistory[vectorId] = data[vectorId];
                }

                ret();
            });
        });
    } 
    else {
        ret();
    }
}	

function getData(response) {
    let success = response[0]['status'] == "SUCCESS";
    if (!success) {
        alert("Error handling vector response.")
        return;
    }	
    
    let vectors = {};
    
    for (let v = 0; v < response.length; v++) {
        let vectorObj = response[v]['object'];
        let vectorId = vectorObj['vectorId'];
        let datapoints = vectorObj['vectorDataPoint'];
        
        let vector = new Vector();
        let meta = {
            'cube': vectorObj['productId'],
            'status': vectorObj['responseStatusCode']
        };
        for (let p = 0; p < datapoints.length; p++) {
            let datapoint = datapoints[p];
            let refper = stringToDate(datapoint['refPer']);
            
            let freq = datapoint['frequencyCode'];
            meta.frequency = freq;
            meta.baseFrequency = freq;

            let value = Number(datapoint['value']);
            if (datapoint['statusCode'] == 1 || (weekend(refper) && freq == 1)) {
                value = null;
            }

            vector.push({
                'refper': refper,
                'value': value,
                'decimals': datapoint['decimals'],
                'scalarFactor': datapoint['scalarFactorCode']
            }); 
        }

        // Scale vector. 
        vector = vector.periodTransformation(function(val) {
            return scale(val, vector.get(0).scalarFactor);
        });

        let data = {'metadata': meta, 'vector': vector};
        
        vectors['v' + vectorId] = data;
    }
    
    return vectors;
}

function getMetadata(vectors, response) {
    let success = response[0]['status'] == "SUCCESS";
    if (!success) {
        alert("Error handling vector response.")
        return;
    }	

    for (let i = 0; i < response.length; i++) {
        let responseObj = response[i];
        let vectorObj = responseObj.object
        vectors["v" + vectorObj['vectorId']].metadata.label = {
            'en': vectorObj['SeriesTitleEn'],
            'fr': vectorObj['SeriesTitleFr']
        };
    }
}

function render(chart) {
    $('#chart-title').text(chart.metadata.title[lang]);
    renderChart(chart);
    renderTable(chart);
}

function renderChart(chart) {
    let datasets = chart.datasets;

    let labels = [];
    let series = [];

    for (let i = 0; i < datasets.length; i++) {	
        let vector = datasets[i].vector;
        values = [];
        for (let p = 0; p < vector.length; p++) {
            if (i == 0) {
                let displayRefper = frequencyConvert(
                        vector.refper(p), datasets[i].metadata.frequency);
                labels.push(displayRefper[lang]);
            }
            values.push(vector.value(p));
        }
        
        let nextDataset = {
            'label': datasets[i].metadata.label[lang],
            'data': values,
            'fill': false,
            'backgroundColor': colors[i].backgroundColor,
            'borderColor': colors[i].borderColor
        };
        series.push(nextDataset);
    }
    
    datasets = { 
        'labels': labels,
        'datasets': series
    };

    let type = $('#chart-type').val();

    let xStack = type == 'stacked-column' || type == 'stacked-bar';
    let yStack = type == 'stacked-column' || type == 'stacked-bar';

    let options = {
        'responsive': true,
        'animation': { 'duration': !updated ? 0 : 1000 },
        'elements': {
            'line': {
                'tension': 0, // straight lines
            }
        },
        'scales': {
            'yAxes': [
                {
                    'ticks': {
                        'beginAtZero': true,
                        'callback': function(value, index, values) { 
                            return addCommas(value); 
                        }
                    },
                    'stacked': yStack,
                    'gridLines': { 'drawOnChartArea': chart.metadata.grid },
                    'scaleLabel': {
                        'display': true,
                        'labelString': chart.metadata.yLabel,
                        'fontSize': 16
                    }
                }
            ],
            'xAxes': [
                {
                    'stacked': xStack,
                    'gridLines': { 'drawOnChartArea': chart.metadata.grid },
                    'scaleLabel': {
                        'display': true,
                        'labelString': chart.metadata.xLabel,
                        'fontSize': 16
                    }
                }
            ]
        },
        'tooltips': {
            'callbacks': {
                'label': function(tooltipItem, chartData) {
                    let label = chartData.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) label += ': ';
                    return label += addCommas(tooltipItem.yLabel);
                }
            }  
        }
    };

    let typeMap = {
        'column': 'bar',
        'stacked-column': 'bar',
        'bar': 'horizontalBar',
        'stacked-bar': 'horizontalBar'
    };

    let config = {
        'type': typeMap[type] || type,
        'data': datasets, 
        'options': options
    };

    let canvas = $('<canvas>').attr('id', 'chart-canvas');
    $('#chart-container').html(canvas);
    $('#chart-container').append(sources(chart.metadata.cubes));

    var context = document.getElementById('chart-canvas').getContext('2d');                   
    var chart = new Chart(context, config);
}

function renderTable(chart) {
    let datasets = chart.datasets;
    let table = $('<table>').addClass('table');
    
    let head = $('<tr>');
    head.append($('<th>').html('Reference Period'));
    for (let i = 0; i < datasets.length; i++) {
        head.append($('<th>').html(datasets[i].metadata.label[lang]));
    }
    table.append(head);
    
    for (let p = 0; p < datasets[0].vector.length; p++) {
        let row = $('<tr>');
        let displayRefper = frequencyConvert(
                datasets[0].vector.refper(p), datasets[0].metadata.frequency);
        row.append($('<td>').html(displayRefper[lang]));
        
        for (let i = 0; i < datasets.length; i++) {
            row.append($('<td>').html(addCommas(datasets[i].vector.value(p))));
        }
        table.append(row);
    }
    
    $('#table-container').html(table);
}

function sources(cubes) {
    if (cubes.length == 1) {
        return $('<p>').html(
                "<b>Source:</b> Table " + cubeAnchor(cubes[0]).prop('outerHTML'));
    }

    let sourceStr = "<b>Sources:</b> Tables ";
    for (let c = 0; c < cubes.length - 1; c++) {
        sourceStr += cubeAnchor(cubes[c]).prop('outerHTML') + ", ";
    }
    sourceStr += "and " + cubeAnchor(cubes[cubes.length - 1]).prop('outerHTML');
    if (cubes.length == 2) sourceStr = sourceStr.replace(',', '');
    return $('<p>').html(sourceStr);
}

function getScalarFactor(scalarFactorCode) {
    let desc = {
        0: {'en': "units", 'fr': "unités"},
        1: {'en': "tens", 'fr': "dizaines"},
        2: {'en': "hundreds", 'fr': "centaines"},
        3: {'en': "thousands", 'fr': "milliers"},
        4: {'en': "tens of thousands", 'fr': "dizaines de milliers"},
        5: {'en': "hundreds of thousands", 'fr': "centaines de milliers"},
        6: {'en': "millions", 'fr': "millions"},
        7: {'en': "tens of millions", 'fr': "dizaines de millions"},
        8: {'en': "hundreds of millions", 'fr': "centaines de millions"},
        9: {'en': "billions", 'fr': "milliards"}
    };

    return desc[scalarFactorCode][lang];
}

function scale(value, scalarFactorCode) {
    if (value === null) return null;
    let scales = {
        0: function(val) { return val * 1; },
        1: function(val) { return val * 10; },
        2: function(val) { return val * 100; },
        3: function(val) { return val * 1000; },
        4: function(val) { return val * 10000; },
        5: function(val) { return val * 100000; },
        6: function(val) { return val * 1000000; },
        7: function(val) { return val * 10000000; },
        8: function(val) { return val * 100000000; },
        9: function(val) { return val * 1000000000; }
    };
    return scales[scalarFactorCode](value);
}

function unscale(value, scalarFactorCode) {
    let scales = {
        0: function(val) { return val / 1; },
        1: function(val) { return val / 10; },
        2: function(val) { return val / 100; },
        3: function(val) { return val / 1000; },
        4: function(val) { return val / 10000; },
        5: function(val) { return val / 100000; },
        6: function(val) { return val / 1000000; },
        7: function(val) { return val / 10000000; },
        8: function(val) { return val / 100000000; },
        9: function(val) { return val / 1000000000; }
    };
    return scales[scalarFactorCode](value);
}

function cubeAnchor(cube) {
    let urlRoot = "https://www150.statcan.gc.ca/t1/tbl1/" 
            + lang + "/tv.action?pid=";
    return $('<a>')
            .html(formatCube(cube))
            .attr('href', urlRoot + cube + "01")
            .attr('target', "_blank");
}

function formatCube(cube) {
    cube = String(cube);
    return cube.substring(0, 2) + "-" + cube.substring(2, 4) + "-"
            + cube.substring(4) + "-01";
}

function frequencyConvert(date, frequencyCode) {
    let converter = {
        6: dateToShortMonthYear, // Monthly
        7: dateToShortMonthYear, // BiMonthly
        9: dateToShortMonthYear, // Quaterly
        11: dateToShortMonthYear, // SemiAnnually
        12: dateToYear, // Annual
        13: dateToYear // BiAnnual
    };

    if (frequencyCode in converter) {
        return converter[frequencyCode](date);  
    } 
    return {'en': datestring(date), 'fr': datestring(date)};
}

function dateToYear(date) {
    return {
        'en': date.getFullYear().toString(),
        'fr':  date.getFullYear().toString()
    };
}

function dateToShortMonthYear(date) {
    let shortMonths = [
        {'en': "Jan.", 'fr': "janv."},
        {'en': "Feb.", 'fr': "févr."},
        {'en': "Mar.", 'fr': "mars"},
        {'en': "Apr.", 'fr': "avril"},
        {'en': "May", 'fr': "mai"},
        {'en': "June", 'fr': "juin"},
        {'en': "July", 'fr': "juil."},
        {'en': "Aug.", 'fr': "août"},
        {'en': "Sep.", 'fr': "sept."},
        {'en': "Oct.", 'fr': "oct."},
        {'en': "Nov.", 'fr': "nov."},
        {'en': "Dec.", 'fr': "dec."}
    ];

    return {
        'en': shortMonths[date.getMonth()].en + " " + date.getFullYear(),
        'fr': shortMonths[date.getMonth()].fr + " " + date.getFullYear()
    };
}  

function dateToFullMonthYear(date) {
    let months = [
        {'en': "January", 'fr': "janvier"},
        {'en': "February", 'fr': "février "},
        {'en': "March", 'fr': "mars"},
        {'en': "April", 'fr': "avril"},
        {'en': "May", 'fr': "mai"},
        {'en': "June", 'fr': "juin"},
        {'en': "July", 'fr': "juillet"},
        {'en': "August", 'fr': "août"},
        {'en': "September", 'fr': "septembre"},
        {'en': "October", 'fr': "octobre"},
        {'en': "November", 'fr': "novembre"},
        {'en': "December", 'fr': "décembre"}
    ];

    return {
        'en': months[date.getFullMonth() - 1].en + " " + date.getFullYear(),
        'fr': months[date.getFullMonth() - 1].fr + " " + date.getFullYear()
    };
}

function stringToDate(dateStr) {
    let split = dateStr.split('-');
    return new Date(
            Number(split[0]),
            Number(unpad(split[1], "0") - 1), 
            Number(unpad(split[2], "0")));
}

function datestring(date) {
    return date.getFullYear() + "-"
            + (date.getMonth() + 1).toString().padStart(2, "0") + "-"
            + date.getDate().toString().padStart(2, "0");
} 

function formatDateObject(date) {
    if (typeof date === 'string') return stringToDate(date);
    return date;
}

function weekend(date) {
    date = formatDateObject(date);
    let day = date.getDay();
    return day == 0 || day == 6;
}

function unpad(str, chr) {
    let start = 0;
    for (let c = 0; c < str.length; c++) {
        if (str[c] != chr) break;
        start++;
    }
    return str.substring(start);
}  

function titleCase(str) {
    let retStr = '';
    let split = str.split(' ');
    for (let s = 0; s < split.length; s++) {
        for (let c = 0; c < split[s].length; c++) {
            if (c == 0) retStr += split[s][c].toUpperCase();
            else retStr += split[s][c].toLowerCase();
        }
        retStr += ' ';
    }
    return retStr.trim();
}

function addCommas(num) {
    if (num == null) return null;
    let parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function langStr(lang) {
    return {'en': 'english', 'fr': 'french'}[lang];
}

function setlist(array) {
    let set = new Set();
    let list = [];
    for (let i = 0; i < array.length; i++) {
        if (!set.has(array[i])) {
            list.push(array[i]);
            set.add(array[i]);
        }
    }
    return list;
}

function PostRequest(url, data) {
    this.request = new CrossOriginRequest("POST", url);
    let request = this.request;
    this.data = data;
    this.response = undefined;
    let responder = {
        'respond': undefined
    };
    this.responder = responder;


    request.setRequestHeader(
        "Content-Type", "application/json; charset=utf-8");
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            let response = JSON.parse(request.responseText);
            responder.respond(response);
        }
    };

    this.send = function(callback) {
        this.responder.respond = callback;
        this.request.send(JSON.stringify(data));
    };
}

function CrossOriginRequest(method, url) {
    let xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {
        xhr.open(method, url, true);
    }
    else if (typeof XDomainRequest != undefined) {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    }
    else {
        xhr.open(method, url);
    }
    return xhr;
}

function stripVectorIds(vectorIds) {
    for (let i = 0; i < vectorIds.length; i++) {
        vectorIds[i] = stripVectorId(vectorIds[i]);
    }
}

function stripVectorId(vectorId) {
    if (vectorId[0] == 'v' || vectorId[0] == 'V') {
        return vectorId.substring(1);
    }
    return vectorId;
}

function safeMerge(target, source) {
    for (key in source) {
        if (!(key in target)) {
            target[key] = source[key];
        }
    }
    return target;
}
