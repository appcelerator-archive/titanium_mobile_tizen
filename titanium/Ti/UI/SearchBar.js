define(["Ti/_/declare", "Ti/UI", "Ti/_/UI/Widget"],
	function(declare, UI, Widget) {

	var on = require.on;

	return declare("Ti.UI.SearchBar", Widget, {

		constructor: function(args) {
			var self = this,
				f = this._field = UI.createTextField({
					width: UI.FILL,
					height: args.height ? args.height : '43px'
				}),
				contentContainer = this._container = UI.createView(args),				
				b = this._cancelButton = UI.createButton({
					width: '43px',
					height: args.height ? args.height : '43px',
					backgroundImage: 'themes/default/UI/SearchBar/close.png',
					visible: args.showCancel ? args.showCancel : false
				});
			
			contentContainer.layout = UI._LAYOUT_CONSTRAINING_HORIZONTAL;
			
			contentContainer.add(f);
			contentContainer.add(b);
			this._add(contentContainer);
			
			on(b, 'click', function(e) {
				f.value = "";
				self.fireEvent("cancel");
			});
			
			on(f, 'return', function(e){
				self.fireEvent('return');
			});
			
			on(f, 'change', function(e){
				self.fireEvent('change');
			});
			
			on(f, 'focus', function(e){
				self.fireEvent('focus');
			});
			
			on(f, 'blur', function(e){
				self.fireEvent('blur');
			});			
		},

		destroy: function() {
			this._field.destroy();
			this._cancelButton.destroy();
		},
		
		blur: function() {
			this._field.blur();
		},

		focus: function() {
			this._field.focus();
		},

		cancel: function() {
			this._field.value = "";
		},
						
		properties: {
			hintText: {
				set: function(value) {
					this._field.hintText = value;
					return value;
				},
				get: function() {
					return this._field.hintText;
				},
				value: function() {
					return this._field.hintText;
				}
			},
			
			keyboardType: {
				set: function(value) {
					this._field.keyboardType = value;
					return value;
				},
				get: function() {
					return this._field.keyboardType;
				},
				value: function() {
					return this._field.keyboardType;
				}
			},
			
			showCancel: {
				set: function(value) {
					this._cancelButton.visible = value;
					return value;
				},
				value: false
			},
			
			value: {
				set: function(value) {
					this._field.value = value;
					return value;
				},
				get: function() {
					return this._field.value;
				},
				value: function() {
					return this._field.value;
				}
			}
		}

	});

});
