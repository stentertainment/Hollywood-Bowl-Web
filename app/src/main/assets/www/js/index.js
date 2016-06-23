/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* -------------------- GLOBALS -------------------- */
/* ------------------------------------------------ */
var windowWidth = $(window).width(); //retrieve current window width
var windowHeight = $(window).height(); //retrieve current window height
var documentWidth = $(document).width(); //retrieve current document width
var documentHeight = $(document).height(); //retrieve current document height
var vScrollPosition = $(document).scrollTop(); //retrieve the document scroll ToP position
var hScrollPosition = $(document).scrollLeft(); //retrieve the document scroll Left position
var resultConcert;
var $genreSection = $('#stage-concerts-genres');
var backStack = [];
var currentPage;
var $currentTab;
var $corrTransitTab;
var $lastTab;
var lastPage;
//going to page
var $corrTransitLink;
var mapLayerHeight;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};
/* -------------------- FACEBOOK INTIGRATION -------------------- */
/* -------------------------------------------------- */



window.fbAsyncInit = function() {
    FB.init({
        appId   : 'YOUR_APP_ID',
        oauth   : true,
        status  : true, // check login status
        cookie  : true, // enable cookies to allow the server to access the session
        xfbml   : true // parse XFBML
    });

  };



function fb_login(){
    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            console.log(response); // dump complete info
            // var access_token = FB.getAuthResponse()['accessToken'];
            // console.log(access_token)
            // access_token = response.authResponse.accessToken; //get access token
            // user_id = response.authResponse.userID; //get FB UID
            FB.api('/me/friends', {fields: 'name, picture'}, function(response) {
                for (i=0; i < response.data.length; i++) {
                    var user_name = response.data[i].name;
                    var profile_picture = response.data[i].picture.data.url;
                // you can user_namestore this data into your database 
                    $('#find-friends-section').css('display', 'none')
                    $('#friends-list').css('display', 'block')
                    $('.friendslist-main-container').append('<div class="friend-box"><div class="friendpic"><img src="' + profile_picture + '"></div><div class="friendname-' + i + '">' + user_name + '</div></div>');
                }
                           
            });
        } else {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {
        scope: 'publish_stream,email'
    });
}
function fbLogout() {
        FB.logout(function (response) {
            $('#find-friends-section').css('display', 'block')
            $('#friends-list').css('display', 'none')
            // window.location.reload();
        });
    }
// (function() {
//     var e = document.createElement('script');
//     e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
//     e.async = true;
//     document.getElementById('fb-root').appendChild(e);
// }());

/* -------------------- FUNCTIONS -------------------- */
/* -------------------------------------------------- */
function setWrapper() {
    console.log(windowWidth);
    $(".wrapper").width(windowWidth - 55);
}

function calcBgImg() {
   var imgRatioSmall = .56221;
   var imgRatioLarge = 1.7786;
   var screenRatioSmall = $(window).width() / $(window).height();
   var screenRatioLarge = $(window).height() / $(window).width();
   // console.log(screenRatioSmall)
   // Clear styles first
   $(".main-bg").css("");

   if(screenRatioSmall > imgRatioSmall) {
       $(".mainbg").height("100%").css({"left": "50%", "margin-left": $(".mainbg").width() / 2 * -1});
   } else {
       $(".mainbg").width("100%").css("bottom", "0");
   }
}

function calcMainLogo() {
    var ratio = 285/127;
    var width = windowWidth - 30;
    $(".main-logo").width(width);
    $(".main-logo").css({"margin-left": (width / 2) * -1, "left": "50%"});
}

function calcMainMenuHeight() {
    var ratio = 0.415292;
    var height = ratio * windowHeight;
    $(".main-menu").height(height);
}

function calcConcertDetailWrapperHeight() {
    var concertDetailWrapperHeight = $("#concert-detail-wrapper").outerHeight();
    var concertTitleWrapperHeight = $('.concert-title-wrapper').outerHeight();
    var footerHeight = $('.footer').outerHeight()
    console.log(footerHeight)
    var windowOuterHeight = $(window).outerHeight()
    var detailInfoHeightCalc = windowOuterHeight - (concertTitleWrapperHeight + concertDetailWrapperHeight + footerHeight)
    $('.concert-detail-wrapper').css('height', detailInfoHeightCalc);
}
function concertDetailHeight() {
    $('#concert-detail-image').load(function() {
        calcConcertDetailWrapperHeight();
        console.log('height adjust')
    });
}

function calcGenreListHeight() {
    var footerHeight = $('.footer').outerHeight(true);
    var genreListHeight = $('#genre-list').outerHeight(true);
    var finalHeight = genreListHeight - footerHeight;
    $('#genre-list').height(finalHeight);
}

