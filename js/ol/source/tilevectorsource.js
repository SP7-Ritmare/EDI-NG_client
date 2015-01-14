goog.provide('ol.source.TileVector');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.object');
goog.require('ol.TileCoord');
goog.require('ol.TileUrlFunction');
goog.require('ol.source.FormatVector');
goog.require('ol.source.State');
goog.require('ol.tilegrid.TileGrid');



/**
 * @classdesc
 * A vector source in one of the supported formats, where the data is divided
 * into tiles in a fixed grid pattern.
 *
 * @constructor
 * @extends {ol.source.FormatVector}
 * @param {olx.source.TileVectorOptions} options Options.
 * @api
 */
ol.source.TileVector = function(options) {

  goog.base(this, {
    attributions: options.attributions,
    format: options.format,
    logo: options.logo,
    projection: options.projection
  });

  /**
   * @private
   * @type {ol.tilegrid.TileGrid}
   */
  this.tileGrid_ = options.tileGrid;

  /**
   * @private
   * @type {ol.TileUrlFunctionType}
   */
  this.tileUrlFunction_ = ol.TileUrlFunction.nullTileUrlFunction;

  /**
   * @private
   * @type {ol.TileCoordTransformType}
   */
  this.tileCoordTransform_ = this.tileGrid_.createTileCoordTransform();

  /**
   * @private
   * @type {Object.<string, Array.<ol.Feature>>}
   */
  this.tiles_ = {};

  if (goog.isDef(options.tileUrlFunction)) {
    this.setTileUrlFunction(options.tileUrlFunction);
  } else if (goog.isDef(options.urls)) {
    this.setUrls(options.urls);
  } else if (goog.isDef(options.url)) {
    this.setUrl(options.url);
  }

};
goog.inherits(ol.source.TileVector, ol.source.FormatVector);


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.addFeature = goog.abstractMethod;


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.addFeatures = goog.abstractMethod;


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.clear = function() {
  goog.object.clear(this.tiles_);
};


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.forEachFeature = goog.abstractMethod;


/**
 * Iterate through all features whose geometries contain the provided
 * coordinate at the provided resolution, calling the callback with each
 * feature. If the callback returns a "truthy" value, iteration will stop and
 * the function will return the same value.
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} resolution Resolution.
 * @param {function(this: T, ol.Feature): S} callback Called with each feature
 *     whose goemetry contains the provided coordinate.
 * @param {T=} opt_this The object to use as `this` in the callback.
 * @return {S|undefined} The return value from the last call to the callback.
 * @template T,S
 */
ol.source.TileVector.prototype.forEachFeatureAtCoordinateAndResolution =
    function(coordinate, resolution, callback, opt_this) {

  var tileGrid = this.tileGrid_;
  var tiles = this.tiles_;
  var tileCoord = tileGrid.getTileCoordForCoordAndResolution(coordinate,
      resolution);

  var tileKey = this.getTileKeyZXY_(tileCoord[0], tileCoord[1], tileCoord[2]);
  var features = tiles[tileKey];
  if (goog.isDef(features)) {
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      var feature = features[i];
      var geometry = feature.getGeometry();
      goog.asserts.assert(goog.isDefAndNotNull(geometry));
      if (geometry.containsCoordinate(coordinate)) {
        var result = callback.call(opt_this, feature);
        if (result) {
          return result;
        }
      }
    }
  }
  return undefined;
};


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.forEachFeatureInExtent = goog.abstractMethod;


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.forEachFeatureInExtentAtResolution =
    function(extent, resolution, f, opt_this) {
  var tileGrid = this.tileGrid_;
  var tiles = this.tiles_;
  var z = tileGrid.getZForResolution(resolution);
  var tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
  var x, y;
  for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
    for (y = tileRange.minY; y <= tileRange.maxY; ++y) {
      var tileKey = this.getTileKeyZXY_(z, x, y);
      var features = tiles[tileKey];
      if (goog.isDef(features)) {
        var i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
          var result = f.call(opt_this, features[i]);
          if (result) {
            return result;
          }
        }
      }
    }
  }
  return undefined;
};


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.getClosestFeatureToCoordinate =
    goog.abstractMethod;


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.getExtent = goog.abstractMethod;


/**
 * @inheritDoc
 * @api
 */
ol.source.TileVector.prototype.getFeatures = function() {
  var tiles = this.tiles_;
  var features = [];
  var tileKey;
  for (tileKey in tiles) {
    goog.array.extend(features, tiles[tileKey]);
  }
  return features;
};


/**
 * Get all features whose geometry intersects the provided coordinate for the
 * provided resolution.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {number} resolution Resolution.
 * @return {Array.<ol.Feature>} Features.
 * @api
 */
ol.source.TileVector.prototype.getFeaturesAtCoordinateAndResolution =
    function(coordinate, resolution) {
  var features = [];
  this.forEachFeatureAtCoordinateAndResolution(coordinate, resolution,
      /**
       * @param {ol.Feature} feature Feature.
       */
      function(feature) {
        features.push(feature);
      });
  return features;
};


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.getFeaturesInExtent = goog.abstractMethod;


/**
 * @param {number} z Z.
 * @param {number} x X.
 * @param {number} y Y.
 * @private
 * @return {string} Tile key.
 */
ol.source.TileVector.prototype.getTileKeyZXY_ = function(z, x, y) {
  return z + '/' + x + '/' + y;
};


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.loadFeatures =
    function(extent, resolution, projection) {
  var tileCoordTransform = this.tileCoordTransform_;
  var tileGrid = this.tileGrid_;
  var tileUrlFunction = this.tileUrlFunction_;
  var tiles = this.tiles_;
  var z = tileGrid.getZForResolution(resolution);
  var tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
  var tileCoord = [z, 0, 0];
  var x, y;
  /**
   * @param {string} tileKey Tile key.
   * @param {Array.<ol.Feature>} features Features.
   * @this {ol.source.TileVector}
   */
  function success(tileKey, features) {
    tiles[tileKey] = features;
    this.setState(ol.source.State.READY);
  }
  for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
    for (y = tileRange.minY; y <= tileRange.maxY; ++y) {
      var tileKey = this.getTileKeyZXY_(z, x, y);
      if (!(tileKey in tiles)) {
        tileCoord[0] = z;
        tileCoord[1] = x;
        tileCoord[2] = y;
        tileCoordTransform(tileCoord, projection, tileCoord);
        var url = tileUrlFunction(tileCoord, 1, projection);
        if (goog.isDef(url)) {
          tiles[tileKey] = [];
          this.loadFeaturesFromURL(url, goog.partial(success, tileKey),
              goog.nullFunction, this);
        }
      }
    }
  }
};


/**
 * @inheritDoc
 */
ol.source.TileVector.prototype.removeFeature = goog.abstractMethod;


/**
 * @param {ol.TileUrlFunctionType} tileUrlFunction Tile URL function.
 */
ol.source.TileVector.prototype.setTileUrlFunction = function(tileUrlFunction) {
  this.tileUrlFunction_ = tileUrlFunction;
  this.changed();
};


/**
 * @param {string} url URL.
 */
ol.source.TileVector.prototype.setUrl = function(url) {
  this.setTileUrlFunction(ol.TileUrlFunction.createFromTemplates(
      ol.TileUrlFunction.expandUrl(url)));
};


/**
 * @param {Array.<string>} urls URLs.
 */
ol.source.TileVector.prototype.setUrls = function(urls) {
  this.setTileUrlFunction(ol.TileUrlFunction.createFromTemplates(urls));
};
