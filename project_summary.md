# Kaleidoscope Lens

## Authors
- Archana Sankaranarayanan (archana-s on git)

## Description
A kaleidoscope that runs on images. Instead of tiny little glass particles like a traditional kaleidoscope, this one splits images in to smaller chunks, runs it through  the mirrors for creating perfectly symmetric and magical patterns. You will never see images the same way again.
Its completely done in CSS3 and HTML Canvas with a little help from Javascript.

## Link to Prototype
http://kaleidoscope.nodejitsu.com/

## Goal for the project
Build a Kaleidoscope that takes an image as an input, slice it up (45deg) per kaleidoscope run, and build kaleidoscope fractals.
Get the kaleidoscope to rotate smoothly for every one degree of the image.

## Stages for the project
1. Build a robust kaleidoscope that takes an image, splits it to 8 pieces and builds the kaleidoscope fractals
2. Accept Picasa images as input for the kaleidoscope.
3. Get the kaleidoscope to access user's Picasa albums and rotate their photos through the kaleidoscope
   (This would make a fantastic Digital Photo Frame, more funner with the Kaleidoscope)
4. Have users interact with the Kaleidoscope, stop the auto rotation and have them move it around.
5. Access camera using SocketIO.js and do a live kaleidoscope with their video (similar to iPhoto)

## Project Status
Stages 1 and 2 are complete. I will need another 2 months to finish up the last three stages.

## Steps in creating the kaleidoscope
1. Get an image - I am getting all the images from Picasa Featured Images. I haven't yet figured out the frequency of updating the picasa images. API used to get images: https://picasaweb.google.com/data/feed/api/featured . Images are atleast 500px in width or height.
2. (Consider the image in a circle) Use CSS to mask out all regions of the image except the first 45deg of the image. (A slice of a 8-slice-pizza)
3. Convert this in to a canvas 
4. Ofcourse this canvas will have the masked regions too. So crop out the masked regions. Remove any residual borders and mask regions by removing alpha channel on those.
Code snippet:
  ``` cropImage
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
```
5. Create a 8-slice fractal with this one slice in canvas. Each adjacent slice is a mirror image of the other. All of this is purely a CSS transform with rotate and transition
Code snippet:
  ``` buildfractals
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
      ```
6. Now you have a beautiful pattern with the first slice. 
7. Rotate the image by 1deg and repeat from step 2 again.
Code snippet:

``` rotateImage
  rotateImage: function() {
        var self = this;
        this.rotationIndex = 0;

        var rotateInterval = setInterval(function(){
          var image = self.$el.find('img');
          image.removeClass();
          image.addClass('rot-' + self.rotationIndex);
          self.convertVisibleImageToCanvas();
          self.rotationIndex = self.rotationIndex + 1;
          if (self.rotationIndex > 360) {
            clearInterval(rotateInterval);
            self.trigger('home:rotationComplete');
          }
        }, 150);
      },
  ```
8. This continues all the way till 360deg to create a full kaleidoscope rotation of the image. 
9. Then comes the next image and it all continues again.