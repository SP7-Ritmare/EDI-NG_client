// FIXME bulk feature upload - suppress events
// FIXME put features in an ol.Collection
// FIXME make change-detection more refined (notably, geometry hint)

goog.provide('ol.source.Vector');
goog.provide('ol.source.VectorEvent');
goog.provide('ol.source.VectorEventType');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.object');
goog.require('ol.ObjectEventType');
goog.require('ol.proj');
goog.require('ol.source.Source');
goog.require('ol.structs.RBush');


/**
 * @enum {string}
 */
ol.source.VectorEventType = {
  /**
   * Triggered when a feature is added to the source.
   * @event ol.source.VectorEvent#addfeature
   * @api stable
   */
  ADDFEATURE: 'addfeature',

  /**
   * Triggered when a feature is updated.
   * @event ol.source.VectorEvent#changefeature
   * @api
   */
  CHANGEFEATURE: 'changefeature',

  /**
   * Triggered when the clear method is called on the source.
   * @event ol.source.VectorEvent#clear
   * @api
   */
  CLEAR: 'clear',

  /**
   * Triggered when a feature is removed from the source.
   * See {@link ol.source.Vector#clear source.clear()} for exceptions.
   * @event ol.source.VectorEvent#removefeature
   * @api stable
   */
  REMOVEFEATURE: 'removefeature'
};



/**
 * @classdesc
 * Provides a source of features for vector layers.
 *
 * @constructor
 * @extends {ol.source.Source}
 * @fires ol.source.VectorEvent
 * @param {olx.source.VectorOptions=} opt_options Vector source options.
 * @api stable
 */
ol.source.Vector = function(opt_options) {

  var options = goog.isDef(opt_options) ? opt_options : {};

  goog.base(this, {
    attributions: options.attributions,
    logo: options.logo,
    projection: options.projection,
    state: goog.isDef(options.state) ?
        /** @type {ol.source.State} */ (options.state) : undefined
  });

  /**
   * @private
   * @type {ol.structs.RBush.<ol.Feature>}
   */
  this.rBush_ = new ol.structs.RBush();

  /**
   * @private
   * @type {Object.<string, ol.Feature>}
   */
  this.nullGeometryFeatures_ = {};

  /**
   * A lookup of features by id (the return from feature.getId()).
   * @private
   * @type {Object.<string, ol.Feature>}
   */
  this.idIndex_ = {};

  /**
   * A lookup of features without id (keyed by goog.getUid(feature)).
   * @private
   * @type {Object.<string, ol.Feature>}
   */
  this.undefIdIndex_ = {};

  /**
   * @private
   * @type {Object.<string, Array.<goog.events.Key>>}
   */
  this.featureChangeKeys_ = {};

  if (goog.isDef(options.features)) {
    this.addFeaturesInternal(options.features);
  }

};
goog.inherits(ol.source.Vector, ol.source.Source);


/**
 * Add a single feature to the source.  If you want to add a batch of features
 * at once, call {@link ol.source.Vector#addFeatures source.addFeatures()}
 * instead.
 * @param {ol.Feature} feature Feature to add.
 * @api stable
 */
ol.source.Vector.prototype.addFeature = function(feature) {
  this.addFeatureInternal(feature);
  this.changed();
};


/**
 * Add a feature without firing a `change` event.
 * @param {ol.Feature} feature Feature.
 * @protected
 */
ol.source.Vector.prototype.addFeatureInternal = function(feature) {
  var featureKey = goog.getUid(feature).toString();
  this.setupChangeEvents_(featureKey, feature);

  var geometry = feature.getGeometry();
  if (goog.isDefAndNotNull(geometry)) {
    var extent = geometry.getExtent();
    this.rBush_.insert(extent, feature);
  } else {
    this.nullGeometryFeatures_[featureKey] = feature;
  }

  this.addToIndex_(featureKey, feature);
  this.dispatchEvent(
      new ol.source.VectorEvent(ol.source.VectorEventType.ADDFEATURE, feature));
};


/**
 * @param {string} featureKey
 * @param {ol.Feature} feature
 * @private
 */
