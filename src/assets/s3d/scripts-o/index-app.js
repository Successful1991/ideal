import $ from 'jquery';
import App from './modules/App';
import isDevice from './modules/checkDevice';
import CreateMarkup from './modules/markup';
import loader from './modules/loaderTime';

// var arrTimes = [];
// var i = 0; // start
// var timesToTest = 10;
// var tThreshold = 100; //ms
// var testImage = "/wp-content/themes/idealist/assets/s3d/images/idealist/complex/24.jpg"; // small image in your server
// var dummyImage = new Image();
// var isConnectedFast = false;
//
// testLatency(function(avg){
//     isConnectedFast = (avg <= tThreshold);
//     /** output */
//     console.log("Time: " + avg + "ms - isConnectedFast? " + isConnectedFast);
//     console.log();
//     var oProgress = document.getElementById("progress");
//     if (oProgress) {
//         //oProgress.innerHTML = "Time: " + avg + "ms - isConnectedFast? " + isConnectedFast;
//     }
//     init();
//     // document.body.appendChild(
//     //     document.createTextNode("Time: " + (avg.toFixed(2)) + "ms - isConnectedFast? " + isConnectedFast)
//     // );
// });
//
// /** test and average time took to download image from server, called recursively timesToTest times */
// function testLatency(cb) {
//     var tStart = new Date().getTime();
//     if (i<timesToTest-1) {
//         dummyImage.src = testImage + '?t=' + tStart;
//         dummyImage.onload = function() {
//             var tEnd = new Date().getTime();
//             var tTimeTook = tEnd-tStart;
//             arrTimes[i] = tTimeTook;
//             testLatency(cb);
//             i++;
//         };
//     } else {
//         /** calculate average of array items then callback */
//         var sum = arrTimes.reduce(function(a, b) { return a + b; });
//         var avg = sum / arrTimes.length;
//         cb(avg);
//     }
// }
function init() {
    window.createMarkup = CreateMarkup;
    const config = {
        complex: {
            url: '',
            imageUrl: '/wp-content/themes/idealist/assets/s3d/images/idealist/complex/',
            id: 'js-s3d__wrapper',
            numberSlide: {
                min: 0,
                max: 179
            },
            controllPoint : [11,52,109,144],
            activeSlide: 11,
            mouseSpeed: 1,
            // mouseSpeed: 300,
        },
        floor: {
            id: 'js-s3d__wrapper'
        },
        apart: {
            id: 'js-s3d__wrapper'
        },

    };

    let app;
    new Promise((resolve) =>{
        loader(resolve);
    }).then(value => {
        if(isDevice('mobile') || !value ) {
            $('.js-s3d__slideModule').addClass('s3d-mobile');
            config.complex.imageUrl += 'mobile/';
        }

        app = new App(config);
        app.init();

        $(window).resize(()=>{
            app.resize();
        });
    });



}
document.addEventListener('DOMContentLoaded',function (global) {
    init();
});