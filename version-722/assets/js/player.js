function startMoviePlayer(options) {
    var video = document.getElementById(options.videoId);
    var cover = document.getElementById(options.coverId);
    var button = document.getElementById(options.buttonId);
    var hlsInstance = null;
    var loaded = false;

    if (!video || !cover || !options.stream) {
        return;
    }

    function playVideo() {
        var result = video.play();
        if (result && typeof result.catch === 'function') {
            result.catch(function () {});
        }
    }

    function attachStream() {
        if (loaded) {
            playVideo();
            return;
        }

        loaded = true;
        cover.classList.add('is-hidden');
        video.controls = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = options.stream;
            video.load();
            playVideo();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls();
            hlsInstance.loadSource(options.stream);
            hlsInstance.attachMedia(video);
            if (window.Hls.Events && window.Hls.Events.MANIFEST_PARSED) {
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo();
                });
            } else {
                playVideo();
            }
            return;
        }

        video.src = options.stream;
        video.load();
        playVideo();
    }

    cover.addEventListener('click', attachStream);
    if (button) {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            attachStream();
        });
    }
    video.addEventListener('click', function () {
        if (!loaded) {
            attachStream();
        }
    });
    window.addEventListener('pagehide', function () {
        if (hlsInstance && typeof hlsInstance.destroy === 'function') {
            hlsInstance.destroy();
        }
    });
}