function mapHeight() {
    var mapTitleHeight = $("#map-wrapper").outerHeight(true);
    console.log("title " + mapTitleHeight)
    var footerHeight = $('#map-footer').outerHeight(true);
    console.log("footer " + footerHeight)
    var mapWindowHeight = windowHeight - (footerHeight + mapTitleHeight)
    $('#map-image-container').css('height', mapWindowHeight)
    console.log("full calc " + mapWindowHeight)
    console.log("window " + windowHeight);
    mapLayerHeight = mapWindowHeight;

    // Hammer.js pinch and zoom function
    var myMap = document.getElementById('map-image-container');
    var mc = new Hammer.Manager(myMap);
    // create a pinch and rotate recognizer
    // these require 2 pointers
    var pinch = new Hammer.Pinch();
    mc.add([pinch]);
    mc.on("pinch rotate", function(ev) {
        myMap.textContent += ev.type +" ";
    });
}
function displayBackButton() {
    if ( $('#stage-mainmenu').hasClass('active-screen') ) {
         $(".back-btn").stop().fadeOut(1000).css('display', 'none');
    }
    if ($('#stage-mainmenu').hasClass('active-screen') === false ) {
        $(".back-btn").stop().delay(200).fadeIn(600).css('display', 'block');
    }
}

// function calcGiveScreen() {
//     var ratio = 0.08545727;
//     var height = ratio * windowHeight;
//     $(".footer").height(height);
//     // console.log('footer ht calc: ' + height);
//     var inWrapper = windowHeight - height;
//     $("#give-inner-wrapper").height( inWrapper );
//     // console.log('inner give wrapper ht: ' + inWrapper);
//     var menuMarginRatio = .073333;
//     var menuWidth = windowWidth - (windowWidth * (menuMarginRatio * 2));
//     $('#give-menu').width(menuWidth);
//     var margLeft = $('#give-menu').width() / 2 ;
//     $("#give-menu").css("margin-left", margLeft * -1);
// }

function calcConcertContent() {
    var top = $('.genre-head-wrapper').outerHeight(true) + ( 0.04786546 * windowHeight ) + 25;
    console.log('top ht: ' + top);
    var footRatio = 0.08545727;
    var footHeight = footRatio * windowHeight;
    console.log('foot ht: ' + footHeight);
    $(".footer").height(footHeight);
}

// function calcFoodScreen(stage) {
//     var ratio = 0.08545727;
//     var footHeight = ratio * windowHeight;
//     $(".footer").height(footHeight);
//     // console.log('footer ht calc: ' + height);
//     var inWrapper = windowHeight - footHeight;
//     $("#food-inner-wrapper").height( inWrapper );
//     var foodTitleHeight = stage.find("#food-wine-title").outerHeight(true);
//     console.log('food title height: ' + foodTitleHeight);
//     var menuWidth = windowWidth - 55;
//     $('#food-menu').width(menuWidth);
//     var margLeft = $('#food-menu').width() / 2 ;
//     $("#food-menu").css("margin-left", margLeft * -1);
// 
// }
function centerFoodMenu() {
   var foodTitleHeight = $('#food-wine-title').innerHeight()
   var foodWineImgHeight = $('.food-img-container').outerHeight(true)
   var footerHeight = $("#food-footer").outerHeight(true);
   var foodMenuHeight = $("#food-menu").outerHeight(true)
   var foodPageCalc = windowHeight - (foodTitleHeight + foodWineImgHeight + footerHeight + foodMenuHeight);
   $('#food-menu').css('margin-top', foodPageCalc / 2)
}
function centerGiveMenu() {
   var giveTitleHeight = $('#give-title').innerHeight()
   var giveImgHeight = $('.give-image-wrapper').outerHeight(true)
   var footerHeight = $(".give-footer").outerHeight(true);
   var giveMenuHeight = $("#give-menu").outerHeight(true)
   var givePageCalc = windowHeight - (giveTitleHeight + giveImgHeight + footerHeight + giveMenuHeight);
   $('#give-menu').css('margin-top', givePageCalc / 2)
   // console.log('foot title' + foodTitleHeight)
   // console.log('food image' + foodWineImgHeight)
   // console.log('footer' + footerHeight)
   // console.log('full calc' + foodPageCalc)
}
function contentContainerHeight() {
    var titleHeight = $('.content-title').outerHeight(true)
    var contentFooter = $('.content-footer').outerHeight(true)
    var contentWrapper = $('.content-full-wrapper').outerHeight(true)
    var fullCalc = windowHeight - (titleHeight + contentWrapper + contentFooter);
    console.log('title' + titleHeight)
    console.log('content footer' + contentFooter)
    console.log(fullCalc)
    $('.content-inner-wrapper').css('height', fullCalc)
    console.log('content height running')
}
// contentContainerHeight()
function calcStageHeights(stage) {
    $('.arrow-up').show();
    $('.arrow-up').hide();
    if(stage.attr('id') == "stage-mainmenu") {
        // Calculate heights of everything
        var topBarHeight = stage.find(".top-bar").outerHeight(true);
        var menuBlockheight = stage.find(".main-menu-block").outerHeight(true);
        var menuWrapperBottom = parseInt(stage.find('.main-menu-wrapper').css("bottom"), 10);
        var setMenuWrapperHeight = $(window).height() - topBarHeight - menuBlockheight - menuWrapperBottom;
        var topArrowPos = topBarHeight + menuBlockheight - stage.find(".arrow-up").height() - 7;

        // Now set heights
        stage.find(".main-menu-wrapper").height(setMenuWrapperHeight);
        stage.find(".arrow-up").css("top", topArrowPos);
    }
    if(stage.attr('id') == "stage-concerts") {
        // Calculate heights of everything
        var headWrapperHeight = stage.find(".head-wrapper").outerHeight(true);
        var footerheight = stage.find(".footer").outerHeight();
        var setConcertTableHeight = $(window).height() - headWrapperHeight - footerheight

        // Now set heights
        stage.find("#concert-table").height(setConcertTableHeight);
    }
    if(stage.attr('id') == "stage-concerts-genres") {
        // Calculate heights of everything
        var headWrapperHeight = stage.find(".genre-head-wrapper").outerHeight(true);
        console.log('genre head wrapper: ' + headWrapperHeight);
        var footerheight = stage.find(".footer").outerHeight();
        console.log('genre footer height: ' + footerheight);
        var setConcertTableHeight = $(window).height() - headWrapperHeight - footerheight - 20;
        console.log('genre set table height: ' + setConcertTableHeight);
        // Now set heights
        stage.find("#genre-list").height(setConcertTableHeight);
    }
    // check for arrow up and arrow down visibility

    // handle scroll on arrow btn taps
    var scrolled = 0;
    $('body').on('singletap, click', '.arrow-down', function() {
    scrolled += 200;
    $(".main-menu-wrapper").animate({
            scrollTop: scrolled
       });

    });
    $('body').on('singletap, click', '.arrow-up', function() {
    scrolled -= 200;
    $(".main-menu-wrapper").animate({
            scrollTop: scrolled
       });

    });
}

