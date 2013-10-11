// DOMViewCollection.js 0.9.2

// Created by Nathan Alden, Sr.
// http://projects.nathanalden.com

// Licensed under the Open Software License 2.1
// http://opensource.org/licenses/osl-2.1.php

(function ($, undefined) {
	window.DomViewCollection = function (options) {
		options = $.extend({}, window.DomViewCollection.defaults, options);

		this._elements = [];
		this.options = options;

		options.init.call(this);

		var elementsToAdd = options.elements === undefined || options.elements === null ? [] : options.elements;
		
		for (var i = 0; i < elementsToAdd.length; i++) {
			this.add(elementsToAdd[i], this);
		}
	};

	$.extend(window.DomViewCollection.prototype, {
		get: function () {
			return this._elements.slice(0);
		},
		getMapped: function () {
			return $(this.get()).map(function () { return this instanceof jQuery ? this.toArray() : this; });
		},
		count: function () {
			return this._elements.length;
		},
		insert: function (index, element, context) {
			if (index < 0 || index > this._elements.length) {
				return undefined;
			}

			var filling = this._elements.length === 0;

			if (filling && this.options.filling.call(this, context) === false) {
				return undefined;
			}
			if (this.options.adding.call(this, element, index, this._elements.length, context) === false) {
				return undefined;
			}

			var projectedElement = this.options.project.call(this, element);

			element = projectedElement === undefined || projectedElement === null ? element : projectedElement;

			this._elements.splice(index, 0, element);

			this.options.added.call(this, element, index, this._elements.length, context);
			if (filling) {
				this.options.filled.call(this, context);
			}

			return element;
		},
		add: function (element, context) {
			return this.insert(this._elements.length, element, context);
		},
		addMany: function (elements, context) {
			if (!$.isArray(elements)) {
				throw "Must provide an array";
			}
			for (var i = 0; i < elements.length; i++) {
				this.add(elements[i], context);
			}
		},
		removeAtIndex: function (index, context) {
			if (index < 0 || index >= this._elements.length) {
				return undefined;
			}

			var emptying = this._elements.length === 1;

			if (emptying && this.options.emptying.call(this, context) === false) {
				return undefined;
			}
			if (this.options.removing.call(this, this._elements[index], index, this._elements.length, context) === false) {
				return undefined;
			}

			var removedElement = this._elements.splice(index, 1);

			this.options.removed.call(this, removedElement[0], index, this._elements.length, context);
			if (emptying) {
				this.options.emptied.call(this, context);
			}

			return removedElement;
		},
		remove: function (element, context) {
			return this.removeAtIndex(this._elements.indexOf(element), context);
		},
		removeMany: function (elements, context) {
			if (!$.isArray(elements)) {
				throw "Must provide an array";
			}
			for (var i = 0; i < elements.length; i++) {
				this.remove(elements[i], context);
			}
		},
		clear: function (context) {
			var emptying = this._elements.length > 0;
			var removedElements = this.get();

			if (emptying && this.options.emptying.call(this, this._elements.length, context) === false) {
				return undefined;
			}
			if (this.options.clearing.call(this, this._elements.length, context) === false) {
				return undefined;
			}

			this._elements.length = 0;

			this.options.cleared.call(this, context);
			if (emptying) {
				this.options.emptied.call(this, context);
			}

			return removedElements;
		}
	});

	window.DomViewCollection.defaults = {
		elements: [],
		init: $.noop,
		adding: $.noop,
		project: $.noop,
		added: $.noop,
		removing: $.noop,
		removed: $.noop,
		clearing: $.noop,
		cleared: $.noop,
		filling: $.noop,
		filled: $.noop,
		emptying: $.noop,
		emptied: $.noop
	};
})(jQuery);