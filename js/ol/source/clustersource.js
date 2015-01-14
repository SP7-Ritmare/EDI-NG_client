// FIXME keep cluster cache by resolution ?
// FIXME distance not respected because of the centroid

goog.provide('ol.source.Cluster');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('ol.Feature');
goog.require('ol.coordinate');
goog.require('ol.extent');
goog.require('ol.geom.Point');
goog.require('ol.source.Vector');



/**
 * @constructor
 * @param {olx.source.ClusterOptions} options
 * @extends {ol.source.Vector}
 * @api
 */
ol.source.Cluster = function(options) {
  goog.base(this, {
    attributions: options.attributions,
    extent: options.extent,
    logo: options.logo,
    projection: options.projection
  });

  /**
   * @type {number|undefined}
   * @private
   */
  this.resolution_ = undefined;

  /**
   * @type {number}
   * @private
   */
  this.distance_ = goog.isDef(options.distance) ? options.distance : 20;

  /**
   * @type {Array.<ol.Feature>}
   * @private
   */
  this.features_ = [];

  /**
   * @type {ol.source.Vector}
   * @private
   */
  this.source_ = options.source;

  this.source_.on(goog.events.EventType.CHANGE,
      ol.source.Cluster.prototype.onSourceChange_, this);
};
goog.inherits(ol.source.Cluster, ol.source.Vector);


/**
 * @inheritDoc
 */
ol.source.Cluster.prototype.loadFeatures = function(extent, resolution,
    projection) {
  if (resolution !== this.resolution_) {
    this.clear();
    this.resolution_ = resolution;
    this.source_.loadFeatures(extent, resolution, projection);
    this.cluster_();
    this.addFeatures(this.features_);
  }
};


/**
 * handle the source changing
 * @private
 */
ol.source.Cluster.prototype.onSourceChange_ = function() {
  this.clear();
  this.cluster_();
  this.addFeatures(this.features_);
  this.changed();
};


/**
 * @private
 */
ol.source.Cluster.prototype.cluster_ = function() {
  if (!goog.isDef(this.resolution_)) {
    return;
  }
  goog.array.clear(this.features_);
  var extent = ol.extent.createEmpty();
  var mapDistance = this.distance_ * this.resolution_;
  var features = this.source_.getFeatures();

  /**
   * @type {Object.<string, boolean>}
   */
  var clustered = {};

  for (var i = 0, ii = features.length; i < ii; i++) {
    var feature = features[i];
    if (!goog.object.containsKey(clustered, goog.getUid(feature).toString())) {
      var geometry = feature.getGeometry();
      goog.asserts.assert(geometry instanceof ol.geom.Point);
      var coordinates = geometry.getCoordinates();
      ol.extent.createOrUpdateFromCoordinate(coordinates, extent);
      ol.extent.buffer(extent, mapDistance, extent);

      var neighbors = this.source_.getFeaturesInExtent(extent);
      goog.asserts.assert(neighbors.length >= 1);
      neighbors = goog.array.filter(neighbors, function(neighbor) {
        var uid = goog.getUid(neighbor).toString();
        if (!goog.object.containsKey(clustered, uid)) {
          clustered[uid] = true;
          return true;
        } else {
          return false;
        }
      });
      this.features_.push(this.createCluster_(neighbors));
    }
  }
  goog.asserts.assert(
      goog.object.getCount(clustered) == this.source_.getFeatures().length);
};


/**
 * @param {Array.<ol.Feature>} features Features
 * @return {ol.Feature}
 * @private
 */
ol.source.Cluster.prototype.createCluster_ = function(features) {
  var length = features.length;
  var centroid = [0, 0];
  for (var i = 0; i < length; i++) {
    var geometry = features[i].getGeometry();
    goog.asserts.assert(geometry instanceof ol.geom.Point);
    var coordinates = geometry.getCoordinates();
    ol.coordinate.add(centroid, coordinates);
  }
  ol.coordinate.scale(centroid, 1 / length);

  var cluster = new ol.Feature(new ol.geom.Point(centroid));
  cluster.set('features', features);
  return cluster;
};