function scrollMainMenu() {
    $( ".main-menu-wrapper" ).scroll(function() {
        var x = $(".main-menu-wrapper").height();
        var y = $(".menu").height();
        var lastChildMargin = parseInt($(".give-btn").css("margin-bottom"), 10);
        var xyDiff = y - x + lastChildMargin;
        console.log(lastChildMargin);
        console.log(xyDiff);
        console.log($('.main-menu-wrapper').scrollTop());
        if ($('.main-menu-wrapper').scrollTop() == 0) {
            $('.arrow-up').hide();
            $('.arrow-down').show();
        } else if ( $('.main-menu-wrapper').scrollTop() != 0 && $('.main-menu-wrapper').scrollTop() != xyDiff ) {
            $('.arrow-down').show();
            $('.arrow-up').show();
        } else if ( $('.main-menu-wrapper').scrollTop() == xyDiff ) {
            $('.arrow-down').hide();
            $('.arrow-up').show();
        }
    });
}


/* -------------------- FIND YOUR FRIENDS ------------------ */
/* -------------------------------------------------------- */
function get_location() {
  if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition( UserLocation );

  } else {
    // no native support; maybe try a fallback?
    console.log('are you at the hollywood bowl?');
  }
}

function handle_error(err) {
  if (err.code == 1) {
    // user said no!
    console.log('Can"t find your friends without your permission to use GPS!');
  }
  else if (err.code == 2) {
    // user said no!
    console.log('GPS position is unavailable.');
  }
  else {
    console.log('network timeout. Please try again.')
  }
}

function calculateDistance(lat1, long1, lat2, long2) {
    // Translate to a distance
    var distance =
      Math.sin(lat1 * Math.PI) * Math.sin(lat2 * Math.PI) +
      Math.cos(lat1 * Math.PI) * Math.cos(lat2 * Math.PI) * Math.cos(Math.abs(long1 - long2) * Math.PI);

    // Return the distance in miles
    return Math.acos(distance) * 3958.754;
} // CalculateDistance

function UserLocation( position )
    {
        checkDistance( position.coords.latitude, position.coords.longitude );
    }


    // Convert Degress to Radians
    function Deg2Rad( deg ) {
       return deg * Math.PI / 180;
    }

    function PythagorasEquirectangular( lat1, lon1, lat2, lon2 )
    {
        lat1 = Deg2Rad(lat1);
        lat2 = Deg2Rad(lat2);
        lon1 = Deg2Rad(lon1);
        lon2 = Deg2Rad(lon2);
        var R = 6371; // km
        var x = (lon2-lon1) * Math.cos((lat1+lat2)/2);
        var y = (lat2-lat1);
        var d = Math.sqrt(x*x + y*y) * R;
        console.log('distance from bowl is: ' + d);
        return d;
    }

    function checkDistance( latitude, longitude )
    {
        var bowlLat = 34.1122;
        var bowlLong = -118.3391;
        var minif = 8.04672; //in Km's

        var dif =  PythagorasEquirectangular( latitude, longitude, bowlLat, bowlLong );
           console.log('distance from bowl in checkdistance method is: ' + dif);
        if( dif <= minif ) {
            console.log('you are at the hollywood bowl, here are your friends: ')
        }
        else {
            console.log('you are not at the hollywood bowl.')
        }
    }
    function setLayerMapDimensions() {
        console.log(mapLayerHeight)
        $('.inner-layer-container').css({'height': mapLayerHeight, 'width': windowWidth})

    }

