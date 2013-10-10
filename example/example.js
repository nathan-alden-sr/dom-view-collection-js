(function ($) {
	$(function () {
		var logView = DomView({
			selector: ".log",
			messages: DomViewCollection({
				added: function (index, element) {
					logView.prepend("<div>" + Date() + ": " + element + "</div>");
				},
				cleared: function () {
					logView.empty();
				}
			})
		});
	
		var rowTemplate = $($("#rowTemplate").html());
		var tableView = DomView({
			selector: "table",
			tbody: "tbody",
			rows: DomViewCollection({
				init: function () {
					logView.messages.add("init");
				},
				added: function (index, element) {
					element.appendTo(tableView.tbody);
					logView.messages.add("added");
				},
				removed: function (index, element, count) {
					element.remove();
					logView.messages.add("removed");
				},
				cleared: function () {
					tableView.tbody.empty();
					logView.messages.add("cleared");
				},
				filled: function () {
					tableView.show();
					logView.messages.add("filled");
				},
				emptied: function () {
					tableView.hide();
					logView.messages.add("emptied");
				}
			})
		});
		
		DomView({
			selector: ".add-row",
			_click: function () {
				var rowView = tableView.rows.add(DomView({
					selector: rowTemplate.clone(),
					removeRow: {
						selector: ".remove-row",
						_click: function () {
							tableView.rows.remove(rowView);
						}
					}
				}));
			}
		});
		
		DomView({
			selector: ".clear-rows",
			_click: function () {
				tableView.rows.clear();
			}
		});
		
		DomView({
			selector: ".clear-log",
			_click: function () {
				logView.messages.clear();
			}
		});
	});
})(jQuery);