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

      ui: {

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
          'getTransform'
        );
      },

      render: function() {
        this.convertVisibleImageToCanvas();
      },

      convertVisibleImageToCanvas: function() {
        var self = this;
        html2canvas($('.full-view'), {
          onrendered: function(canvas) {
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
        $('.canvas-elem').remove();
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
        $('.img-canvas').append(canvas);
        $('.work-area').remove();
        $('.full-view').remove();
      },

      buildFractals: function() {
        var rotation = 45;

        var imgSlice = this.$el.find(".img-canvas canvas")[0];
        for (var i=0; i<this.totalSlices-1; i++) {
          $('.img-canvas').append('<canvas width="250" height="250"></canvas>');
          var canvas = $('.img-canvas canvas')[i+1];
          var context = canvas.getContext("2d");
          context.drawImage(imgSlice, 0, 0);

          $(canvas).css("-webkit-transform", this.getTransform(i, 250) + "rotate(" + 45*(i+1) + "deg)");
          this.$el.find('.img-canvas').append(canvas);
        }
      },

      getTransform: function(i, canvasWidth) {
        var a = 50;
        switch(i) {
          case 0:
            return "translate(" + a + "px," + (canvasWidth/2) + "px)";
          case 1:
            return "translate(" + 0 + "px," + canvasWidth + "px)";
          case 2:
            return "translate(" + (-1*(canvasWidth/2)) + "px," + (a+canvasWidth) + "px)";
          case 3:
            return "translate(" + (-1*canvasWidth) + "px," + canvasWidth + "px)";
          case 4:
            return "translate(" + (-1*(a+canvasWidth)) + "px," + (canvasWidth/2) + "px)";
          case 5:
            return "translate(" + -1*canvasWidth + "px," + 0 + "px)";
          case 6:
            return "translate(" + -1*(canvasWidth/2) + "px," + (-1*a) + "px)";

        }

      }


    });

  });
