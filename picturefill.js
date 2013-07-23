/*! Picturefill - Responsive Images that work today.
 * (and mimic the proposed Picture element with span elements).
 * Author: Scott Jehl, Filament Group, 2012 | License: MIT/GPLv2
 * */

(function( w ){

  ////////////////////////////////////
  // Test for webp support
  function testWebP(callback) {
    var webP = new Image();

    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

    webP.onload = webP.onerror = function () {
      callback(webP.height === 2);
    };
  };

  function notifyWebP(supported) {
    webp_support = (supported) ? true : false;
  }

  testWebP(notifyWebP);
  // end webp test
  ////////////////////////////////////

  // Call the webp test, which will then call w.picturefill
  function webpSetup() {
    testWebP(w.picturefill);
  }

  // Enable strict mode
  "use strict";

  w.picturefill = function(webp_support) {
    var ps = w.document.getElementsByTagName( "span" );

    //
    // check the length, if it is over 40 characters we can
    // assume that modernizr has added the appropriate classes
    var classNameLength = document.body.parentElement.className.length;

    // Loop the pictures
    for( var i = 0, il = ps.length; i < il; i++ ){
      if( ps[ i ].getAttribute( "data-picture" ) !== null ){

        if ( webp_support ) {
          var sources = ps[ i ].getElementsByTagName( "i" );
        } else {
          var sources = ps[ i ].getElementsByTagName( "span" );
        }


        var matches = [];

        // See if which sources match
        for( var j = 0, jl = sources.length; j < jl; j++ ){
          var media = sources[ j ].getAttribute( "data-media" );

          // if there's no media specified, OR w.matchMedia is supported 
          if( !media || ( w.matchMedia && w.matchMedia( media ).matches ) ){
            matches.push( sources[ j ] );
          }
        }

      // Find any existing img element in the picture element
      var picImg = ps[ i ].getElementsByTagName( "img" )[ 0 ];

      if( matches.length ){
        var matchedEl = matches.pop();
        if( !picImg || picImg.parentNode.nodeName === "NOSCRIPT" ){
          picImg = w.document.createElement( "img" );
          picImg.alt = ps[ i ].getAttribute( "data-alt" );
        }

        picImg.src =  matchedEl.getAttribute( "data-src" );
        matchedEl.appendChild( picImg );
      }
      else if( picImg ){
        picImg.parentNode.removeChild( picImg );
      }
    }
    }
  };

  // Run on resize and domready (w.load as a fallback)
  if( w.addEventListener ){
    w.addEventListener( "resize", webpSetup, false );
    w.addEventListener( "DOMContentLoaded", function(){
      webpSetup();
      // Run once only
      w.removeEventListener( "load", webpSetup, false );
    }, false );
    w.addEventListener( "load", webpSetup, false );
  }
  else if( w.attachEvent ){
    w.attachEvent( "onload", webpSetup );
  }

}( this ));

