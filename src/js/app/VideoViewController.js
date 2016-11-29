"use strict";

var TD = require('./TD'),
    Config = require('./Config'),
    Preload = require('./Preload'),
    KeyAnimation = require('./KeyAnimation');

//加载页对象
var VideoViewController = function(){

    //公共变量
    var _that = this;

    //私有变量
    var _private = {};

    _private.pageEl = $('.m-video');

    _private.videoBox = _private.pageEl.find('.video-main');


    _private.isInit = false;

    var gamma = 0;

    //初始化，包括整体页面
    _private.init = function(){

        if (_private.isInit === true) {
            return;
        }

        _private.videoBox.on('ended', function () {

            _that.onstop && _that.onstop();

            setTimeout(function () {
                _that.hide();
            },500);

        });

        var resizeVideo = function (config) {

            config = config || {};
            config.width = config.width || 750;
            config.height = config.height || 1200;
            config.type = config.type || 'contain'; //'cover'、'contain'

            var $videoBox = typeof config.target == 'string' ? $(config.target) : config.target;

            console.log(config);

            console.log("resizeVideo");

            var resizeGo = function () {

                var width = config.width/100+'rem';

                var height = config.height/100+'rem';

                if(config.type == 'cover'){
                  $videoBox.css({
                        top: '50%',
                        left: '50%',
                        width: width,
                        height: height,
                        margin: '-6.0rem 0 0 -3.75rem'
                    })
                }else{
                  $videoBox.css({
                        width: '100%',
                        height: '100%'
                    })
                }

              $videoBox.off('timeupdate', resizeGo);

                _that.onplay && _that.onplay();


            }

          $videoBox.on('timeupdate', resizeGo);

        };

        resizeVideo({
            target: _private.videoBox,
            width: 750,
            height: 1200,
            type: 'contain'/*cover/contain*/
        });

        _private.isInit = true;

    };


    //播放
    _that.play = function(){
        _private.videoBox.get(0).play();
    }


    //显示
    _that.show = function(){
        _private.pageEl.show();

    };

    //隐藏
    _that.hide = function(){ //
        _that.onhide && _that.onhide();//
        _private.pageEl.hide();
    };

    _private.init();

};

module.exports = VideoViewController;