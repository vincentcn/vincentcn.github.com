
var generateQuestions = function()
{
    //console.log("I am trying to generating the questions.");
    var i = 0;
    var qid = 0;
    var paddingString = "&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;&sdot;";
    var questionHTML = "";
    for(i=0; i < QUESTIONS_COUNT; i++)
    {
        qid = i + 1;
        questionHTML = questionHTML + '<div class = "question-list" id = "' + qid + 'q">'
        questionHTML = questionHTML + '<span class = "question-id">' + qid + '</span>';
        questionHTML = questionHTML + '<span class = "question-q1">' + QUESTIONS.questions[i].q1 + paddingString + '</span>';
        questionHTML = questionHTML + '<span class = "question-a1"><input type="radio" id="' 
                        + qid +'a1" name = "' + qid +'a" value = "' + QUESTIONS.questions[i].a1 +'"></input></span>';
        //Just to keep the format.
        questionHTML = questionHTML + '<span class = "question-id">&nbsp;</span>';
        questionHTML = questionHTML + '<span class = "question-q2">' + QUESTIONS.questions[i].q2 + paddingString + '</span>';
        questionHTML = questionHTML + '<span class = "question-a2"><input type="radio" id="' 
                        + qid +'a2" name = "' + qid +'a" value = "' + QUESTIONS.questions[i].a2 +'"></input></span>';
        questionHTML += "<p/></div>"
    }
    
    $("#questions").html(questionHTML);
};

var checkAnswers = function()
{
    var unfinishedQuestions = new Array();
    var unfinishedCount = 0;
    var i = 0;
    var qid = 0;
    var selectedValue = null; 
    var warnMessage = "";
    
    for (i = 0; i < QUESTIONS_COUNT; i++)
    {
        qid = i + 1;
        selectedValue = $('input:radio[name="' + qid + 'a"]:checked').val();
        if (selectedValue == null)
        {
            unfinishedQuestions[unfinishedCount++] = qid;
        }
    }
    
    if (unfinishedCount > 0){
        warnMessage = "请先完成下列题目再提交：";
        for(i=0; i < unfinishedCount; i++)
        {
            warnMessage += unfinishedQuestions[i];
            warnMessage += (i != unfinishedCount - 1 ? " ，" : "。" );
        }
        
        alert(warnMessage);
        
        return false;
    }
    
    return true;
    
};

var resetAllQuestions = function()
{
    $('#questions input:radio').prop("checked",false);
    //alert("所有的问题已经重设。");
};

