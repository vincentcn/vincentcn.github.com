ADD_CHOICE_COUNT = 5;
var generateChoiceInput = function(num){
    var curCount = $(".choiceItem").length;
    var totalNum = curCount + num;
    var choiceInputHtml = "";
    for (var index = curCount; index < totalNum; index++){
         choiceInputHtml = choiceInputHtml + "<li class='choiceItem' id='choice-" 
                        + index + "'><input id='input-" + index + "' type='text'></input></li>";
    }
    $("#choicesInput ol").append(choiceInputHtml);
}

var checkChoicesInput = function() {
    var choicesCount = $(".choiceItem").length;
    for (var i = 0; i < choicesCount; i++){
        if ($("#input-" + i).val()){
            return true;
        }
    }

    return false;
}

var randomGenerateResult = function() {
    var choicesCount = $(".choiceItem").length;
    var validChoiceIndex = [];
    var validChoicesCount = 0;
    var inputValue;
    for(var i = 0; i < choicesCount; i++){
        inputValue = $("#input-" + i).val();
        if (inputValue) {
            validChoiceIndex[validChoicesCount++] = i;
        }
    }
    var choiceIndex = Math.floor(Math.random() * validChoicesCount);
    var realChoiceIndex = validChoiceIndex[choiceIndex];
    var choiceResult = "<p>经过智能计算，最适合的选择是：" + (realChoiceIndex +　1) + "&nbsp;:&nbsp;" + $("#input-" + realChoiceIndex).val() + "</p>";
    $("#choiceResult").html(choiceResult)
}

$(document).ready(function(){
    generateChoiceInput(ADD_CHOICE_COUNT);
    //console.log("The page is loading.");
    
    $("#addMore").click(function(){
        generateChoiceInput(ADD_CHOICE_COUNT);
    });

    $('#getResultBtn').click(function(){
        if (checkChoicesInput()){
            randomGenerateResult();
        } else {
             $("#choiceResult").html("<p>请至少输入一个选项</p>");
        }
    });
});