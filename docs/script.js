const context = new AudioContext();
const limiter = context.createDynamicsCompressor();
var buffer = null;
limiter.connect(context.destination);

const request = new XMLHttpRequest();
request.open('GET', 'res/hee_button.mp3', true);
request.responseType = 'arraybuffer';
request.send();

request.onload = function () {
    let res = request.response;
    context.decodeAudioData(res, function (buf) {
        buffer = buf;
    });

    let btn = document.getElementsByClassName("btn");
    btn[0].addEventListener("mousedown", function () {
        let source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(limiter);
        source.start(0);
    });
};