ol.source.Vector.prototype.setupChangeEvents_ = function(featureKey, feature) {
  goog.asserts.assert(!(featureKey in this.featureChangeKeys_));
  this.featureChangeKeys_[featureKey] = [
    goog.events.listen(feature,
        goog.events.EventType.CHANGE,
        this.handleFeatureChange_, false, this),
    goog.events.listen(feature,
        ol.ObjectEventType.PROPERTYCHANGE,
        this.handleFeatureChange_, false, this)
  ];
};


/**
 * @param {string} featureKey
 * @param {ol.Feature} feature
 * @private
 */
ol.source.Vector.prototype.addToIndex_ = function(featureKey, feature) {
  var id = feature.getId();
  if (goog.isDef(id)) {
    this.idIndex_[id.toString()] = feature;
  } else {
    goog.asserts.assert(!(featureKey in this.undefIdIndex_),
        'Feature already added to the source');
    this.undefIdIndex_[featureKey] = feature;
  }
};


/**
 * Add a batch of features to the source.
 * @param {Array.<ol.Feature>} features Features to add.
 * @api stable
 */
ol.source.Vector.prototype.addFeatures = function(features) {
  this.addFeaturesInternal(features);
  this.changed();
};


/**
 * Add features without firing a `change` event.
 * @param {Array.<ol.Feature>} features Features.
 * @protected
 */
ol.source.Vector.prototype.addFeaturesInternal = function(features) {
  var featureKey, i, length, feature;
  var extents = [];
  var validFeatures = [];
  for (i = 0, length = features.length; i < length; i++) {
    feature = features[i];
    featureKey = goog.getUid(feature).toString();
    this.setupChangeEvents_(featureKey, feature);

    var geometry = feature.getGeometry();
    if (goog.isDefAndNotNull(geometry)) {
      var extent = geometry.getExtent();
      extents.push(extent);
      validFeatures.push(feature);
    } else {
      this.nullGeometryFeatures_[featureKey] = feature;
    }
  }
  this.rBush_.load(extents, validFeatures);

  for (i = 0, length = features.length; i < length; i++) {
    feature = features[i];
    featureKey = goog.getUid(feature).toString();
    this.addToIndex_(featureKey, feature);
    this.dispatchEvent(new ol.source.VectorEvent(
        ol.source.VectorEventType.ADDFEATURE, feature));
  }
};


/**
 * Remove all features from the source.
 * @param {boolean=} opt_fast Skip dispatching of {@link removefeature} events.
 * @api stable
 */
ol.source.Vector.prototype.clear = function(opt_fast) {
  if (opt_fast) {
    for (var featureId in this.featureChangeKeys_) {
      var keys = this.featureChangeKeys_[featureId];
      goog.array.forEach(keys, goog.events.unlistenByKey);
    }
    this.featureChangeKeys_ = {};
    this.idIndex_ = {};
    this.undefIdIndex_ = {};
  } else {
    var rmFeatureInternal = this.removeFeatureInternal;
    this.rBush_.forEach(rmFeatureInternal, this);
    goog.object.forEach(this.nullGeometryFeatures_, rmFeatureInternal, this);
    goog.asserts.assert(goog.object.isEmpty(this.featureChangeKeys_));
    goog.asserts.assert(goog.object.isEmpty(this.idIndex_));
    goog.asserts.assert(goog.object.isEmpty(this.undefIdIndex_));
  }

  this.rBush_.clear();
  this.nullGeometryFeatures_ = {};

  var clearEvent = new ol.source.VectorEvent(ol.source.VectorEventType.CLEAR);
  this.dispatchEvent(clearEvent);
  this.changed();
};


/**
 * Iterate through all features on the source, calling the provided callback
 * with each one.  If the callback returns any "truthy" value, iteration will
 * stop and the function will return the same value.
 *
 * @param {function(this: T, ol.Feature): S} callback Called with each feature
 *     on the source.  Return a truthy value to stop iteration.
 * @param {T=} opt_this The object to use as `this` in the callback.
 * @return {S|undefined} The return value from the last call to the callback.
 * @template T,S
 * @api stable
 */
