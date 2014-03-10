define([
  'backbone',
  'communicator',
  'jquery',
  'appRouter'
],

  function( Backbone, Communicator, $, AppRouter) {
    'use strict';

    window.GoGazingApp = new Backbone.Marionette.Application();

    GoGazingApp.addInitializer( function () {
      Communicator.mediator.trigger("APP:START");
      GoGazingApp.appRouter = new AppRouter();
    });

    GoGazingApp.on("initialize:after", function(){
      Backbone.history.start({pushState: true});

      // Prevent scroll bars or people can see your dirty little canvases that make up this pretty kaleidoscope :)
      $('body').on('mousewheel', function(evt){
        evt.stopPropagation();
        evt.preventDefault();
      });

    });

    return GoGazingApp;
  });
