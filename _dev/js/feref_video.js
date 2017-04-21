
/* -----------------------------------------------------
Client: Feref
Client's Website: http://www.feref.com
--------------------------------------------------------
Developer: Carl Johnston
Developer's Email: carl@carljohnston.co.uk
Developer's Website: http://www.carljohnston.co.uk
Developer's Github: https://github.com/carljohnstonuk
----------------------------------------------------- */

(function() {

	// hasClass helper
	var hasClass = function(el, cls) {
		return el.classList.contains(cls);
	};

	// Element position helper
	function getPosition(el) {
		var xPos = 0;
		var yPos = 0;
		while (el) {
			if (el.tagName == "BODY") {
				var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
				xPos += (el.offsetLeft - xScroll + el.clientLeft);
			} else {
				xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
			}
			el = el.offsetParent;
		}
		return xPos;
	}

	// <feref-video> element
	var ferefEl = document.getElementsByTagName('feref-video');

	// ferefVideo Object
	var ferefVideo = {

		// Inject HTML for video controls
		renderControls: function() {

			// Create <ul> for controls
			var videoEl = ferefEl[i].querySelector('video');
			var createEl = document.createElement("ul");
			videoEl.parentNode.insertBefore(createEl, videoEl.nextSibling);

			// Inject video controls
			var ul = ferefEl[i].querySelector('ul');
			ul.setAttribute('class', 'controls');
			ul.setAttribute('id', 'controls-' + i);
			ul.innerHTML = 
				'<li class="play-pause paused" id="play-pause-' + i + '">' +
					'<img src="img/feref-video/control_play.svg" />' +
				'</li>' +
				'<li class="progress-click" id="pbar-click-' + i + '">' +
					'<div class="progress-container" id="pbar-container-' + i + '">' +
						'<div class="progress" id="pbar-' + i + '"></div>' +
					'</div>' +
				'</li>' +
				'<li class="expand native" id="fullscreen-' + i + '">' +
					'<img src="img/feref-video/control_fullscreen.svg" />' +
				'</li>' +
				'<li class="mute-unmute" id="mute-unmute-' + i + '">' +
					'<img src="img/feref-video/control_volume_high.svg" />' +
				'</li>'
			;
		},

		poster: function() {
			var attr = ferefEl[i].hasAttribute('poster');
			var videoEl = document.getElementById(ferefEl[i].querySelector('video').getAttribute('id'));
			var posterEl;

			switch(attr) {
				case true:

					// Inject HTML for poster
					function createPoster() {
						var playPauseControl = document.getElementById('play-pause-' + i);
						var poster = ferefEl[i].getAttribute('poster');

						ferefEl[i].insertBefore(document.createElement('div'), ferefEl[i].querySelector('video'));
						ferefEl[i].children[0].setAttribute('id', 'poster-' + i);

						posterEl = document.getElementById('poster-' + i);
						posterEl.className = 'poster';
						posterEl.style.backgroundImage = "url(" + poster + ")";
					};
					createPoster();

					function showPoster() {
						posterEl.style.opacity = 1;
					}

					function hidePoster() {
						posterEl.style.opacity = 0;
					}

					videoEl.addEventListener('ended', showPoster);
					videoEl.addEventListener('pause', showPoster);
					videoEl.addEventListener('playing', hidePoster);
					break;

				case false:
					break;

				default:
					break;
			}
		},

		// Play / Pause functionality
		playPause: function() {
			var pBarUpdate = 30;
			var playPauseControl = document.getElementById('play-pause-' + i);
			var videoEl = document.getElementById(ferefEl[i].querySelector('video').getAttribute('id'));
			var pBarClick = document.getElementById('pbar-click-' + i);
			var pBarContainer = document.getElementById('pbar-container-' + i);
			var pBar = document.getElementById('pbar-' + i);
			var posterEl = document.getElementById('poster-' + i);
			var update;

			// Click to play video helper
			function videoControl(el, control) {
				el.addEventListener('click', function() {
					if (control == 'play') {
						videoEl.play();
					}
					else {
						videoEl.pause();
					}
				});
			}

			// Progress Bar
			function videoProgress() {
				var percentage = (videoEl.currentTime / videoEl.duration) * 100;
				pBar.style.width = percentage + '%';
			}

			// Skip Video
			pBarClick.addEventListener('click', function(ev) {
				var videoPosition = getPosition(videoEl);
				var mouseX = ev.pageX - (videoPosition + pBarClick.offsetLeft);
				var width = window.getComputedStyle(pBarClick).getPropertyValue('width');
				width = parseFloat(width.substr(0, width.length - 2));

				videoEl.currentTime = (mouseX / width) * videoEl.duration;
			});

			// If video is playing
			videoEl.addEventListener('playing', function() {
				playPauseControl.innerHTML = '<img src="img/feref-video/control_pause.svg" />';
				update = setInterval(videoProgress, pBarUpdate);

				videoControl(playPauseControl, 'pause');
				videoControl(posterEl, 'pause');
			});

			// If video is paused
			videoEl.addEventListener('pause', function() {
				playPauseControl.innerHTML = '<img src="img/feref-video/control_play.svg" />';
				clearInterval(update);

				videoControl(playPauseControl, 'play');
				videoControl(posterEl, 'play');
			});

			// If video has ended
			videoEl.addEventListener('ended', function() {
				videoEl.currentTime = 0;
				playPauseControl.innerHTML = '<img src="img/feref-video/control_replay.svg" />';
				clearInterval(update);

				videoControl(playPauseControl, 'play');
				videoControl(posterEl, 'play');
			});
		},

		// Fullscreen functionality
		fullscreen: function() {
			var videoEl = document.getElementById(ferefEl[i].querySelector('video').getAttribute('id'));
			var fullscreenControl = document.getElementById('fullscreen-' + i);
			var controlVideo = document.getElementById('controls-' + i);
			var fullscreenStyle;

			// Global fullscreen functions
			function exitFullscreenListener() {

				function msExitFullscreenVideo() {
					videoEl.removeAttribute('controls');
					exitFullscreenVideo();
				}

				function exitFullscreenVideo() {
					controlVideo.style.zIndex = 999999;
					controlVideo.classList.remove('fullscreen');
					controlVideo.parentElement.removeAttribute('style');
					fullscreenControl.className = "expand native";
					fullscreenControl.innerHTML = '<img src="img/feref-video/control_fullscreen.svg" />';
				}

				document.addEventListener('fullscreenchange', exitFullscreenVideo);
				document.addEventListener('webkitfullscreenchange', exitFullscreenVideo);
				document.addEventListener('mozfullscreenchange', exitFullscreenVideo);
				document.addEventListener('MSFullscreenChange', msExitFullscreenVideo);
			}

			// Request fullscreen
			function fullscreenFunction(el) {

				function enterFullscreenListener() {

					function codeBlock() {
						videoEl.muted = false;
						controlVideo.classList.add('fullscreen');
						controlVideo.style.zIndex = 2147483647;
						fullscreenControl.className = "expand fullscreen";
						fullscreenControl.innerHTML = '<img src="img/feref-video/control_fullscreen_exit.svg" />';
						exitFullscreenListener();
					}

					function msCodeBlock() {
						videoEl.muted = false;
						videoEl.setAttribute('controls');
						codeBlock();
					}

					document.addEventListener('fullscreenchange', codeBlock);
					document.addEventListener('webkitfullscreenchange', codeBlock);
					document.addEventListener('mozfullscreenchange', codeBlock);
					document.addEventListener('MSFullscreenChange', msCodeBlock);
				}

				if ( el.requestFullscreen ) {
					enterFullscreenListener();
					el.requestFullscreen();
				}
				else if ( el.msRequestFullscreen ) {
					enterFullscreenListener();
					el.msRequestFullscreen();
				}
				else if ( el.mozRequestFullScreen ) {
					enterFullscreenListener();
					el.mozRequestFullScreen();
				}
				else if ( el.webkitRequestFullscreen ) {
					enterFullscreenListener();
					el.webkitRequestFullscreen();
				}
			}

			// Exit fullscreen
			function exitFullscreenFunction() {

				if ( document.exitFullscreen ) {
					document.exitFullscreen();
				}
				else if ( document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
				else if ( document.mozCancelFullScreen ) {
					document.mozCancelFullScreen();
				}
				else if ( document.msExitFullscreen ) {
					document.msExitFullscreen();
				}
			}

			// Full screen
			fullscreenControl.innerHTML = '<img src="img/feref-video/control_fullscreen.svg" />';
			fullscreenControl.addEventListener('click', function() {
				var videoEl = document.getElementById(this.parentElement.parentElement.querySelector('video').getAttribute('id'));
				var cls = fullscreenControl.className.split(" ")[1];
				var inheritStyle;

				switch(cls) {
					case 'native':
						fullscreenFunction(videoEl);
						break;

					case 'fullscreen':
						exitFullscreenFunction();
						break;

					default:
						break;
				}

				videoEl.addEventListener('ended', exitFullscreenFunction);
			});
		},

		// Set branding colour
		branding: function() {
			var attr = ferefEl[i].hasAttribute('color');
			var color = ferefEl[i].getAttribute('color');
			var pBar = document.getElementById('pbar-' + i);

			switch(attr) {
				case true:
					pBar.style.background = color;
					break;

				case false:
					pBar.style.background = '#ffffff';
					break;

				default:
					pBar.style.background = '#ffffff';
					break;
			}
		},

		mute: function() {
			var muteUnmuteControl = document.getElementById('mute-unmute-' + i);
			var videoEl = ferefEl[i].querySelector('video');

			muteUnmuteControl.addEventListener('click', function() {
				var thisVideo = this.parentElement.parentElement.querySelector('video');
				var isMuted = thisVideo.muted;
				
				switch(isMuted) {
					case true:
						thisVideo.muted = false;
						break;

					case false:
						thisVideo.muted = true;
						break;
				}
			});

			videoEl.addEventListener('volumechange', function() {
				var thisVideo = this.parentElement.parentElement.querySelector('video');
				var isMuted = thisVideo.muted;
				
				switch(isMuted) {
					case true:
						muteUnmuteControl.innerHTML = '<img src="img/feref-video/control_volume_mute.svg" />';
						break;

					case false:
						muteUnmuteControl.innerHTML = '<img src="img/feref-video/control_volume_high.svg" />';
						break;
				}
			})
		},

		// Autohide controls
		autohide: function() {
			var controls = ferefEl[i].getAttribute('video-controls');
			var controlVideo = document.getElementById('controls-' + i);
			var dataControls = controls;
			switch(dataControls) {
				case 'show':
					controlVideo.className = 'controls show';
					break;

				case 'hide':
					controlVideo.className = 'controls hide';
					break;

				case 'autohide':
					controlVideo.className = 'controls autohide';
					break;

				default:
					controlVideo.className = 'controls show';
					break;
			}
		}
	}

	// Loop through <feref-video> elements to create new instances automatically
	for (var i = 0; i <= ferefEl.length - 1; i++) {
		ferefVideo.renderControls();
		ferefVideo.poster();
		ferefVideo.playPause();
		ferefVideo.fullscreen();
		ferefVideo.branding();
		ferefVideo.mute();
		ferefVideo.autohide();
	}
})();