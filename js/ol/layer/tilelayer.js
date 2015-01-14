goog.provide('ol.layer.Tile');

goog.require('ol.layer.Layer');


/**
 * @enum {string}
 */
ol.layer.TileProperty = {
  PRELOAD: 'preload',
  USE_INTERIM_TILES_ON_ERROR: 'useInterimTilesOnError'
};



/**
 * @classdesc
 * For layer sources that provide pre-rendered, tiled images in grids that are
 * organized by zoom levels for specific resolutions.
 * Note that any property set in the options is set as a {@link ol.Object}
 * property on the layer object; for example, setting `title: 'My Title'` in the
 * options means that `title` is observable, and has get/set accessors.
 *
 * @constructor
 * @extends {ol.layer.Layer}
 * @fires ol.render.Event
 * @param {olx.layer.TileOptions=} opt_options Tile layer options.
 * @api stable
 */
ol.layer.Tile = function(opt_options) {
  var options = goog.isDef(opt_options) ? opt_options : {};
  goog.base(this,  /** @type {olx.layer.LayerOptions} */ (options));

  if (!goog.isDef(this.getPreload())) {
    this.setPreload(0);
  }
  if (!goog.isDef(this.getUseInterimTilesOnError())) {
    this.setUseInterimTilesOnError(true);
  }
};
goog.inherits(ol.layer.Tile, ol.layer.Layer);


/**
 * @return {number} The level to preload tiles up to.
 * @observable
 * @api
 */
ol.layer.Tile.prototype.getPreload = function() {
  return /** @type {number} */ (this.get(ol.layer.TileProperty.PRELOAD));
};
goog.exportProperty(
    ol.layer.Tile.prototype,
    'getPreload',
    ol.layer.Tile.prototype.getPreload);


/**
 * @function
 * @return {ol.source.Tile} Source.
 * @api stable
 */
ol.layer.Tile.prototype.getSource;


/**
 * @param {number} preload The level to preload tiles up to.
 * @observable
 * @api
 */
ol.layer.Tile.prototype.setPreload = function(preload) {
  this.set(ol.layer.TileProperty.PRELOAD, preload);
};
goog.exportProperty(
    ol.layer.Tile.prototype,
    'setPreload',
    ol.layer.Tile.prototype.setPreload);


/**
 * @return {boolean} Use interim tiles on error.
 * @observable
 * @api
 */
ol.layer.Tile.prototype.getUseInterimTilesOnError = function() {
  return /** @type {boolean} */ (
      this.get(ol.layer.TileProperty.USE_INTERIM_TILES_ON_ERROR));
};
goog.exportProperty(
    ol.layer.Tile.prototype,
    'getUseInterimTilesOnError',
    ol.layer.Tile.prototype.getUseInterimTilesOnError);


/**
 * @param {boolean} useInterimTilesOnError Use interim tiles on error.
 * @observable
 * @api
 */
ol.layer.Tile.prototype.setUseInterimTilesOnError =
    function(useInterimTilesOnError) {
  this.set(
      ol.layer.TileProperty.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
};
goog.exportProperty(
    ol.layer.Tile.prototype,
    'setUseInterimTilesOnError',
    ol.layer.Tile.prototype.setUseInterimTilesOnError);
