DEFAULT_CHOICE_COUNT = 2;
MAX_CHOICE_COUNT = 10;
var generateChoiceInput = function(num){
    var totalNum = DEFAULT_CHOICE_COUNT;
    if (!isNaN(parseInt(num))){
        totalNum = parseInt(num);
    } else {
        alert("请输入合法的数字");
        totalNum = DEFAULT_CHOICE_COUNT;
    }
    if (num < DEFAULT_CHOICE_COUNT){
        alert("最少应输入" + DEFAULT_CHOICE_COUNT + "个选项");
        totalNum = DEFAULT_CHOICE_COUNT;
    }

    if (totalNum > MAX_CHOICE_COUNT){
        alert("最多只支持" + MAX_CHOICE_COUNT + "个选项");
        totalNum = MAX_CHOICE_COUNT;
    }
    var index = 0;
    var choiceInputHtml = "请输入各个选项的内容<br /><ol>";
    for (index = 0; index < totalNum; index++){
         choiceInputHtml = choiceInputHtml + "<li class='choiceItem' id='choice-" 
                        + index + "'><input id='input-" + index + "' type='text'></input></li>";
    }
    choiceInputHtml = choiceInputHtml +  "</ol>";
    $("#choicesInput").html(choiceInputHtml);
}

var checkChoicesInput = function() {
    var choicesCount = $(".choiceItem").length;
    var index = 0;
    for (index = 0; index < choicesCount; index++){
        var inputValue = $("#input-" + index).val();
        if (!inputValue){
            return false;
        }
    }

    return true;
}

var randomGenerateResult = function() {
    var choicesCount = $(".choiceItem").length;
    var choiceIndex = Math.floor(Math.random() * choicesCount);
    var choiceResult = "<p>经过智能计算，最适合的选择是：" + (choiceIndex +　1) + "&nbsp;:&nbsp;" + ($("#input-" + choiceIndex).val())+ "</p>";
    $("#choiceResult").html(choiceResult)
}

$(document).ready(function(){
    generateChoiceInput(DEFAULT_CHOICE_COUNT);
    //console.log("The page is loading.");
    
    $('#countInput').change(function(){
        $("#choiceResult").html("");
        generateChoiceInput($("#countInput").val());
    });
    
    $('#getResultBtn').click(function(){
        if (checkChoicesInput()){
            randomGenerateResult();
        } else {
             $("#choiceResult").html("<p>请输入完整选项</p>");
        }
    });
});