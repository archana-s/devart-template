/**
 * Show Details View
 * @param el : Element to render
 * ItemRenderer new method: renderOnDataChange
 * This method is defined in app.js file.
 *
 * This will render just the page after a data change. This can be overriden here
 * for specific reloads.
 */
define([
  'backbone',
  'jquery',
  'underscore'
],

  function( Backbone, $, _ ) {
    'use strict';

    /* Return a ItemView class definition */
    return Backbone.Marionette.ItemView.extend({

      ui: {

      },

      events: {

      },

      initialize: function(options) {
        this.el = options.el;

        _.bindAll(this,
          'render'
        );
      },

      render: function() {
      }
    });

  });