/* -------------------- EVENT LISTENERS -------------------- */
/* -------------------------------------------------------- */
$('#fb-login-btn').on('singletap, click', function() {
    fb_login()
})
$('.log-out').on('singletap, click', function() {
    fbLogout()
})
//on click event for map legend
//open legend
$('.map-menu-legend').on('singletap, click', function() {
    var mapTab = $(this);
    if ( $('.map-menu-map').hasClass('active-maptab') ) {
        $('.map-menu-map').removeClass('active-maptab');
        mapTab.addClass('active-maptab');
        $('#map-directions, #map-icon-container').css('display', 'none')
        mapHeight();
        // $('#map-image-container').slideUp()
        $('#legend-list').transition({'display': 'block', 'margin-top': '0'}, {duration: 300, queue: false});
    }
})
//close legend
$('.map-menu-map').on('singletap, click', function() {
    var mapTab = $(this);
    if ( $('.map-menu-legend').hasClass('active-maptab') ) {
        $('.map-menu-legend').removeClass('active-maptab');
        mapTab.addClass('active-maptab')
        $('#map-directions, #map-icon-container').css('display', 'block')
        mapHeight();
        $('#legend-list').transition({'margin-top': '100%'}, {duration: 300, queue: false, complete: function() {
            $('#legend-list').css('display', 'none')
        }});
    }
})
//icon switch on top of main map screen
$('.main-legend').on('singletap, click', function() {
    var clickedIcon = $(this);
    if ( clickedIcon.hasClass('active-layer') ) {
        var iconLayerData = clickedIcon.data("mainlegend")
        var iconLayer = $('body').find('.legend-layer[data-mainlegend="' + iconLayerData + '"]')
        clickedIcon.removeClass('active-layer');
        iconLayer.css('display', 'none')
        setLayerMapDimensions()
        $(clickedIcon).transition({ scale: 1.0 });
    } else {
        $(clickedIcon).transition({ scale: 1.30 });
        $('#map-full').css('display', 'none');
        $('#map-blank').css('display', 'block');
        setLayerMapDimensions()
        //find data in clicked icon
        var iconLayerData = clickedIcon.data("mainlegend")
            var iconLayer = $('body').find('.legend-layer[data-mainlegend="' + iconLayerData + '"]')
            iconLayer.css('display', 'block')
            clickedIcon.addClass('active-layer')
            console.log(iconLayer)
    }
});
//icon switch for map legend screen
$('.legend-icon').on('singletap, click', function() {
    var clickedIcon = $(this);
    if ( clickedIcon.hasClass('active-layer') ) {
        clickedIcon.removeClass('active-layer')
        clickedIcon.css({'background-color': '#FFF', 'color': 'black'})
        var iconLayerData = clickedIcon.data("legend")
        var iconLayer = $('body').find('.legend-layer[data-legend="' + iconLayerData + '"]')
        iconLayer.css('display', 'none')
        setLayerMapDimensions()
    } else {
        $('#map-full').css('display', 'none');
        $('#map-blank').css('display', 'block');
        clickedIcon.css({'background-color': '#ec008c', 'color': '#FFF'});
        clickedIcon.addClass('active-layer');
        var iconLayerData = clickedIcon.data("legend")
        var iconLayer = $('body').find('.legend-layer[data-legend="' + iconLayerData + '"]')
        iconLayer.css('display', 'block')
        setLayerMapDimensions()
    }
})


//favorites heart click
$('.favorites-button').on('singletap, click', function() {
  console.log('CLICK')
})
//concert tabs open and close
$('body').on('singletap, click', '.tab-btn', function() {
  $this = $(this);
  $currentTab = $this;
  var thisTabTransitLink = $this.data("tabtransit") // CURRENT PAGE
        $corrTransitTab = $('body').find('.tab-link[data-tabtransit="' + thisTabTransitLink + '"]') // GOING TO PAGE
        $lastTab = $('body').find('.active-tab')
        $lastTab.css('display', 'none');
        $lastTab.removeClass('active-tab')
        console.log($lastTab)
        $corrTransitTab.css('display', 'block')
                        .addClass('active-tab');
        calcStageHeights($("#stage-concerts-genres")); // calcHeight Genre Content Method
        // $currentTab = $('.active-screen')
        // $currentTab.removeClass('active-screen')
        // currentPage.css('display', 'none')
})

//ontouch events for food and wine links
$('.culinary-link, .submenu-btn, .subsubmenu-btn, .shop-box, .content-link').on('singletap, click', function(){
    if ( $(this).data("url") !== undefined ) {
        var url = $(this).attr('data-url');
        window.open(url);
    }
});
//ontouch event for main menu accordian
$(".mainmenu-btn, .seriesmenu-btn").on('singletap, click', function() {

   var $this = $(this);
   var $transBtn = $('#transportation')
   if ( $this.hasClass('active') === true ) {
        if ( $transBtn.hasClass('active') ) {
            $transBtn.removeClass('active');
            $transBtn.next(".subsubmenu").stop().slideUp({duration: 200, queue: false}).transition({opacity: 0}, {duration: 300, queue: false});
    }
     $this.removeClass('active');
     $this.next(".submenu").stop().slideUp({duration: 200, queue: false}).transition({opacity: 0}, {duration: 300, queue: false});
   } else {
       if ( $this.next().hasClass('submenu') === true ) {
         $this.addClass("active");
         var submenuSibling = $this.next(".submenu")
         submenuSibling.stop().slideDown({duration: 200, queue: false}).transition({opacity: 1}, {duration: 300, queue: false});
     }
   }
});
//ontouch event for transportation button
$("#transportation").on('singletap, click', function() {
    var $transBtn = $(this);
    if ( $transBtn.hasClass('active') ) {
        $transBtn.removeClass('active');
        $transBtn.next(".subsubmenu").stop().slideUp({duration: 200, queue: false}).transition({opacity: 0}, {duration: 300, queue: false});
    } else {
        $transBtn.addClass("active");
        $transBtn.next(".subsubmenu").stop().slideDown({duration: 200, queue: false}).transition({opacity: 1}, {duration: 300, queue: false});
        }
});