var calculateAndDisplayResults = function()
{
    var results = new Array(CHARACTER_COUNT + 1);
    var qid = 0;
    var selectedValue; 
    var i = 0;
    var j = 0;
    
    //Init the results.
    for(i = 0; i <= CHARACTER_COUNT; i++)
    {
        results[i] = 0;
    }
    //console.log("After init , The results is ", results);
    
    for (i = 0; i < QUESTIONS_COUNT; i++)
    {
        qid = i + 1;
        selectedValue = $('input:radio[name="' + qid + 'a"]:checked').val();
        if (selectedValue != undefined)
        {
            results[selectedValue]++;
        }
    }
    
    //console.log("After calculation, The results is ", results);
    
    //Order the results.
    var orderedResultsIndex = new Array(CHARACTER_COUNT);
    for(i = 0; i < CHARACTER_COUNT; i++)
    {
        orderedResultsIndex[i] = i+1;
    }
    //console.log("After init, The ordered result is ", orderedResultsIndex);
    
    var temp = 0;
    for(i = 0; i < CHARACTER_COUNT - 1; i++)
    {
        for(j = 0; j < CHARACTER_COUNT - i; j++)
        {
            if(results[orderedResultsIndex[j]] < results[orderedResultsIndex[j+1]])
            {
                temp = orderedResultsIndex[j];
                orderedResultsIndex[j] = orderedResultsIndex[j+1];
                orderedResultsIndex[j+1]  = temp;
            }
        }
    }
    
    //console.log("After order, The orderd result is ", orderedResultsIndex);
    
    //Display the results.
    var resultTitle = "<h2>";
    var resultDetail = "<p>测试结果详解：";
    var result_item;
    for (i = 0; i < DISPLAY_RESULT_COUNT; i++)
    {
        result_item = CHARACTERS.characters[orderedResultsIndex[i] - 1];
        resultTitle += result_item.name;
        resultTitle += (i == DISPLAY_RESULT_COUNT -1 ? "" : " ");
        resultDetail =  resultDetail + '<h3>' + result_item.title + '</h3>' + result_item.description + "<br />";
    }
    
    resultTitle += "</h2>";
    resultDetail += "</p>";
    $('#results').html(resultTitle+resultDetail);
    switchToPage(2);
    
    // Google chart implementation. Not stable in China. switch to another one.
    // // Generate the result chart.
    // var chartData = new google.visualization.DataTable();
    // chartData.addColumn('string', 'type');
    // chartData.addColumn('number','score');
    // chartData.addRows(CHARACTER_COUNT);
    // for(i = 0; i < CHARACTER_COUNT; i++)
    // {
        // console.log('name = ', CHARACTERS.characters[i].name);
        // chartData.setCell(i, 0, CHARACTERS.characters[i].name);
        // chartData.setCell(i, 1, results[i+1]);
    // }
    // var chartOptions = {
          // title: '九型人格测试结果',
          // chartArea: {left:20,top:20,width:"800",height:"800"}
        // };

    // var chart = new google.visualization.PieChart(document.getElementById('results-chart'));
    // chart.draw(chartData, chartOptions)
    
    //Generate the chart using jqPlot plugin.
    var chartData = new Array(CHARACTER_COUNT);
    for(i = 0; i < CHARACTER_COUNT; i++)
    {
       //console.log("CHARACTERS.characters[i].name = ", CHARACTERS.characters[i].name);
        chartData[i] = new Array(2);
        chartData[i][0] = CHARACTERS.characters[i].name;
        chartData[i][1] = results[i+1];
    }
    $.jqplot ('results-chart', [chartData], 
        { 
          seriesDefaults: {
            // Make this a pie chart.
            renderer: $.jqplot.PieRenderer, 
            rendererOptions: {
              // Put data labels on the pie slices.
              // By default, labels show the percentage of the slice.
              showDataLabels: true
            }
          }, 
          legend: { show:true, location: 'e' }
        }
    );
    // var chartData = [];
    // for(i = 0; i < CHARACTER_COUNT; i++)
    // {
        // chartData[i] = { label: CHARACTERS.characters[i].name, data: results[i+1] };
    // }
    
    // $.plot($("#results-chart"), chartData, 
    // {
        // series: {
            // pie: { 
                // show: true
            // }
        // }
    // });


    //TODO: post to the server...
};

var switchToPage = function(page_type)
{
    switch(page_type)
    {
        //Question page.
        case 1:
        {
            $('#result-notice').hide();
            $('#results').hide();
            $('#result-buttons').hide();
            $('#results-chart').hide();
            $('#question-notice').show();
            $('#questions').show();
            $('#question-buttons').show();
            break;
        }
        // Result Page.
        case 2:
        {
            $('#question-notice').hide();
            $('#questions').hide();
            $('#question-buttons').hide();
            $('#result-notice').show();
            $('#results').show();
            $('#result-buttons').show();
            $('#results-chart').show();
            break;
        }
        default:
        {
            alert("Unexpected error is found. please refresh the page and try again.");
            break;
        }
    }
}

// Used for testing only
var generateRandomInput = function()
{
    var i = 0;
    var option;
    for(i = 0; i < QUESTIONS_COUNT; i++)
    {
        option = (Math.random() > 0.5 ? 'a1':'a2');
        $('#' + (i+1) + option).prop("checked",true);
    }
}


$(document).ready(function(){
    generateQuestions();
    switchToPage(1);
    //console.log("The page is loading.");
    
    $('#submit-result').click(function(){
        if(checkAnswers())
        {
           calculateAndDisplayResults();
           $('html, body').animate({scrollTop:0}, 'fast');
        } else
        {
            //alert("Please follow the process...");
        }
    });
    
    $('#reset').click(function(){
        resetAllQuestions();
    });
    
    $('#random-input').click(function(){
        generateRandomInput();
    });
    
    $('#restart').click(function(){
        resetAllQuestions();
        switchToPage(1);
        $('html, body').animate({scrollTop:0}, 'fast');
    });
});