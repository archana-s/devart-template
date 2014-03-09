/**
 *  Todo: add a description
 */
define([
  'backbone',
  'jquery',
  'underscore',
  'html2canvas'
],

  function( Backbone, $, _ ) {
    'use strict';

    /* Return a ItemView class definition */
    return Backbone.Marionette.ItemView.extend({

      totalDegrees: 360,
      totalSlices: 8,
      imageIndex: 0,

      ui: {
        'maskImage': '.masks img',
        'displayImageContainer': '.display-image',
        'displayImage': '.display-image img',
        'kaleidoscope': '.kaleiscope'
      },

      events: {

      },

      initialize: function(options) {
        this.el = options.el;
        this.perSliceAngle = this.totalDegrees/this.totalSlices;

        _.bindAll(this,
          'render',
          'buildFractals',
          'convertVisibleImageToCanvas',
          'cropCanvas',
          'cutOutBlackAlphaChannel',
          'getRelevantImage',
          'getTransform',
          'rotateImage',
          'loopThroughImages',
          'bindEvents'
        );

        this.bindEvents();
      },

      render: function() {
        this.loopThroughImages();
      },

      bindEvents: function() {
        this.bind("home:rotateImage", this.rotateImage);
        this.bind("home:rotationComplete", this.loopThroughImages);
      },

      loopThroughImages: function() {
        $(this.ui.kaleidoscope).hide();
        var self = this;
        this.imageIndex++;
        if (this.imageIndex <= 10) {
          $(this.ui.displayImage).attr('src', '/images/image' + this.imageIndex + ".jpg");
          $(this.ui.maskImage).attr('src', '/images/image' + this.imageIndex + ".jpg");
          $(this.ui.displayImageContainer).show();

          $(this.ui.displayImageContainer).addClass('zoomTiltFade');

          $(this.ui.displayImageContainer).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(evt){
            $(self.ui.displayImageContainer).hide();

            setTimeout(function(){
              $(self.ui.kaleidoscope).show();
            }, 1000);
            self.trigger("home:rotateImage");
          });
        }
      },


      rotateImage: function() {
        var self = this;
        var index = 0;

        var rotateInterval = setInterval(function(){
          var image = self.$el.find('img');
          image.removeClass();
          image.addClass('rot-' + index);
          self.convertVisibleImageToCanvas();
          index = index + 1;
          if (index > 360) {
            clearInterval(rotateInterval);
            self.trigger('home:rotationComplete');
          }
        }, 50);
      },

      convertVisibleImageToCanvas: function() {
        var self = this;
        html2canvas($('.masks'), {
          onrendered: function(canvas) {
            $('.canvas-elem').empty();
            $('.canvas-elem').append(canvas);
            self.getRelevantImage();
          }
        });
      },

      getRelevantImage: function() {
        this.cropCanvas();
        this.cutOutBlackAlphaChannel();
        this.buildFractals();
      },

      cropCanvas: function() {
        var canvas = $('.trimmed-canvas canvas')[0];
        var context = canvas.getContext('2d');

        var imageObj = $('.canvas-elem canvas')[0];

        // draw cropped image
        var sourceX = 250;
        var sourceY = 0;
        var sourceWidth = 250;
        var sourceHeight = 250;
        var destWidth = sourceWidth;
        var destHeight = sourceHeight;
        var destX = canvas.width / 2 - destWidth / 2;
        var destY = canvas.height / 2 - destHeight / 2;

        context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        //$('.canvas-elem').remove();
      },

      cutOutBlackAlphaChannel: function() {
        var canvas = $('.final-image canvas')[0];
        var context = canvas.getContext("2d");

        var image = $('.trimmed-canvas canvas')[0];

        context.drawImage(image, 0, 0);

        var imgd = context.getImageData(0, 0, canvas.width, canvas.height);
        var pix = imgd.data;
        var newColor = {r:255,g:255,b:255, a:0};

        for (var i = 0, n = pix.length; i <n; i += 4) {
          var r = pix[i],
            g = pix[i+1],
            b = pix[i+2];

          if(r <= 20 && g <= 20 && b <= 20){
            // Change the black to the new color.
            pix[i] = newColor.r;
            pix[i+1] = newColor.g;
            pix[i+2] = newColor.b;
            pix[i+3] = newColor.a;
          }
        }

        context.putImageData(imgd, 0, 0);
        $('.img-canvas').empty();
        $('.img-canvas').append(canvas);
        $('.final-image').append("<canvas width='250' height='250'></canvas>");
      },

      buildFractals: function() {
        var rotation = 45;

        var imgSlice = this.$el.find(".img-canvas canvas")[0];
        for (var i=0; i<this.totalSlices-1; i++) {
          $('.img-canvas').append('<canvas width="250" height="250"></canvas>');
          var canvas = $('.img-canvas canvas')[i+1];
          var context = canvas.getContext("2d");
          context.drawImage(imgSlice, 0, 0);

          var transformAttr = "";
          var rotationAngle = 0;

          if (i % 2 === 0) {
            transformAttr += "scaleX(-1) ";
            rotationAngle = (-1) * (45 * (i+2));
          }
          else {
            rotationAngle = 45 * (i+1);
          }

          transformAttr += this.getTransform(i, 250) + " rotate(" + rotationAngle + "deg)";
          $(canvas).css("-webkit-transform", transformAttr);
          this.$el.find('.img-canvas').append(canvas);
        }
      },

      getTransform: function(i, canvasWidth) {
        var offset = 5;
        switch(i) {
          case 0:
            return "translate(0, 0)";
          case 1:
            return "translate(" + 0 + "px," + canvasWidth + "px)";
          case 2:
            return "translate(" + -1*offset + "px," + (canvasWidth-offset) + "px)";
          case 3:
            return "translate(" + (-1*(canvasWidth - offset)) + "px," + (canvasWidth - offset) + "px)";
          case 4:
            return "translate(" + (canvasWidth - (offset*2)) + "px," + canvasWidth + "px)";
          case 5:
            return "translate(" + -1*(canvasWidth - (offset*2)) + "px," + 0 + "px)";
          case 6:
            return "translate(" + (canvasWidth - offset) + "px," + offset + "px)";

        }

      }


    });

  });