function pageTransitionRight() {
    $corrTransitLink.transition({ x: windowWidth, opacity: 0 });
    currentPage.stop().transition({ x: 0, opacity: 1 });
    currentPage.stop().transition({ x: windowWidth * -1, opacity: 0 }, {duration: 300, complete: function() {
         $(this).css("display", "none");
    }})
    // currentPage.stop().fadeOut(200, function() {
    //     currentPage.stop().css('display', 'none');
    // })
    $corrTransitLink.stop().css("display", "block").transition({x: 0, opacity: 1}, {duration: 300 });
    console.log($corrTransitLink)
         if ( $corrTransitLink.is('#stage-concert-detail') ) {
        concertDetailHeight();
    }
}

//Going back transition
function pageTransitionLeft() {
    currentPage.stop().transition({ opacity: 0, x: windowWidth }, {duration: 300, complete: function() {
         $(this).css("display", "none")
        displayBackButton()
    }})
    lastScreen.stop().css("display", "block").transition({opacity: 1, x: 0 }, {duration: 300, complete: function() {
    }})
}
// //Going forward transitions
// function pageTransitionRight() {
//     currentPage.stop().fadeOut(200, function() {
//         currentPage.stop().css('display', 'none');
//     })
//     $corrTransitLink.delay(200).fadeIn(200, function() {
//         $corrTransitLink.css('display', 'block')
//     })
//     if ( $corrTransitLink.is('#stage-concert-detail') ) {
//         concertDetailHeight();
//     }
// }

// //Going back transition
// function pageTransitionLeft() {
//     currentPage.stop().fadeOut(200, function() {
//         currentPage.css('display', 'none')
//         displayBackButton()
//     })
//     lastScreen.stop().delay(200).fadeIn(200, function() {
//         lastScreen.css('display', 'block');
//     })
// }
    // navigation functionality
    $('.back-btn').on('singletap, click', function(){
        $backBtn = $(this);
          if ( $('concerts-nav-btn').hasClass('active-tab') || $('#stage-concerts-genres').hasClass('active-tab') || $('#stage-concerts-series').hasClass('active-tab') ) {
              var $activeTab = $('body').find('.active-tab');
              $activeTab.css('display', 'none');
              $activeTab.removeClass('active-tab');
              $('#stage-concerts').addClass('active-tab');
        }
        // go back
        currentPage = $('.active-screen');
        console.log(currentPage)
        // currentPage.css('display', 'none');
        lastPage = backStack.length - 1;
        lastScreen = backStack[lastPage]
        //fade out back button if going to main screen
        // backStack[lastPage].css('display', 'block');
        currentPage.removeClass('active-screen');
        backStack[lastPage].addClass('active-screen');
        backStack.pop();
        pageTransitionLeft()
    }) // end back btn singletap event
    $("body").on('singletap, click', '.transit-btn, .concerts-feed-item, .upcoming-show', function() {
        $this = $(this);
        /* ----- Main Animation ----- */
        var thisTransitLink = $this.data("transit") // CURRENT PAGE
        $corrTransitLink = $('body').find('.transit-link[data-transit="' + thisTransitLink + '"]') // GOING TO PAGE
        currentPage = $('.active-screen')
        backStack.push(currentPage);
        currentPage.removeClass('active-screen')
        // currentPage.css('display', 'none')
        $corrTransitLink.addClass('active-screen')
        //check for map screen click to adjust map height
       displayBackButton();
       pageTransitionRight();
       calcStageHeights($corrTransitLink);
        if ( $this.hasClass('content-section') ) {
                contentContainerHeight()
        }
        if ( $('#stage-concerts-genres').hasClass('active-tab') || $('#stage-concerts-series').hasClass('active-tab') ) {
              var $activeTab = $('body').find('.active-tab')
              $activeTab.css('display', 'none')
        }
        //check for concert detail screen click to display concert detail
        if ( $this.hasClass('concerts-feed-item') ) {
            setTimeout(function(){ flag = false; }, 100);
                var detailScreenSelection = $(this).attr('id');
                var detailSelectionNum = detailScreenSelection.substring(8);
                // $('#stage-concert-detail').css("display", 'block'); // TO-DO: need to update 0 to for each detail screen.
                // $('#stage-concerts').css("display", 'none');
                $("#concerts-full-wrapper").height = windowHeight;
                var detailTitle = resultConcert["season"][detailSelectionNum].program;
                $('#concerts-detail-title').text(detailTitle);
                var detailTitle = resultConcert["season"][detailSelectionNum].program;
                $('#concerts-detail-title').text(detailTitle);
                var imgSrc = resultConcert["season"][detailSelectionNum].image;
                $("#concert-detail-image").attr("src", imgSrc).css("width", '100%');
                var detailInfo = resultConcert["season"][detailSelectionNum].body;
                //check for error in ticket_code
                try {
                    var concertTickets = resultConcert["season"][detailSelectionNum]["performances"][detailSelectionNum].ticket_code; // TO-DO: check if multiple performances for that index.
                    $('#concert-detail-buy').append('<a href="' + concertTickets + '">BUY TICKETS</a>')
                } catch(e) {
                    console.log('no ticket code')
                    $('#concert-detail-buy').append('BUY TICKETS')
                    // concertTicketsError(e)
                }
                $('.detail-info-box').append("<p>Event Details</p>" + detailInfo);
                concertDetailHeight()
            }
            if ( $this.hasClass('upcoming-show') ) {
                var flag = false;
                if (!flag) {
                    flag = true;
                    setTimeout(function(){ flag = false; }, 100);
                    var detailScreenSelection = $(this).attr('id');
                    var detailSelectionNum = detailScreenSelection.substring(0);
                    //$('#stage-concert-detail').css("display", 'block'); // TO-DO: need to update 0 to for each detail screen.
                    $(".concerts-full-wrapper").height = windowHeight;
                    var detailTitle = resultConcert["season"][detailSelectionNum].program;
                    $('#concerts-detail-title').text(detailTitle);
                    var detailTitle = resultConcert["season"][detailSelectionNum].program;
                    $('#concerts-detail-title').text(detailTitle);
                    var imgSrc = resultConcert["season"][detailSelectionNum].image;
                    $("#concert-detail-image").attr("src", imgSrc).css("width", '100%');
                    var detailInfo = resultConcert["season"][detailSelectionNum].body;
                    $('.detail-info-box').append("<p>Event Details</p>" + detailInfo);

                concertDetailHeight()
              }
            }
            if ( $this.hasClass('food-btn') ) {
                centerFoodMenu()
            }
            if ( $this.hasClass('map-btn') ) {
                mapHeight();
            }
            if ( $this.hasClass('give-btn') ) {
                centerGiveMenu();
            }
})

