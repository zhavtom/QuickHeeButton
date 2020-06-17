var soundArray = [];

function getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
        values += array[i];
    }

    average = values / length;
    return average;
}

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}
BufferLoader.prototype.loadBuffer = function (url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    var loader = this;
    request.onload = function () {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function (buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length) loader.onload(loader.bufferList);
            },
            function (error) {
                console.error('decodeAudioData error', error);
            }
        );
    }
    request.onerror = function () {
        alert('bufferloader error');
    }
    request.send();
}
BufferLoader.prototype.load = function () {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}
window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();
limiter = context.createDynamicsCompressor();

bufferLoader = new BufferLoader(
    context,
    ['audio/hee_button.wav'
    ],
    finishedLoading
);
bufferLoader.load();
function finishedLoading(bufferList) {
    btn = document.getElementsByClassName("btn");
    for (var i = 0; i < bufferList.length; i++) {
        var source = context.createBufferSource();
        source.buffer = bufferList[i];
        source.connect(context.destination);
        soundArray.push(source);
    }
    for (let i = 0; i < btn.length; i++) {
        btn[i].addEventListener('click', function () {
            soundArray[i].start(0);
            soundArray[i] = context.createBufferSource();
            soundArray[i].buffer = bufferList[i];
            soundArray[i].connect(limiter);
        });
    }
    limiter.connect(context.destination);
}