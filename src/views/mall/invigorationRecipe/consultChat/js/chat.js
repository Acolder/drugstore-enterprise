// 大视频窗口
var conversationType = 3;
export function videoInit(element, videoBox, callback) {
    // var body = document.getElementsByTagName('body')[0];
    // var element = document.createElement('div');
    // element.setAttribute('id','video-main');
    // body.appendChild(element);
    // element.setAttribute('style','width:100px;height:100px;border:solid 1px #eee');
    // var element = document.getElementById(el);
    console.log(element);
    console.log(videoBox);
    // video box
    // var videoBox = document.getElementById('video-box');
    // var videoBox = document.createElement('div');
    // videoBox.setAttribute('id','video-box');
    // var videoChild = document.createElement('div');
    // videoChild.setAttribute('id','video-child');
    // videoBox.appendChild(videoChild);
    // videoBox.setAttribute('style','width:100px;height:100px;border:solid 1px #eee');
    // body.appendChild(videoBox);
    // console.log(videoChild);
    // var videoBox = document.getElementById(vel);
    var clearChild = function() {
        videoBox.innerHTML = "";
        element.innerHTML = "";
    };

    var setMain = function(node) {
        console.log(node);
        element.appendChild(node);
    };
    var videoItem = {
        added: function(result) {
            var node = result.data;
            // node.onclick = function(){
            //     setMain(node);
            // };
            console.log(node);
            if (result.isLocal) {
                setMain(node);
            }else{
                console.log(node.id);
                var jNode = node.attributes;
                console.log(jNode);
                // var videoNode = jNode.find('video');
                // if (videoNode.length > 0) {
                //     videoNode.attr('style', '');
                // }
                videoBox.appendChild(node);
            }
        },
        removed: function(result) {
            // var videoElId = result.data;
            // $('div').remove('#' + videoElId);
            console.log(result);
            callback && callback(result)
        },
        joined: function(result){
            var userId = result.userId;
            console.warn(userId + '加入通话')
        }
    };
    RongCallLib.setConfig({
        timeout: 60000,
    });
    // 注册视频节点监听
    RongCallLib.videoWatch(function(result) {
        console.log(result);
        videoItem[result.type](result);
    });
    
}
// 注册命令监听
export function commandWatch(callback) {
    RongCallLib.commandWatch(function(command) {
        console.log(command);
        callback && callback(command);
    });
}

var CallType = RongIMLib.VoIPMediaType;

 export function callVideo(tid, inId, callback) {
    // console.log(tid);
    // console.log(inId);
    var mediaType = CallType.MEDIA_VEDIO;
    call(tid, inId, mediaType, callback);
}

function callAudio() {
    var mediaType = CallType.MEDIA_AUDIO;
    call(mediaType);  
}

function call(tid, inId, mediaType, callback){
    // console.log(tid);
    // console.log(inId);
     var params = {
        conversationType: conversationType,
        targetId: tid,
        inviteUserIds: inId,
        mediaType: mediaType,
        // 设置视频分辨率， 默认 720P http://www.rongcloud.cn/docs/web_calllib.html#resolution 
        profile: '720P'
    };
    RongCallLib.call(params, function(error) {
        console.log(params);
        console.log(error);
        if (error.info) {
            // alert(error.info);
        console.log(error);
            callback && callback(error);
        }
    });
}

export function hungup(targetId, callback) {
    // clearChild();
    var params = {
        conversationType: conversationType,
        targetId: targetId,
    };
    RongCallLib.hungup(params, function(error, summary) {
        console.log(error);
        console.log(summary);
        callback && callback(summary);
    });
}
console.log(conversationType);
function acceptAudio() {
    var params = {
        conversationType: conversationType,
        targetId: targetId,
        mediaType: CallType.MEDIA_AUDIO
    };
    RongCallLib.accept(params, (error, res) => {
        console.log(error);
        console.log(res);
    });
}

export function acceptVideo(targetId) {
    var params = {
        conversationType: conversationType,
        targetId: targetId,
        mediaType: CallType.MEDIA_VEDIO,
        // 设置视频分辨率，默认 720P http://www.rongcloud.cn/docs/web_calllib.html#resolution
        profile: '720P'
    };
    RongCallLib.accept(params);
}

// 拒绝通话
export function reject(targetId) {
    var params = {
        conversationType: conversationType,
        targetId: targetId,
    };
    RongCallLib.reject(params);
}

function mute() {
    RongCallLib.mute();
}

function unmute() {
    RongCallLib.unmute();
}

function videoToAudio() {
    RongCallLib.videoToAudio();
}

function audioToVideo() {
    RongCallLib.audioToVideo();
}