var concertArray; // Define GLOBAL concertArray variable that holds ajax data call of the result["season"]
function ajaxCall() {
    return $.ajax({
        url: "http://www.hollywoodbowl.com/api/performance/concerts.json",
        success: function(result) {
            concertArray = result["season"];
        }
    })
}
ajaxCall();

$("body").on('singletap, click', '.genre-btn', function(e) {
    console.log('Clicked $(e.target): ' + $(e.target)) // element clicked
    var genName = $(this).attr('class').split(' ')[1];
    console.log('genName: ' + genName);
    var catName;
    switch (genName) {
        case 'genre-btn-classical':
            catName = "Classical";
            break;
        case 'genre-btn-pop':
            catName = "Pop/Rock";
            break;
        case 'genre-btn-rb':
            catName = "R&B";
            break;
        case 'genre-btn-jazz':
            catName = "Jazz";
            break;
        case 'genre-btn-world':
            catName = "World Music";
            break;
        case 'genre-btn-movie':
            catName = "Movie Nights";
            break;
        case 'genre-btn-family':
            catName = "Family";
            break;
        case 'genre-btn-fireworks':
            catName = "Fireworks";
            break;
        case 'genre-btn-theatre':
            catName = "Theatre/Dance";
            break;
        case 'genre-btn-lease':
            catName = "Lease Events";
            break;
        case 'genre-btn-weekend':
            catName = "Weekend";
            break;
    }

    $('#back-genre-list').stop().transition({ x: 100 }, {duration: 200,});
    // remove all genre buttons from genre screen
    $('.genre-btn').stop().transition({opacity: 0, x: windowWidth }, {duration: 300, complete: function() {
        $('.genre-btn').css("display", "none");
        $('#genre-menu').css("margin-top", "0px");
        $('#genre-menu').css("display", "none");
    }})
    // iterate through the concertArray indices and check if has certain genre
    var i;
    var arrayLen = concertArray.length;

    for (i = 0; i < arrayLen; ++i) { // will change to array.length just set to a # for testing purposes
        if( concertArray[i]["categories"] ) {
            // console.log('this concert has a category ' + concertArray[i]["categories"][0].name);
            // console.log('this concert index is ' + i);
                if ( concertArray[i]["categories"][0].name == catName) {
                    console.log(concertArray[i].program)
                    $('#back-genre-list').stop().css("display", "block").transition({opacity: 1, x: 0 }, {duration: 300,});
                    $("#genre-table").append('<div class="concerts-feed-item transit-btn" id="concert-' + i + '"' + ' data-transit="concerts-details"></div>');
                        $('#genre-table #concert-' + i).append('<div class="concerts-feed-thumbnail" id="thumb-' + i + '"' + '></div>');
                        var thumbImg = concertArray[i]["thumb"];
                        $('#genre-table #thumb-' + i).append('<img src="' + thumbImg + '">');
                        var concertFeedImg = document.getElementById('thumb-' + i).firstChild;
                        concertFeedImg.onload = function() {
                            if(concertFeedImg.height > concertFeedImg.width) {
                                concertFeedImg.height = '100%';
                                concertFeedImg.width = 'auto';
                            }
                        };
                        $('#genre-table #concert-' + i).append('<div class="concerts-feed-info" id="info-' + i + '"' + '></div>');
                        $('#genre-table #info-' + i).append('<div class="concerts-feed-arrow"></div>');
                        $('#genre-table #info-' + i).append('<div class="concerts-feed-info-title" id="info-title-' + i + '"' + '></div>');
                        var infoText = concertArray[i].program;
                        $('#genre-table #info-title-' + i).text(infoText);
                        $('#genre-table #info-' + i).append('<div class="concerts-feed-info-dates" id="info-date-' + i + '"' + '></div>');
                        $('#genre-table #info-' + i).append('<div class="buy-tickets"><p>BUY TICKETS</p></div>');
                        var infoDate = concertArray[i]["performances"][0].date;
                        if (infoDate != null) {
                            var laTimestamp = moment.tz(infoDate, "America/Los_Angeles");
                            var laDate = new Date(laTimestamp);
                            var momDate = moment(laDate).tz("America/Los_Angeles").format('llll');
                            var day = momDate.substring(0,3); //substring of day
                            var mon = momDate.substring(5,8); // substring of month
                            var dayNum = infoDate.substring(8,10); // substring of the date in numbers
                            var timeNum = momDate.substring(17); // substring of the time
                            var dateAndTime = day + " " + mon + " " + dayNum + " " + timeNum;
                            $('#genre-table #info-date-' + i).text(dateAndTime);
                            $('#genre-table #detail-date-' + i).text(dateAndTime); // set text of detail date for concert [i]

                        } // end if
                } // end if genre name matches element clicked
                else {
                    $('#genre-table #info-date-' + i).text("TBD");
                }
                $('#genre-table').css('display', 'block');
        }
    } //end for loop
})

