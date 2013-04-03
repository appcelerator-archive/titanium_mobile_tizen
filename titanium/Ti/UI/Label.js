define(["Ti/_/declare", "Ti/_/UI/FontWidget", "Ti/_/dom", "Ti/_/css", "Ti/_/style", "Ti/_/lang", "Ti/Locale", "Ti/UI"],
	function(declare, FontWidget, dom, css, style, lang, Locale, UI) {
	
	var setStyle = style.set,
		unitize = dom.unitize,
		tabStop = 2,
		textPost = {
			post: "_setText"
		};

		function arrayRemoveDuplicates(var_array) {
			var i = 0;
			var_array.sort();
			var_array[0] = var_array[0].trim().replace(/<|>/, '');
			while(i < (var_array.length - 1)) {
				var_array[i + 1] = var_array[i + 1].trim().replace(/<|>/, '');
				if (var_array[i] === var_array[i + 1]) {
					var_array.splice(i + 1, 1);
				} else {
					i++;
				}
			}
		}

		var linkifyFunctions = {
			linkifyUrl : function(text_arg) {
				var i = 0,
					reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/ig,
					replace_text =  '<a href="#" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/view\', \'org.tizen.browser\', \'[$1]\')">[$1]</a>',
					matches = text_arg.match(reg),
					l, r_text;
				if (matches) {
					arrayRemoveDuplicates(matches);
					l = matches.length;
					for(; i < l; i++) {
						r_text = replace_text.split('[$1]').join(matches[i]);
						text_arg = text_arg.split(matches[i]).join(r_text);
					}
				}
				return text_arg;
			},

			linkifyEmail : function(text_arg) {
				var i = 0,
					replace_text = '<a href="#" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/compose\', \'tizen.email\', \'\', \'to\', \'[$1]\') ">[$1]</a>',
					reg = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g,
					matches = text_arg.match(reg),
					l, r_text;
				if (matches) {
					arrayRemoveDuplicates(matches);
					l = matches.length;
					for(; i < l; i++) {
						r_text = replace_text.split('[$1]').join(matches[i]);
						text_arg = text_arg.split(matches[i]).join(r_text);
					}
				}
				return text_arg;
			},

			linkifyPhoneNumber : function(text_arg) {
				var i = 0,
					reg_alone = /^((\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,})$/g,
					reg = /(^(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,}([ ]|<))|(([ ]|>)(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,}([ ]|<))|((([ ]|>)(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,})$)/g,
					matches,
					replace_text = '<a href="#" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/call\', \'org.tizen.phone\',\'null\', \'tel\', \'[$1]\')">[$1]</a>',
					l, r_text;

				if (reg_alone.test(text_arg)) {
					text_arg = '<a href="#" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/dial\', \'org.tizen.phone\', \'null\', \'tel\', \'[$1]\')">' + text_arg + '</a>';
				} else {
					matches = text_arg.match(reg);
					if (matches) {
						arrayRemoveDuplicates(matches);
						l = matches.length;
						for(; i < l; i++) {
							r_text = replace_text.split('[$1]').join(matches[i]);
							text_arg = text_arg.split(matches[i]).join(r_text);
						}
					}
				}
				return text_arg;
			}
		};

	if (!window.autoLinkClick) {
		window.autoLinkClick = function (e, ap_service, ap_id, link, key, value) {
			var service;
			if (key && value) {
				service = new tizen.ApplicationControl(
					ap_service,
					link,
					null,
					null,
					[new tizen.ApplicationControlData(key, [value])]
				)
			} else {
				service = new tizen.ApplicationControl(ap_service, link);
			}
			tizen.application.launchAppControl(
				service,
				null,
				function() {}, 
				function(e) {Ti.API.error('launch appControl failed. Reason: ' + e.name)},  
				null
			);
			e.stopPropagation();
	  	}
	}

	return declare("Ti.UI.Label", FontWidget, {

		constructor: function() {
			this._add(this._textContainer = UI.createView({
				width: UI.INHERIT,
				height: UI.SIZE,
				center: {y: "50%"}
			}));
			
			var self = this,
				textContainerDomNode = this._textContainerDomNode = this._textContainer.domNode;
			self._textContainer._getContentSize = function(width, height) {
				var text = self._textContainerDomNode.innerHTML,
					measuredSize = self._measureText(text, textContainerDomNode, self._hasSizeWidth() ? void 0 : width);
				return {
					width: measuredSize.width,
					height: measuredSize.height
				};
			};
			
			this._addStyleableDomNode(textContainerDomNode);
			this.wordWrap = true;
		},

		_defaultWidth: UI.SIZE,

		_defaultHeight: UI.SIZE,

		_linkifyText : function(textArg) {
			var	i = 0,
				j = 0,
				functions = ['linkifyUrl', 'linkifyEmail', 'linkifyPhoneNumber'],
				l = functions.length,
				autoLink = this.autoLink;
			if (autoLink) {
				for (; i < l; i++) {
					(autoLink & 1) === 0 ? functions.splice(j, 1) : j++;
					autoLink >>= 1;
				}
				for(i = 0, l = functions.length; i < l; i++) {
					textArg = linkifyFunctions[functions[i]](textArg);
				}
			}
			return textArg;
		},

		_getText: function() {
			var i,
				lineStartIndex = 0,
				currentIndex = 0,
				currentTabIndex,
				text = Locale._getString(this.textid, this.text);

			// Handle null, undefined, etc edge case
			if (text === void 0) {
				return "";
			}
			text += "";

			// Convert \t and \n to &nbsp;'s and <br/>'s
			while (currentIndex < text.length) {
				if (text[currentIndex] === '\t') {
					var tabSpaces = "",
						numSpacesToInsert = tabStop - (currentTabIndex) % tabStop;
					for (i = 0; i < numSpacesToInsert; i++) {
						tabSpaces += "&nbsp;";
					}
					text = text.substring(0, currentIndex) + tabSpaces + text.substring(currentIndex + 1);
					currentIndex += tabSpaces.length;
					currentTabIndex += numSpacesToInsert;
				} else if (text[currentIndex] === '\n') {
					text = text.substring(0, currentIndex) + "<br/>" + text.substring(currentIndex + 1);
					currentIndex += 5;
					lineStartIndex = currentIndex;
					currentTabIndex = 0;
				} else {
					currentIndex++;
					currentTabIndex++;
				}
			}

			text.match(/<br\/>$/) && (text += "&nbsp;");
			return text;
		},

		_setText: function() {
			this._textContainerDomNode.innerHTML = this._linkifyText(this._getText());
			this._hasSizeDimensions() && this._triggerLayout();
		},

		_setTextShadow: function() {
			var shadowColor = this.shadowColor && this.shadowColor !== "" ? this.shadowColor : void 0;
			setStyle(
				this._textContainerDomNode,
				"textShadow",
				this.shadowOffset || shadowColor
					? (this.shadowOffset ? unitize(this.shadowOffset.x) + " " + unitize(this.shadowOffset.y) : "0px 0px") + " 0.1em " + lang.val(shadowColor,"black")
					: ""
			);
		},

		properties: {
			ellipsize: {
				set: function(value) {
					setStyle(this._textContainerDomNode,"textOverflow", !!value ? "ellipsis" : "clip");
					return value;
				},
				value: true
			},
			html: {
				set: function(value) {
					this._textContainerDomNode.innerHTML = value;
					this._hasSizeDimensions() && this._triggerLayout();
					return value;
				}
			},
			shadowColor: {
				post: function() {
					this._setTextShadow();
				}
			},
			shadowOffset: {
				post: function() {
					this._setTextShadow();
				}
			},
			text: textPost,
			textAlign: {
				set: function(value) {
					setStyle(this._textContainerDomNode, "textAlign", /(center|right)/.test(value) ? value : "left");
					return value;
				}
			},
			textid: textPost,
			wordWrap: {
				set: function(value) {
					setStyle(this._textContainerDomNode, "whiteSpace", !!value ? "normal" : "nowrap");
					return value;
				}
			},
			verticalAlign: {
				set: function(value) {
					var top,
						bottom,
						center = this.center || {},
						textContainer = this._textContainer;
					switch(value) {
						case UI.TEXT_VERTICAL_ALIGNMENT_TOP: top = 0; break;
						case UI.TEXT_VERTICAL_ALIGNMENT_CENTER: center.y = "50%"; break;
						case UI.TEXT_VERTICAL_ALIGNMENT_BOTTOM: bottom = 0; break;
					}
					textContainer.top = top;
					textContainer.center = center;
					textContainer.bottom = bottom;
					return value;
				},
				value: UI.TEXT_VERTICAL_ALIGNMENT_CENTER
			},

			autoLink: textPost
		}

	});

});