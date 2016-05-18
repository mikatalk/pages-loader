'use strict';

import '../sass/main.scss';

import './vendors/analytics';

import $ from './vendors/jquery-2.2.3.min';

let $iframe1, $iframe2, $iframeIn, $iframeOut;
let $nav;
let pages = [];

$( function () {

    $iframe1 = $iframeIn  = $('#iframe1');
    $iframe2 = $iframeOut = $('#iframe2');
    $nav = $('#nav');

    initGA();
    buildNav();

    let $li = $( $nav.find('li')[0] );
    loadPage(  { url: $li.data('url'), title: $li.data('title') } );

});

function initGA () {

    window.ga = window.ga || function (){
        (ga.q = ga.q || []).push( arguments );
    };
    ga.l = +new Date;
    ga('create', 'UA-22648958-1', 'auto');
    ga('send', 'pageview');

}

function buildNav () {

    $('#nav li').each(function(){
        let $li = $(this);
        let title = $li.data('title');
        $li.html( `<span class="letter">${ title.charAt(0) }</span><span class="title">${ title.slice(1) }</span>` );
        $li.on('click tap', function () {
            loadPage( { url: $li.data('url'), title: title } );
        });
    });

    $nav.removeClass('closed');

}

function loadPage ( page ) {

    // toggle pointers
    $iframeIn = $iframeIn === $iframe1 ? $iframe2 : $iframe1;
    $iframeOut = $iframeIn === $iframe1 ? $iframe2 : $iframe1;

    $iframeOut[0].onload = null;
    $iframeOut[0].onerror = null;

    $iframeIn[0].onload = runTransition;
    $iframeIn[0].onerror = handleError;
    $iframeIn[0].src = page.url;

    ga('send', 'event', 'loader-open-page', page.title, page.url, 1);

}

function runTransition () {
    
    $iframeIn.hide().css({ 'z-index': 10 }).fadeIn(2000, function(){ $iframeOut[0].src = ''; });
    $iframeOut.css({ 'z-index': 9 }).fadeOut(1000);

}

function handleError () {
    console.log('Error loading: ' + $iframeIn[0].src);
}