// Back to genre list button
$('#back-genre-list').on('singletap, click', function() {
    var backToGenreBtn = $(this);
        backToGenreBtn.css('display', 'none');
        $('#genre-table').css('display', 'none').empty();
        $('#genre-menu').css("margin-top", "20px");
        $('#genre-menu').stop().css("display", "block").transition({opacity: 1, x: 0 }, {duration: 150})
        $('.genre-btn').stop().css("display", "block").transition({opacity: 1, x: 0 }, {duration: 280})
})

/* -------------------- DOCUMENT EVENTS -------------------- */
/* -------------------------------------------------------- */
$(window).load(function () {
    setWrapper();
    calcBgImg();
    calcMainLogo();
    calcMainMenuHeight();
    // calcFoodScreen($("#food-wine"));
    // centerFoodMenu()
    // calcGiveScreen();
    get_location();
    calcConcertContent();
    calcGenreListHeight();
    calcStageHeights($("#stage-mainmenu"));
    scrollMainMenu();
    calcStageHeights($("#stage-concerts-genres"));
});


$(document).ready(function() {
    displayBackButton();
    //hide main menu buttons
    $('.submenu').hide();
    $('.subsubmenu').hide()
    // Append Upcoming Show elements

    // $("#upcoming-show").append('<div class="featured-show-btn">SHOW INFO</div>');

    var concertArray;

    // Get data for upcoming show elements
        $.ajax({
            url: "http://www.hollywoodbowl.com/api/performance/concerts.json",
            success: function(result) {
                resultConcert = result;
                concertArray = result["season"];
                var i;
                concertArray = result["season"];
                for (i = 0; i < 40; ++i) {
                    var concertDate = result["season"][i]["performances"][0].date;
                    var thisMonthNum = concertDate.substring(5,7)
                    var monthNumCheck;
                    var counter = 0;

                    //console.log(thisMonthNum)
                    var month;
                    //var currentMonth = result["season"][0]["performances"][0].date.substring(5,7);
                    //console.log('curr month: ' + currentMonth);
                    switch (thisMonthNum) {
                        case '01':
                            month = 'January'
                            break;
                        case '02':
                            month = 'February'
                            break;
                        case '03':
                            month = 'March'
                            break;
                        case '04':
                            month = 'April'
                            break;
                        case '05':
                            month = 'May'
                            break;
                        case '06':
                            month = 'June'
                            break;
                        case '07':
                            month = 'July'
                            break;
                        case '08':
                            month = 'August'
                            break;
                        case '09':
                            month = 'September'
                            break;
                        case '10':
                            month = 'October'
                            break;
                        case '11':
                            month = 'November'
                            break;
                        case '12':
                            month = 'December'
                            break;
                    }

                    // will change to array.length just set to a # for testing purposes
                    // do something with `concertArray[i]`
                    $("#concert-table").append('<div class="concerts-feed-item transit-btn" id="concert-' + i + '"' + ' data-transit="concerts-details"></div>');
                    $('#concert-' + i).append('<div class="concerts-feed-thumbnail" id="thumb-' + i + '"' + '></div>');
                    var thumbImg = result["season"][i]["thumb"];
                    $('#thumb-' + i).append('<img src="' + thumbImg + '">');
                    var concertFeedImg = document.getElementById('thumb-' + i).firstChild;
                    concertFeedImg.onload = function() {
                        if(concertFeedImg.height > concertFeedImg.width) {
                            concertFeedImg.height = '100%';
                            concertFeedImg.width = 'auto';
                        }
                    };
                    $('#concert-' + i).append('<div class="concerts-feed-info" id="info-' + i + '"' + '></div>');
                    $('#info-' + i).append('<div class="concerts-feed-arrow"></div>');
                    $('#info-' + i).append('<div class="concerts-feed-info-title" id="info-title-' + i + '"' + '></div>');
                    var infoText = result["season"][i].program;
                    $('#info-title-' + i).text(infoText);
                    $('#info-' + i).append('<div class="concerts-feed-info-dates" id="info-date-' + i + '"' + '></div>');
                    $('#info-' + i).append('<div class="buy-tickets"><p>BUY TICKETS</p></div>');
                    var infoDate = result["season"][i]["performances"][0].date;
                    if (infoDate != null) {
                        var laTimestampUno = moment.tz(infoDate, "America/Los_Angeles");
                        var laTimestampDos = laTimestampUno.subtract(7, 'hours');
                        var laDateUno = new Date(laTimestampDos);
                        var momDateUno = moment(laDateUno).tz("America/Los_Angeles").format('llll');
                        var day = momDateUno.substring(0,3); //substring of day
                        var mon = momDateUno.substring(5,8); // substring of month
                        var dayNum = momDateUno.substring(8,11); // substring of the date in numbers
                        var timeNum = momDateUno.substring(17); // substring of the time
                        var dateAndTime = day + " " + mon + " " + dayNum + " " + timeNum;
                        $('#info-date-' + i).text(dateAndTime);
                        $('#detail-date-' + i).text(dateAndTime); // set text of detail date for concert [i]
                    }

                    // adding concert feed month header
                    // if ( currentMonth !== monthNum ){
                    //     $('#concert-table #concert-' + i).before('<div class="concerts-date-head">' + month + '</div>');
                    //     console.log('new current month: ' + ' ' + month + ' i: ' + i);
                    //     currentMonth = monthNum;
                    // }
                    //set the first variable value for the starting month
                    if (i === 0) {
                        console.log('worked')
                        monthNumCheck = thisMonthNum;
                        $('#concert-table #concert-' + i).before('<div class="concerts-date-head">' + month + '</div>');
                    }
                    //adding concert feed month header - check if current month is same as last
                        if ( thisMonthNum !== monthNumCheck ) {
                            $('#concert-table #concert-' + i).before('<div class="concerts-date-head">' + month + '</div>');
                            monthNumCheck = thisMonthNum
                        } 
                } // end for loop

                $('#stage-concerts .inner-load-screen').css("display", "none");

                                var numGenres = result["season"];
                                //console.log(numGenres);

                    $(".upcoming-show").append('<p class="featured-text">HOLLYWOOD BOWL UPCOMING SHOW</p>');
                    $(".upcoming-show").append('<p class="featured-date">LOADING...</p>');
                    var feat = result["season"][0].program;
                    $('.featured-text').html(feat);
                    var rawDate = concertArray[0]["performances"][0].date;
                    var laTimestampOne = moment.tz(rawDate, "America/Los_Angeles");
                    var laTimestamp = laTimestampOne.subtract(7, 'hours');
                    var laDate = new Date(laTimestamp);
                    console.log('laDate: ' + laDate);
                    var momDate = moment(laDate).tz("America/Los_Angeles").format('llll');
                    console.log('momDate: ' + momDate);
                    var day = momDate.substring(0,3); //substring of day
                    var mon = momDate.substring(5,8); // substring of month
                    var dayNum = momDate.substring(8,11); // substring of the date in numbers
                    var timeNum = momDate.substring(17); // substring of the time
                    var dateAndTime = day + " " + mon + " " + dayNum + " " + timeNum;
                    $('.featured-date').text(dateAndTime);
                    var todayDate = moment();
                    console.log('date is: ' + laTimestamp);
                    console.log('todays date is: ' + todayDate);
                    calcStageHeights($('#stage-mainmenu'))
                    console.log('runnnnning')
                    // check if show is today and display UPCOMING SHOW text
                    if ( !todayDate.isSame(laTimestamp, 'd') ) {
                        $(".upcoming-show").prepend('<p class="featured-date" id="upcoming-show-text">UPCOMING SHOW</p>');
                    }
                    else {
                        console.log('not same date');
                        return false;
                    }
                //adjust main menu screen
            }, error: function(err) {
                console.log(err);
            } // END 

        }); // end get concerts data

}); // Ready


$(window).resize(function() {
   calcBgImg();
   calcStageHeights($("#stage-mainmenu"));
    scrollMainMenu();
})