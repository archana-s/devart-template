#Kaleidoscope Lens

## Authors
- Archana Sankaranarayanan, archana-s

## Description
A kaleidoscope that runs on images. Instead of tiny little glass particles like a traditional kaleidoscope, this one splits images in to smaller chunks, runs it through  the mirrors for creating perfectly symmetric and magical patterns. You will never see images the same way again. 

Its completely done in CSS3 and HTML Canvas with a little help from Javascript.

Steps in creating this kaleidoscope:

1. Get an image
2. (Consider the image in a circle) Use CSS to mask out all regions of the image except the first 45deg of the image. (A slice of a 8-slice-pizza)
3. Convert this in to a canvas 
4. Ofcourse this canvas will have the masked regions too. So crop out the masked regions. Remove any residual borders and mask regions by removing alpha channel on those. 
5. Create a 8-slice fractal with this one slice in canvas. Each adjacent slice is a mirror image of the other. All of this is purely a CSS transform with rotate and transition
6. Now you have a beautiful pattern with the first slice. 
7. Rotate the image by 1deg and repeat from step 2 again.
8. This continues all the way till 360deg to create a full kaleidoscope rotation of the image. 


## Link to Prototype
http://kaleidoscope.nodejitsu.com/
