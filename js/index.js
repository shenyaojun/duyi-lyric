// music download: https://tool.liumingye.cn/music/?page=searchPage#/

/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象：
 * {time:开始时间， words：歌词内容}
 * 
 */
function parseLrc(){
    var lines = lrc.split('\n');
    var result = [];
    for(var i=0; i<lines.length; i++) {
        var str = lines[i];
        var parts = str.split(']');
        // console.log(parts);
        var timeStr = parts[0].substring(1);
        
        // console.log(timeStr);
        var obj = {
            time:parseTime(timeStr),
            words:parts[1],
        };
        result.push(obj);

    }
    return result;
    
}

/**
 * 将一个时间字符串解析为数字（秒）
 * @param {string} timeStr 时间字符串
 * @returns 
 */
function parseTime(timeStr){
    var parts = timeStr.split(':');
    // console.log(parts);
    return (+parts[0]*60 + +parts[1]);

}

var lrcData = parseLrc();

//获取需要的dom
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
}

/**
 * 计算出，在当前播放器播放的进度情况下，
 * lrcData数组中，应该高亮显示的index
 */
function findIndex(){
    var curTime = doms.audio.currentTime;

    for(var i = 0; i<lrcData.length; i++){
        if(curTime < lrcData[i].time){
            return i - 1;
        }
    }
    return lrcData.length - 1;

}

function createLrcElements(){
    for(var i = 0; i <lrcData.length; i++){
        var li = document.createElement('li');
        li.textContent = lrcData[i].words;
        doms.ul.appendChild(li); //改动了dom树

    }
}

createLrcElements();

//容器高度
var containerHeight = doms.container.clientHeight;
var liHeight = doms.ul.children[0].clientHeight;

var maxOffset = doms.ul.clientHeight - containerHeight;

/**
 * 设置ul元素的偏移量
 * 
 */
function setOffset(){
    var index = findIndex();
    var h1 = liHeight * index + liHeight/2;
    var offset = h1 - containerHeight/2;

    if(offset < 0) {
        offset = 0;
    }
    if(offset > maxOffset) {
        offset = maxOffset;
    }
    doms.ul.style.transform = `translateY(-${offset}px)`;

    var li = doms.ul.querySelector('.active');
    if (li){
        li.classList.remove('active');
    }

    li = doms.ul.children[index];
    if(li){
        li.classList.add('active');
    }


}

doms.audio.addEventListener('timeupdate',setOffset);