ol.source.Vector.prototype.forEachFeature = function(callback, opt_this) {
  return this.rBush_.forEach(callback, opt_this);
};


/**
 * Iterate through all features whose geometries contain the provided
 * coordinate, calling the callback with each feature.  If the callback returns
 * a "truthy" value, iteration will stop and the function will return the same
 * value.
 *
 * @param {ol.Coordinate} coordinate Coordinate.
 * @param {function(this: T, ol.Feature): S} callback Called with each feature
 *     whose goemetry contains the provided coordinate.
 * @param {T=} opt_this The object to use as `this` in the callback.
 * @return {S|undefined} The return value from the last call to the callback.
 * @template T,S
 */
ol.source.Vector.prototype.forEachFeatureAtCoordinate =
    function(coordinate, callback, opt_this) {
  var extent = [coordinate[0], coordinate[1], coordinate[0], coordinate[1]];
  return this.forEachFeatureInExtent(extent, function(feature) {
    var geometry = feature.getGeometry();
    goog.asserts.assert(goog.isDefAndNotNull(geometry));
    if (geometry.containsCoordinate(coordinate)) {
      return callback.call(opt_this, feature);
    } else {
      return undefined;
    }
  });
};


/**
 * Iterate through all features whose bounding box intersects the provided
 * extent (note that the feature's geometry may not intersect the extent),
 * calling the callback with each feature.  If the callback returns a "truthy"
 * value, iteration will stop and the function will return the same value.
 *
 * If you are interested in features whose geometry intersects an extent, call
 * the {@link ol.source.Vector#forEachFeatureIntersectingExtent
 * source.forEachFeatureIntersectingExtent()} method instead.
 *
 * @param {ol.Extent} extent Extent.
 * @param {function(this: T, ol.Feature): S} callback Called with each feature
 *     whose bounding box intersects the provided extent.
 * @param {T=} opt_this The object to use as `this` in the callback.
 * @return {S|undefined} The return value from the last call to the callback.
 * @template T,S
 * @api
 */
