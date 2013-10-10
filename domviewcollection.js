// DOMViewCollection.js 0.9.0

// Created by Nathan Alden, Sr.
// http://projects.nathanalden.com

// Licensed under the Open Software License 2.1
// http://opensource.org/licenses/osl-2.1.php

(function ($, undefined) {
	window.DomViewCollection = function (options) {
		options = $.extend({}, window.DomViewCollection.defaults, options);

		var elements = [];
		var collection = {
			get: function () {
				return elements.slice(0);
			},
			count: function () {
				return elements.length;
			},
			insert: function (index, element) {
				if (index < 0 || index > elements.length) {
					return undefined;
				}
			
				var filling = elements.length === 0;
				
				elements.splice(index, 0, element);
				
				this.options.added.call(this, index, element);
				if (filling) {
					this.options.filled.call(this, elements.length);
				}
				
				return element;
			},
			add: function (element) {
				return this.insert(elements.length, element);
			},
			addMany: function (elements) {
				if (!$.isArray(elements)) {
					throw "Must provide an array";
				}
				for (var i = 0; i < elements.length; i++) {
					this.add(elements[i]);
				}
			},
			removeAtIndex: function (index) {
				if (index < 0 || index >= elements.length) {
					return undefined;
				}
				
				var emptying = elements.length === 1;
				var removedElement = elements.splice(index, 1);
					
				this.options.removed.call(this, index, removedElement[0], elements.length);
				if (emptying) {
					this.options.emptied.call(this);
				}
				
				return removedElement;
			},
			remove: function (element) {
				return this.removeAtIndex(elements.indexOf(element));
			},
			removeMany: function (elements) {
				if (!$.isArray(elements)) {
					throw "Must provide an array";
				}
				for (var i = 0; i < elements.length; i++) {
					this.remove(elements[i]);
				}
			},
			clear: function () {
				var emptying = elements.length > 0;
				var removedElements = this.get();
				
				elements.length = 0;
				
				this.options.cleared.call(this);
				if (emptying) {
					this.options.emptied.call(this);
				}
				
				return removedElements;
			},
			options: options
		};
		
		options.init.call(collection);
		
		return collection;
	};
	
	window.DomViewCollection.defaults = {
		init: $.noop,
		added: $.noop,
		removed: $.noop,
		cleared: $.noop,
		filled: $.noop,
		emptied: $.noop
	};
})(jQuery);