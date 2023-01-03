
var isGameOver = false;
var isPaused = false;
var isMuted = false;
var count = 0;
var score = 0;
var $score;
var highestScore = 0;
var $highestScore;
var $sound;
var blocks = [];
var historyBlocks = [];
var historyScores = [];


$(function(){
    SetUp();
    countDown();
    pauseOrNot();
    Operation();
});

//倒计时函数
function countDown(){
    setInterval(function(){
        if(isPaused == false){
            count++;
            $("#time").text(count);
        }else{
            $("#time").text("Pause");
        }
    },1000);
}

//初始设置
function SetUp(){
    $score = $("#score");
    $highestScore = $("#highestScore");
    $sound = $("#sound")[0];
    var temps = [];
    temps = $("#main>div");
    for(var i = 0; i < temps.length; i++){
        blocks.push($(temps[i]));
    }
    updateHighestScore();
    randCreat();
}

//游戏操作函数
function Operation(){
    document.onkeydown = function(e){
        if(isPaused == false){
            if(canMoveOrMerge()){
                writeHistory();
                if(e.key == 'w' || e.keyCode == 38){
                    up();
                }else if(e.key == 's' || e.keyCode == 40){
                    down();
                }else if(e.key == 'a' || e.keyCode == 37){
                    left();
                }else if(e.key == 'd' || e.keyCode == 39){
                    right();
                }
            }else{
                gameOver();
            }
        }
    }
}

//游戏暂停函数
function pauseOrNot(){
    document.onmouseleave = function(){
        isPaused = true;
    }
    document.onmouseenter = function(){
        isPaused = false;
    }
}

//游戏结束函数
function gameOver(){
    if(score > highestScore){
        $highestScore.text(score);
        if(window.localStorage){
            localStorage.setItem("highestScore", score);
        }
    }
    if(confirm("Game Over!\n" + "Time: " + count + "   Score: " + score + "\nReady to Restart?")){
        restart();
    }
}

//随机生成新的2或4
function randCreat(){
    var blanks = [];
    for(var i = 0; i < blocks.length; i++){
        if(!blocks[i].text()){
            blanks.push(blocks[i]);
        }
    }
    if(blanks.length == 0){
        return;
    }
    var randNum = (Math.random() > 0.7) ? 4 : 2;
    var randBlank = blanks[Math.floor(Math.random()*blanks.length)];
    randBlank.addClass("c" + randNum);
    randBlank.text(randNum);
    score += randNum;
    $score.html(score);
}

//记录历史操作
function writeHistory(){
    if(historyBlocks.length == 10){
        //删除最早的操作
        historyBlocks.shift();
        historyScores.shift();
    }
    historyBlocks.push($("#main").html());
    historyScores.push(score);
}

//判断能否移动或合并
function canMoveOrMerge(){
    for(var i = 0; i < blocks.length; i++){
        if(!blocks[i].html()){
            return true;
        }
        var upIndex = i-4, downIndex = i+4, leftIndex = i-1, rightIndex = i+1;
        var curValue = blocks[i].html(), upValue = -1, downValue = -1, leftValue = -1, rightValue = -1;
        if(i < 4){
            upIndex = -1;
        }else{
            upValue = blocks[upIndex].html();
        }if(i > 11){
            downIndex = -1;
        }else{
            downValue = blocks[downIndex].html();
        }if(i%4 == 0){
            leftIndex = -1;
        }else{
            leftValue = blocks[leftIndex].html();
        }
        if(i%4 == 3){
            rightIndex = -1;
        }else{
            rightValue = blocks[rightIndex].html();
        }
        if(curValue == upValue || curValue == downValue || curValue == leftValue || curValue == rightValue ){
            return true;
        }
    }
    return false;
}

//某一行/列移动或合并
function moveOrMerge(arr){
    var canMove = false;
    function moveBToA(a,b){
        a.html(b.html());
        a.removeClass();
        a.addClass("c" + b.html());
        b.html("");
        b.removeClass();
    }
    function mergeBToA(a,b){
        a.html(a.html()*2);
        a.removeClass();
        a.addClass("c" + a.html());
        b.html("");
        b.removeClass();
    }
    for(var i = 3; i > 0; i--){ 
        if(arr[i].html()){
            for(var j = i - 1; j >= 0; j--){
                if(!arr[j].html()){
                    canMove = true;
                    for(var k = j; k < 3; k++){
                        moveBToA(arr[k], arr[k+1]);
                    }
                }else{
                    if(arr[j].html() == arr[j+1].html()){
                        i = 4;
                        canMove = true;
                        mergeBToA(arr[j], arr[j+1]);
                    }
                    break;
                }
            }
        }
    }
    return canMove;
}

//上移函数
function up(){
    var canMove = false;
    for(var i = 0; i < 4; i++){
        var column = [];
        for(var j = i; j < blocks.length; j+=4){
            column.push(blocks[j]);
        }
        if(moveOrMerge(column)){
            canMove = true;
        }
    }
    if(canMove){
        playMusic();
        randCreat();
    }
}

//下移函数
function down(){
    var canMove = false;
    for(var i = 12; i < 16; i++){
        var column = [];
        for(var j = i; j >= 0; j-=4){
            column.push(blocks[j]);
        }
        if(moveOrMerge(column)){
            canMove = true;
        }
    }
    if(canMove){
        playMusic();
        randCreat();
    }
}

//左移函数
function left(){
    var canMove = false;
    for(var i = 0; i < 16; i+=4){
        var row = [];
        for(var j = i; j < i+4; j++){
            row.push(blocks[j]);
        }
        if(moveOrMerge(row)){
            canMove = true;
        }
    }
    if(canMove){
        playMusic();
        randCreat();
    }
}

//右移函数
function right(){
    var canMove = false;
    for(var i = 3; i < 16; i+=4){
        var row = [];
        for(var j = i; j > i-4; j--){
            row.push(blocks[j]);
        }
        if(moveOrMerge(row)){
            canMove = true;
        }
    }
    if(canMove){
        playMusic();
        randCreat();
    }
}

//更新最高分显示
function updateHighestScore(){
    if(window.localStorage){
        highestScore = localStorage.getItem("highestScore");
        if(highestScore){
            $highestScore.html(highestScore);
        }else{
            $highestScore.html(0);
        }
    }
}

//播放音乐函数
function playMusic(){
    if(isMuted == false){
        $sound.play();
    }
}

//切换静音函数
function mutedSwitch(){
    if(isMuted == false){
        $('#music').css('background-image', 'url(../imgs/静音.jpg)');
        isMuted = true;
    }else{
        $('#music').css('background-image', 'url(../imgs/音量.png)');
        isMuted = false;
    }
}

//撤回函数
function escape(){
    $("#main").html(historyBlocks.pop());
    $score.html(historyScores.pop());
    var temps = [];
    temps = $("#main>div");
    for(var i = 0; i < temps.length; i++){
        blocks.shift();
        blocks.push($(temps[i]));
    }
}

//重新开始函数
function restart(){
    count = 0;
    score = 0;
    $score.html(score);
    for(var i = 0; i < blocks.length; i++){
        blocks[i].text("");
        blocks[i].removeClass();
    }
    updateHighestScore();
    randCreat();
}