ol.source.Vector.prototype.forEachFeatureInExtent =
    function(extent, callback, opt_this) {
  return this.rBush_.forEachInExtent(extent, callback, opt_this);
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {number} resolution Resolution.
 * @param {function(this: T, ol.Feature): S} f Callback.
 * @param {T=} opt_this The object to use as `this` in `f`.
 * @return {S|undefined}
 * @template T,S
 */
ol.source.Vector.prototype.forEachFeatureInExtentAtResolution =
    function(extent, resolution, f, opt_this) {
  return this.forEachFeatureInExtent(extent, f, opt_this);
};


/**
 * Iterate through all features whose geometry intersects the provided extent,
 * calling the callback with each feature.  If the callback returns a "truthy"
 * value, iteration will stop and the function will return the same value.
 *
 * If you only want to test for bounding box intersection, call the
 * {@link ol.source.Vector#forEachFeatureInExtent
 * source.forEachFeatureInExtent()} method instead.
 *
 * @param {ol.Extent} extent Extent.
 * @param {function(this: T, ol.Feature): S} callback Called with each feature
 *     whose geometry intersects the provided extent.
 * @param {T=} opt_this The object to use as `this` in the callback.
 * @return {S|undefined} The return value from the last call to the callback.
 * @template T,S
 * @api
 */
ol.source.Vector.prototype.forEachFeatureIntersectingExtent =
    function(extent, callback, opt_this) {
  return this.forEachFeatureInExtent(extent,
      /**
       * @param {ol.Feature} feature Feature.
       * @return {S|undefined}
       * @template S
       */
      function(feature) {
        var geometry = feature.getGeometry();
        goog.asserts.assert(goog.isDefAndNotNull(geometry));
        if (geometry.intersectsExtent(extent)) {
          var result = callback.call(opt_this, feature);
          if (result) {
            return result;
          }
        }
      });
};


/**
 * Get all features on the source.
 * @return {Array.<ol.Feature>} Features.
 * @api stable
 */
ol.source.Vector.prototype.getFeatures = function() {
  var features = this.rBush_.getAll();
  if (!goog.object.isEmpty(this.nullGeometryFeatures_)) {
    goog.array.extend(
        features, goog.object.getValues(this.nullGeometryFeatures_));
  }
  return features;
};


/**
 * Get all features whose geometry intersects the provided coordinate.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @return {Array.<ol.Feature>} Features.
 * @api stable
 */
ol.source.Vector.prototype.getFeaturesAtCoordinate = function(coordinate) {
  var features = [];
  this.forEachFeatureAtCoordinate(coordinate, function(feature) {
    features.push(feature);
  });
  return features;
};


/**
 * @param {ol.Extent} extent Extent.
 * @return {Array.<ol.Feature>} Features.
 */
ol.source.Vector.prototype.getFeaturesInExtent = function(extent) {
  return this.rBush_.getInExtent(extent);
};


/**
 * Get the closest feature to the provided coordinate.
 * @param {ol.Coordinate} coordinate Coordinate.
 * @return {ol.Feature} Closest feature.
 * @api stable
 */
ol.source.Vector.prototype.getClosestFeatureToCoordinate =
    function(coordinate) {
  // Find the closest feature using branch and bound.  We start searching an
  // infinite extent, and find the distance from the first feature found.  This
  // becomes the closest feature.  We then compute a smaller extent which any
  // closer feature must intersect.  We continue searching with this smaller
  // extent, trying to find a closer feature.  Every time we find a closer
  // feature, we update the extent being searched so that any even closer
  // feature must intersect it.  We continue until we run out of features.
  var x = coordinate[0];
  var y = coordinate[1];
  var closestFeature = null;
  var closestPoint = [NaN, NaN];
  var minSquaredDistance = Infinity;
  var extent = [-Infinity, -Infinity, Infinity, Infinity];
  this.rBush_.forEachInExtent(extent,
      /**
       * @param {ol.Feature} feature Feature.
       */
      function(feature) {
        var geometry = feature.getGeometry();
        goog.asserts.assert(goog.isDefAndNotNull(geometry));
        var previousMinSquaredDistance = minSquaredDistance;
        minSquaredDistance = geometry.closestPointXY(
            x, y, closestPoint, minSquaredDistance);
        if (minSquaredDistance < previousMinSquaredDistance) {
          closestFeature = feature;
          // This is sneaky.  Reduce the extent that it is currently being
          // searched while the R-Tree traversal using this same extent object
          // is still in progress.  This is safe because the new extent is
          // strictly contained by the old extent.
          var minDistance = Math.sqrt(minSquaredDistance);
          extent[0] = x - minDistance;
          extent[1] = y - minDistance;
          extent[2] = x + minDistance;
          extent[3] = y + minDistance;
        }
      });
  return closestFeature;
};


/**
 * Get the extent of the features currently in the source.
 * @return {ol.Extent} Extent.
 * @api stable
 */
ol.source.Vector.prototype.getExtent = function() {
  return this.rBush_.getExtent();
};


/**
 * Get a feature by its identifier (the value returned by feature.getId()).
 * Note that the index treats string and numeric identifiers as the same.  So
 * `source.getFeatureById(2)` will return a feature with id `'2'` or `2`.
 *
 * @param {string|number} id Feature identifier.
 * @return {ol.Feature} The feature (or `null` if not found).
 * @api stable
 */
ol.source.Vector.prototype.getFeatureById = function(id) {
  var feature = this.idIndex_[id.toString()];
  return goog.isDef(feature) ? feature : null;
};


/**
 * @param {goog.events.Event} event Event.
 * @private
 */
ol.source.Vector.prototype.handleFeatureChange_ = function(event) {
  var feature = /** @type {ol.Feature} */ (event.target);
  var featureKey = goog.getUid(feature).toString();
  var geometry = feature.getGeometry();
  if (!goog.isDefAndNotNull(geometry)) {
    if (!(featureKey in this.nullGeometryFeatures_)) {
      this.rBush_.remove(feature);
      this.nullGeometryFeatures_[featureKey] = feature;
    }
  } else {
    var extent = geometry.getExtent();
    if (featureKey in this.nullGeometryFeatures_) {
      delete this.nullGeometryFeatures_[featureKey];
      this.rBush_.insert(extent, feature);
    } else {
      this.rBush_.update(extent, feature);
    }
  }
  var id = feature.getId();
  var removed;
  if (goog.isDef(id)) {
    var sid = id.toString();
    if (featureKey in this.undefIdIndex_) {
      delete this.undefIdIndex_[featureKey];
      this.idIndex_[sid] = feature;
    } else {
      if (this.idIndex_[sid] !== feature) {
        removed = this.removeFromIdIndex_(feature);
        goog.asserts.assert(removed,
            'Expected feature to be removed from index');
        this.idIndex_[sid] = feature;
      }
    }
  } else {
    if (!(featureKey in this.undefIdIndex_)) {
      removed = this.removeFromIdIndex_(feature);
      goog.asserts.assert(removed,
          'Expected feature to be removed from index');
      this.undefIdIndex_[featureKey] = feature;
    } else {
      goog.asserts.assert(this.undefIdIndex_[featureKey] === feature);
    }
  }
  this.changed();
  this.dispatchEvent(new ol.source.VectorEvent(
      ol.source.VectorEventType.CHANGEFEATURE, feature));
};


/**
 * @return {boolean} Is empty.
 */
ol.source.Vector.prototype.isEmpty = function() {
  return this.rBush_.isEmpty() &&
      goog.object.isEmpty(this.nullGeometryFeatures_);
};


/**
 * @param {ol.Extent} extent Extent.
 * @param {number} resolution Resolution.
 * @param {ol.proj.Projection} projection Projection.
 */
ol.source.Vector.prototype.loadFeatures = goog.nullFunction;


/**
 * Remove a single feature from the source.  If you want to remove all features
 * at once, use the {@link ol.source.Vector#clear source.clear()} method
 * instead.
 * @param {ol.Feature} feature Feature to remove.
 * @api stable
 */
ol.source.Vector.prototype.removeFeature = function(feature) {
  var featureKey = goog.getUid(feature).toString();
  if (featureKey in this.nullGeometryFeatures_) {
    delete this.nullGeometryFeatures_[featureKey];
  } else {
    this.rBush_.remove(feature);
  }
  this.removeFeatureInternal(feature);
  this.changed();
};


/**
 * Remove feature without firing a `change` event.
 * @param {ol.Feature} feature Feature.
 * @protected
 */
ol.source.Vector.prototype.removeFeatureInternal = function(feature) {
  var featureKey = goog.getUid(feature).toString();
  goog.asserts.assert(featureKey in this.featureChangeKeys_);
  goog.array.forEach(this.featureChangeKeys_[featureKey],
      goog.events.unlistenByKey);
  delete this.featureChangeKeys_[featureKey];
  var id = feature.getId();
  if (goog.isDef(id)) {
    delete this.idIndex_[id.toString()];
  } else {
    delete this.undefIdIndex_[featureKey];
  }
  this.dispatchEvent(new ol.source.VectorEvent(
      ol.source.VectorEventType.REMOVEFEATURE, feature));
};


/**
 * Remove a feature from the id index.  Called internally when the feature id
 * may have changed.
 * @param {ol.Feature} feature The feature.
 * @return {boolean} Removed the feature from the index.
 * @private
 */
ol.source.Vector.prototype.removeFromIdIndex_ = function(feature) {
  var removed = false;
  for (var id in this.idIndex_) {
    if (this.idIndex_[id] === feature) {
      delete this.idIndex_[id];
      removed = true;
      break;
    }
  }
  return removed;
};



/**
 * @classdesc
 * Events emitted by {@link ol.source.Vector} instances are instances of this
 * type.
 *
 * @constructor
 * @extends {goog.events.Event}
 * @implements {oli.source.VectorEvent}
 * @param {string} type Type.
 * @param {ol.Feature=} opt_feature Feature.
 */
ol.source.VectorEvent = function(type, opt_feature) {

  goog.base(this, type);

  /**
   * The feature being added or removed.
   * @type {ol.Feature|undefined}
   * @api stable
   */
  this.feature = opt_feature;

};
goog.inherits(ol.source.VectorEvent, goog.events.Event);
