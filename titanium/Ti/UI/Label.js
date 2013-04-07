define(["Ti/_/declare", "Ti/_/UI/FontWidget", "Ti/_/dom", "Ti/_/css", "Ti/_/style", "Ti/_/lang", "Ti/Locale", "Ti/UI"],
	function(declare, FontWidget, dom, css, style, lang, Locale, UI) {

	var setStyle = style.set,
		unitize = dom.unitize,
		tabStop = 2,
		textPost = {
			post: "_setText"
		},
		linkifyArguments = {
			// Regular expression to detect URLs, and replacement pattern that makes them clickable.
			linkifyUrl: {
				reg: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/ig,
				replace_text: '<a href="#" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/view\', null, \'[$1]\')">[$1]</a>'
			},

			// Regular expression to detect email addresses, and replacement pattern that makes them clickable.
			linkifyEmail: {
				reg: /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g,
				replace_text: '<a href="#" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/send\', \'org.tizen.email\', \'\', \'to\', \'[$1]\') ">[$1]</a>'
			},

			// Regular expression to detect phone numbers, and replacement pattern that makes them clickable.
			linkifyPhoneNumber: {
				reg: /(^(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,}([ ]|<))|(([ ]|>)(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,}([ ]|<))|((([ ]|>)(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,})$)|(^((\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,})$)/g,
				replace_text: '<a href="#" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/call\', \'org.tizen.phone\', null, \'tel\', \'[$1]\')">[$1]</a>'
			}
		};

		// "arrayRemoveDuplicates" takes an array and removes duplicate (identical) entries from the array.
		// A side effect is that array becomes sorted.

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

		function replaceAll(str, token, newToken) {
			return str.split(token).join(newToken);
		}

		// "linkifyFunction" transforms the text of a label by automatically inserting HTML code to create clickable links, 
		// where appropriate.
		//
		// The general algorithm is find all matches using a regular expression (where a match is an URL,
		// an email address, etc), and replace the matching strings with HTML code that makes the matching text clickable.
		// 
		// When an array of matches is produced, duplicate entries are filtered out. Reason: consider the title
		// "Hello http://google.com world http://google.com". Each of the matches ("http://google.com") will be 
		// replaced by the linkified version of the entry. If we allow duplicates, each of the matches will be 
		// replaced twice, which will produce invalid "nested" links.
		//
		// - text_arg is the string to be transformed. 
		// - linkify_arg contains the regexp and the substitution pattern for this operation.

		function linkifyFunction(text_arg, linkify_arg){
			var i = 0,
				matches = text_arg.match(linkify_arg.reg),	// array of matches
				l, r_text;

			if (matches) {
				arrayRemoveDuplicates(matches);
				l = matches.length;

				for(; i < l; i++) {
					// Generate replacement text from replacement pattern
					r_text = replaceAll(linkify_arg.replace_text, '[$1]', matches[i]);

					// Replace all occurrences of the current match with the replacement text
					text_arg = replaceAll(text_arg, matches[i], r_text);
				}
			}
			return text_arg;
		}

	if (!window.autoLinkClick) {
		// Install link click handler in the HTML document.
		window.autoLinkClick = function (e, ap_service, ap_id, link, key, value) {
			var service;
			if (key && value) {
				service = new tizen.ApplicationControl(
					ap_service,
					link,
					null,
					null,
					[new tizen.ApplicationControlData(key, [value])]
				);
			} else {
				service = new tizen.ApplicationControl(ap_service, link);
			}

			tizen.application.launchAppControl(
				service,
				ap_id,
				function() {},
				function(e) {Ti.API.error('launch appControl failed. Reason: ' + e.name);},
				null
			);
			e.stopPropagation();
		};
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
				args = ['linkifyUrl', 'linkifyEmail', 'linkifyPhoneNumber'],
				l = args.length,
				autoLink = this.autoLink;

			if (autoLink) {
				// "autoLink" is a bit mask. The loop below removes entries from the "args" array
				// if there is no corresponding bit in "autoLink".
				for (; i < l; i++) {
					(autoLink & 1) === 0 ? args.splice(j, 1) : j++;
					autoLink >>= 1;
				}

				// Apply the desired linkification functions to "textArg".
				for(i = 0, l = args.length; i < l; i++) {
					textArg = linkifyFunction(textArg, linkifyArguments[args[i]]);
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
			// Make links clickable
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