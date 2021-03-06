// require('./landing');
// require('./collection');
// require('./album');
// require('./profile');



var albumPicasso = {
   name: 'The Colors',
   artist: 'Pablo Picasso',
   label: 'Cubism',
   year: '1881',
   albumArtUrl: '/images/album-placeholder.png',
 
   songs: [
       { name: 'Blue', length: 163.38, audioUrl: '/music/placeholders/blue' },
       { name: 'Green', length: 105.66, audioUrl: '/music/placeholders/green'},
       { name: 'Red', length: 270.14, audioUrl: '/music/placeholders/red'},
       { name: 'Pink', length: 154.81, audioUrl: '/music/placeholders/pink'},
       { name: 'Magenta', length: 375.92, audioUrl: '/music/placeholders/magenta'}
     ]
 };

blocJams = angular.module('BlocJams', ['ui.router']);

blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
   $locationProvider.html5Mode(true);
 
 $stateProvider
   .state('landing', {
     url: '/', 
     controller: 'Landing.controller',
     templateUrl: '/templates/landing.html'
   })

	.state('song', {
     url: '/song',
     controller: 'Song.controller',
     
     views:{
   			'': {templateUrl: '/templates/song.html'},
   			'playerBar@song': {templateUrl: '/templates/player_bar.html'}
   		}
   	})

	.state('collection', {
   		url: '/collection',
   		controller: 'Collection.controller',
   		templateUrl: '/templates/collection.html'

   		// views:{
   		// 	'': {templateUrl: '/templates/collection.html'},
   		// 	'playerBar@collection': {templateUrl: '/templates/player_bar.html'}
   		// }

   		
   })

	.state('album', {
   		url: '/album',
   		controller: 'Album.controller',
   		templateUrl: '/templates/album.html'

   		// views:{
   		// 	'': {templateUrl: '/templates/album.html'},
   		// 	'playerBar@album': {templateUrl: '/templates/player_bar.html'}
   		// }
   })
}]);


blocJams.run(function () {
    console.log('Run block ran.', Date.now());
});

blocJams.controller('Landing.controller', ['$scope', function($scope) {

	console.log("Landing.controller", Date.now());
	$scope.subText = "Turn the music up!";

	// $scope.consoleLogger = function(){
	// consoleLogger.log();
	// };	

		$scope.subTextClicked = function() {
			$scope.subText += '!';
		};

			$scope.albumURLs = [
     			'/images/album-placeholders/album-1.jpg',
     			'/images/album-placeholders/album-2.jpg',
     			'/images/album-placeholders/album-3.jpg',
     			'/images/album-placeholders/album-4.jpg',
     			'/images/album-placeholders/album-5.jpg',
     			'/images/album-placeholders/album-6.jpg',
     			'/images/album-placeholders/album-7.jpg',
     			'/images/album-placeholders/album-8.jpg',
     			'/images/album-placeholders/album-9.jpg',
   			];

   		$scope.shuffle = function(o){ //v1.0
    		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    		return o;
			};

}]);

blocJams.controller('Song.controller', ['$scope', function($scope) {
	// alert('Song controller loaded!')
}]);

blocJams.controller('Collection.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
	$scope.albums = [];
		for (var i = 0; i < 33; i++) {
			$scope.albums.push(angular.copy(albumPicasso));
		}

		$scope.playAlbum = function(album) {
			SongPlayer.setSong(album, album.songs[0]);
		}
}]);



blocJams.controller('Album.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger){
	$scope.album = angular.copy(albumPicasso);
	
	ConsoleLogger.log();

		var hoveredSong = null;

		$scope.onHoverSong = function(song) {
			hoveredSong = song;
		};

		$scope.offHoverSong = function(song) {
			hoveredSong = null;
		};

		$scope.getSongState = function(song) {
			if (song === SongPlayer.currentSong && SongPlayer.playing) {
				return 'playing';
			} else if (song === hoveredSong) {
				return 'hovered';
			} else {
				return 'default';
			}
		};

		$scope.playSong = function(song) {
			SongPlayer.setSong($scope.album, song);
			SongPlayer.play();
			
		};

		$scope.pauseSong = function(song) {
			SongPlayer.pause();
		};

}]);

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.songPlayer = SongPlayer;

  $scope.volumeClass = function() {
  	return {
  		// 'fa-volume-off': SongPlayer.volume == 0,
  		'fa-volume-down': SongPlayer.volume <= 70 && SongPlayer.volume > 0,
  		'fa-volume-up': SongPlayer.volume > 70
  	}
  }

  $scope.muteButton = function(volume) {

  	$scope.storedVolume = SongPlayer.volume;
  	console.log($scope.storedVolume);

  	SongPlayer.setVolume(0);
	}

$scope.unMute = function(volume) {
	SongPlayer.setVolume($scope.storedVolume);
}

  SongPlayer.onTimeUpdate(function(event, time) {
  	$scope.$apply(function(){
  	$scope.playTime = time;
  	});
  });


}]);

