define(["Ti/_/declare", "Ti/_/UI/TextBox", "Ti/_/css", "Ti/_/dom", "Ti/_/lang", "Ti/_/style", "Ti/UI"],
	function(declare, TextBox, css, dom, lang, style, UI) {

	var borderStyles = ["None", "Line", "Bezel", "Rounded"];

	return declare("Ti.UI.SearchBar", TextBox, {
	
		_cancelButton: null,

		constructor: function(args) {
			var self = this;
			var f = this._field = dom.create("input", {
				autocomplete: "off",
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					width: '100%',
				}
			}, this._fieldWrapper = dom.create("span", {
				style: {
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					marginRight: '43px'
				}
			}, this.domNode));
			
			this._cancelButton = dom.create("button", {
				style: {
					background: "url('themes/default/UI/SearchBar/close.png') no-repeat 50% 50%",
					position: "absolute",
					right: '-43px',
					top: 0,
					bottom: 0,
					width: '43px'
				}			
			}, this._fieldWrapper, this.domNode);
			

			
			this._initTextBox(this._field);
			this._keyboardType();
			this.borderStyle = UI.INPUT_BORDERSTYLE_BEZEL;
			
			
			this._cancelButton.addEventListener('click', function(e){
				console.log("Cancel");
				f.value = "";
				f.blur();
				self.fireEvent("cancel");
			});
			
			this._disconnectFocusEvent = require.on(f, "focus", this, function() {			
				this._focused = 1;
				this._setInternalText(this.clearOnEdit ? "" : this._getInternalText());
			});
			this._disconnectBlurEvent = require.on(f, "blur", this, function() {
				this._focused = 0;
				this._updateInternalText();
			});
		},

		destroy: function() {
			this._disconnectFocusEvent();
			this._disconnectBlurEvent();
			TextBox.prototype.destroy.apply(this, arguments);
		},

        _defaultWidth: UI.SIZE,

        _defaultHeight: UI.SIZE,
		
		_getContentSize: function(width, height) {
			return {
				width: this._measureText(this.value, this._field, width).width + 6,
				height: this._measureText(this.value, this._field, width).height + 6
			};
		},

		_setTouchEnabled: function(value) {
			this.slider && style.set(this._field, "pointerEvents", value ? "auto" : "none");
		},

		_keyboardType: function(args) {
			var t = "text",
				args = args || {};
			if (lang.val(args.pm, this.passwordMask)) {
				t = "password";
			} else {
				switch (lang.val(args.kt, this.keyboardType)) {
					case UI.KEYBOARD_EMAIL:
						t = "email";
						break;
					case UI.KEYBOARD_NUMBER_PAD:
						t = "number";
						break;
					case UI.KEYBOARD_PHONE_PAD:
						t = "tel";
						break;
					case UI.KEYBOARD_URL:
						t = "url";
						break;
				}
			}
			this._field.type = t;
		},
		
		blur: function() {
			this._field.blur();
		},

		focus: function() {
			this._field.focus();
		},
		
		
		
		properties: {
			borderStyle: {
				set: function(value, oldValue) {
					var n = this.domNode,
						s = "TiUITextFieldBorderStyle";
					if (value !== oldValue) {
						// This code references constants Ti.UI.INPUT_BORDERSTYLE_NONE, 
						// Ti.UI.INPUT_BORDERSTYLE_LINE, Ti.UI.INPUT_BORDERSTYLE_BEZEL, and Ti.UI.INPUT_BORDERSTYLE_ROUNDED
						css.remove(n, s + borderStyles[oldValue]);
						css.add(n, s + borderStyles[value]);
					}
					return value;
				}
			},

			clearOnEdit: false,

			hintText: {
				set: function(value) {
					this._field.placeholder = value;
					return value;
				}
			},
			
			showCancel: {
				set: function(value) {
				//	this._cancelButton.style.visibility = value ? "visible" : "hidden";
					this._fieldWrapper.style.marginRight = value ? '43px' : '0';
					this._cancelButton.style.display = value ? "block" : "none";
					return value;
				}
			},

			keyboardType: {
				set: function(value) {
					this._keyboardType({ kt:value });
					return value;
				}
			},

			maxLength: {
				set: function(value) {
					value = Math.min(value|0, 0);
					dom.attr[value > 0 ? "set" : "remove"](this._field, "maxlength", value);
					return value;
				}
			},

			passwordMask: {
				value: false,
				set: function(value) {
					this._keyboardType({ pm:value });
					return value;
				}
			}
		}

	});

});
