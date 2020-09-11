$(document).ready(function () {
    $('.video-player').each(function (index, videoPlayer) {

        //Select all the controls
        let videoElement = $(videoPlayer).find('video');
        let elePlayPauseBtn = $(videoPlayer).find('.toggle-play-pause');
        let eleStartTime = $(videoPlayer).find('.start-time');
        let eleEndTime = $(videoPlayer).find('.end-time');
        let eleVideoSeekBar = $(videoPlayer).find('.video-seekBar');
        let eleVideoProgress = $(eleVideoSeekBar).find('.progress');
        let eleToggleVolume = $(videoPlayer).find('.toggle-volume');
        let eleVolumeSeekBar = $(videoPlayer).find('.volume-seekBar');
        let eleVolumeProgress = $(eleVolumeSeekBar).find('.progress');

        //Other variables
        let totalDurationInSeconds = 0;
        let currentTime = 0;
        let currentDuration = null;
        let totalDuration = null;
        let seekPercentage = 0;
        let volumeValue = 1;
        let volumePercentage = 100;

        //Show or hide the controls
        $(videoPlayer).hover(
            () => $(videoPlayer).removeClass('hide-controls'),
            () => {
                if(!videoElement['0'].paused) {
                    $(videoPlayer).addClass('hide-controls');
                }
            }
        );

        //Update
        const updateSeekBar = () => {
            seekPercentage = helper_getPercentage(currentTime, totalDurationInSeconds);

            $(eleVideoProgress).css({width: `${seekPercentage}%`});
        };

        const updateVolumeBar = () => {
          $(eleVolumeProgress).css({ width: `${volumePercentage}%`});
        };

        const updateTotalDuration = () => {
            $(eleEndTime).html(
                `${totalDuration.hours}:${totalDuration.minutes}:${totalDuration.seconds}`
            );
        };

        const updateCurrentTime = () => {
            $(eleStartTime).html(
                `${currentDuration.hours}:${currentDuration.minutes}:${currentDuration.seconds}`
            );
        };

        //Update each function
        videoElement.on('loadeddata', () => {
            totalDurationInSeconds = videoElement['0'].duration;
            totalDuration = helper_calculateDuration(totalDurationInSeconds);
            updateTotalDuration();
            updateSeekBar();
            updateVolumeBar();
        });

        videoElement.on('timeupdate', () => {
            currentTime = videoElement['0'].currentTime;
            currentDuration = helper_calculateDuration(currentTime);
            updateCurrentTime();
            updateSeekBar();
        });

        videoElement.on('volumechange', () => {
            volumePercentage = videoElement['0'].volume * 100;
            updateVolumeBar();
        });

        videoElement.on('ended', () => {
            videoElement['0'].currentTime = 0;
            $(elePlayPauseBtn)
                .removeClass('pause')
                .addClass('play');
            $(videoPlayer).removeClass('hide-controls');
        });

        //User events
        $(elePlayPauseBtn).on('click', () => {
            $(elePlayPauseBtn).hasClass('play') ? videoElement['0'].play() : videoElement['0'].pause();
            $(elePlayPauseBtn).toggleClass('play pause');
        });

        $(eleToggleVolume).on('click', () => {
            videoElement['0'].volume = videoElement['0'].volume ? 0: volumeValue;
            $(eleToggleVolume).toggleClass('on off');
        });

        $(eleVolumeSeekBar).on('click', (e) => {
            let tempPos = e.pageX - videoPlayer.offsetLeft - eleVolumeSeekBar['0'].offsetLeft;
            let tempValue = tempPos / eleVolumeSeekBar['0'].clientWidth;

            volumeValue = tempValue;
            videoElement['0'].volume = tempValue.toFixed(1);
            volumePercentage = tempValue.toFixed(1) * 100;
            $(eleToggleVolume)
                .addClass('on')
                .removeClass('off');
        });

        $(eleVideoSeekBar).on('click', (e) => {
           let tempPos = e.pageX - videoPlayer.offsetLeft - eleVideoSeekBar['0'].offsetLeft;
           let tempValue = tempPos / eleVideoSeekBar['0'].clientWidth;
           videoElement['0'].currentTime = tempValue * totalDurationInSeconds;
        });

    });
});

//Full Screen
document.getElementsByClassName('full-screen')[0].addEventListener('click', function () {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    else {
        document.getElementsByClassName('video-player')[0].requestFullscreen();
    }
});


const helper_getPercentage = (presentTime, totalTime) => {
    let calcPercentage = (presentTime / totalTime) * 100;
    return parseFloat(calcPercentage.toString());
};

const helper_calculateDuration = (duration) => {
    let seconds = parseInt(duration % 60),
        minutes = parseInt((duration % 3600) / 60),
        hours = parseInt(duration / 3600);

    return {
      hours: helper_pad(hours),
      minutes: helper_pad(minutes.toFixed()),
      seconds: helper_pad(seconds.toFixed())
    };
};

const helper_pad = (number) => {
    if(number > -10 && number < 10) {
        return '0' + number;
    }
    else {
        return number;
    }
};