blocJams.service('SongPlayer', ['$rootScope', function($rootScope) {

	var currentSoundFile = null;

	var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
   };

	return {
		currentSong: null,
		currentAlbum: null,
		playing: false,
		volume: 90,

		play: function () {
			this.playing=true;
			setTimeout(currentSoundFile.play(), 2000);
		},
		pause: function () {
			this.playing= false;
			currentSoundFile.pause();
		},

		next: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex++;
       if (currentTrackIndex >= this.currentAlbum.songs.length) {
         
         currentTrackIndex = 0;
       }


       var song = this.currentAlbum.songs[currentTrackIndex];
       this.setSong(this.currentAlbum, song);

     },

		previous: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex--;
       if (currentTrackIndex < 0) {
         // currentTrackIndex = this.currentAlbum.songs.length - 1;
         currentTrackIndex = 0;
       }
 
       var song = this.currentAlbum.songs[currentTrackIndex];
       this.setSong(this.currentAlbum, song);
     },

     seek : function(time) {
     	if (currentSoundFile) {
     		currentSoundFile.setTime(time);
     	}
     },

     setVolume: function(volume) {
     	if (currentSoundFile) {
     		currentSoundFile.setVolume(volume);
     	}
     	this.volume = volume;
     },

     onTimeUpdate: function(callback) {
     	return $rootScope.$on('sound:timeupdate', callback);
     },

		setSong: function(album, song) {

			  if (currentSoundFile) {
      			currentSoundFile.stop();
    			}
			this.currentAlbum = album;
			this.currentSong = song;

				currentSoundFile = new buzz.sound(song.audioUrl, {
					formats: [ "mp3" ],
					preload: true
				});

			currentSoundFile.setVolume(this.volume);

				currentSoundFile.bind('timeupdate', function(e){
					$rootScope.$broadcast('sound:timeupdate', this.getTime());
				});

				this.play();
		}
	};

}]);

blocJams.directive('slider', ['$document', function($document){


	var calculateSliderPercentFromMouseEvent = function($slider, event) {
		var offsetX = event.pageX - $slider.offset().left;
		var sliderWidth = $slider.width();
		var offsetXPercent = (offsetX / sliderWidth);
		offsetXPercent = Math.max(0, offsetXPercent);
		offsetXPercent = Math.min(1, offsetXPercent);
		return offsetXPercent;
	}

	var numberFromValue = function(value, defaultValue) {
		if (typeof value === 'number') {
			return value;
		}
		if (typeof value === 'undefined') {
			return defaultValue;
		}

		if(typeof value === 'string') {
			return Number(value);
		}
	}

	return {
		templateUrl: '/templates/directives/slider.html',
		replace: true,
		restrict: 'E',
		scope: {
			onChange : '&'
		},
		link: function(scope, element, attributes) {
 			
 			scope.value=0;
 			scope.max=100;

 			console.log(attributes);

     		var $seekBar = $(element);

     		attributes.$observe('value', function(newValue) {
     			scope.value= numberFromValue(newValue, 0);
     		});

     		attributes.$observe('max', function(newValue) {
     			scope.max = numberFromValue(newValue, 100) || 100;
     		});

     		var percentString = function () {
     			var value = scope.value || 0;
     			var max = scope.max || 100;
     			percent = value / max * 100;
     			return percent + '%';
     		}

     		scope.fillStyle = function(){
     			return {width: percentString()};
     		}

     		scope.thumbStyle = function() {
     			return {left: percentString()};
     		}

     		scope.onClickSlider = function(event){
     			var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
     			scope.value = percent * scope.max;
     			notifyCallback(scope.value);
     		}

     		scope.trackThumb = function(){
     			$document.bind('mousemove.thumb', function(event){
     				var percent = calculateSliderPercentFromMouseEvent ($seekBar, event);
     				scope.$apply(function(){
     					scope.value = percent * scope.max;
     					notifyCallback(scope.value);
     				});
     			});

     			$document.bind('mouseup.thumb', function(){
     				$document.unbind('mousemove.thumb');
     				$document.unbind('mouseup.thumb');
     			});
     		};

     		var notifyCallback = function(newValue) {
     			if (typeof scope.onChange === 'function') {
     				scope.onChange({value: newValue});
     			}
     		};

    }
	};

}]);

blocJams.filter('timecode', function(){
		return function(seconds) {
			seconds = Number.parseFloat(seconds);

			if (Number.isNaN(seconds)) {
				return '-:--';
			}

			var wholeSeconds = Math.floor(seconds);

			var minutes = Math.floor(wholeSeconds/60);

			remainingSeconds = wholeSeconds % 60;

			var output = minutes + ':';

			if (remainingSeconds < 10) {
				output += '0';
			}

			output += remainingSeconds;

			return output;
		};
	});

blocJams.directive('clickbutton', function(){
	return {
		templateUrl: '/templates/directives/clickButton.html',
		replace: true,
		restrict: 'E',
		link: function(scope, element, attributes) {

			var $button = $(element);
			
			$button.click(function(){
			alert('Clicked!');
		});
		}
	};
});

blocJams.directive('counthovertime', function(){
	return {
		templateUrl: '/templates/directives/countHoverTime.html',
		replace: true,
		restrict: 'E',
		link: function(scope, element, attributes) {

			var $hoverOver = $(element);

			var enter = null;
			var leave = null;

			$hoverOver.mouseenter(function(){
				var enter = Date.now();
			});

			$hoverOver.mouseleave(function(){
				var leave = Date.now();

				console.log((leave - enter)/1000);

			});

			}

		};
	});

blocJams.directive('classify', function(){
	return {
		templateUrl: '/templates/directives/classify.html',
		replace: true,
		restrict: 'EAC',
		link: function(scope, element, attributes) {


		}
	};
});

blocJams.service('ConsoleLogger', function(){
	return {
		log: function(){
			console.log("Hello World!")
		}
	};
});
