
let isMuted = false;
let count = 0;

$(function(){
    StartUp();
    Operation();
})

function Operation(){
    document.onkeydown = function(e){
        if(e.key == 'w' || e.keyCode == 38){
            up();
        }else if(e.key == 's' || e.keyCode == 40){
            down();
        }else if(e.key == 'a' || e.keyCode == 37){
            left();
        }else if(e.key == 'd' || e.keyCode == 39){
            right();
        }
    }
}

function up(){

}

function down(){
    
}

function left(){
    
}

function right(){
    
}

function StartUp(){
    countUp();
}

function mutedSwitch(){
        if(isMuted == false){
            $('#music').css('background-image', 'url(../imgs/静音.jpg)');
            isMuted = true;
        }else{
            $('#music').css('background-image', 'url(../imgs/音量.png)');
            isMuted = false;
        }
    }

function restart(){
    count = 0;
}

function countUp(){
    setInterval(function(){
        count++;
        $('#time').text(count);
    },1000);
}