define(["Ti/_/declare", "Ti/_/UI/FontWidget", "Ti/_/dom", "Ti/_/css", "Ti/_/style", "Ti/_/lang", "Ti/Locale", "Ti/UI"],
	function(declare, FontWidget, dom, css, style, lang, Locale, UI) {

	var serviceReply = {
		onsuccess: function(){},
		onfail:    function(){
			console.log('Request failed');
		}
	};

	var replaceAll = function(str, token, newToken) {
		var i = -1;
		if(typeof token === "string") {
			while((i = (str.indexOf(token, i >= 0? i + newToken.length : 0))) !== -1 ) {
				str = str.substring(0, i)
					.concat(newToken)
					.concat(str.substring(i + token.length));
				}
		}
		return str;
	};

	if(! window.autoLinkClick){
		window.autoLinkClick = function (e, ap_service, ap_id, link){
			var service = new tizen.ApplicationService(ap_service, link);
			tizen.application.launchService(
				service,
				ap_id,
				function() {}, 
				function(e) {},  
				serviceReply
			);
			e.stopPropagation();
	  	}
	}	

	var setStyle = style.set,
		unitize = dom.unitize,
		tabStop = 2,

		arrayRemoveDuplicates = function(var_array){
			var_array.sort();
			var i = 0;
			var_array[0] = var_array[0].trim().replace(/<|>/, '');
			while(i < (var_array.length - 1)){
				var_array[i + 1] = var_array[i + 1].trim().replace(/<|>/, '');
				if(var_array[i] == var_array[i + 1]){
					var_array.splice(i + 1, 1);
				} else {
					i++;
				}
			}
		},

		linkifyFunctions = {
			linkifyUrl : function(text_arg){		
				var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/ig,
				matches = text_arg.match(reg);
				if(matches != null){
					arrayRemoveDuplicates(matches);
					var replace_text =  '<a href="[$1]" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/default\', \'org.tizen.browser\', \'[$1]\')">[$1]</a>';
					var i = 0,
						l = matches.length;
					for(; i < l; i++){
						r_text = replaceAll(replace_text, '[$1]', matches[i]);
						text_arg = replaceAll(text_arg, matches[i], r_text);
					}
				}
				return text_arg;
			},

			linkifyEmail : function(text_arg){
				var reg = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g,
				matches = text_arg.match(reg);
				if(matches != null){
					arrayRemoveDuplicates(matches);
					var replace_text = '<a href="mailto:[$1]" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/default\', \'email-composer-efl\', \'mailto:[$1]\')">[$1]</a>';
					var i = 0,
						l = matches.length;
					for(; i < l; i++){
						r_text = replaceAll(replace_text, '[$1]', matches[i]);
						text_arg = replaceAll(text_arg, matches[i], r_text);
					}
				}
				return text_arg;
			},

			linkifyPhoneNumber : function(text_arg){
				var reg_alone = /^((\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,})$/g;

				if(reg_alone.test(text_arg)){
					text_arg = '<a href="#" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/call\', \'org.tizen.phone\', \'tel:' + text_arg + '\')">' + text_arg + '</a>';
				} else {
					var reg = /(^(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,}([ ]|<))|(([ ]|>)(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,}([ ]|<))|((([ ]|>)(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?){7,})$)/g,
					matches = text_arg.match(reg);
					if(matches != null){						
						arrayRemoveDuplicates(matches);
						var replace_text = '<a href="#" ontouchend="autoLinkClick(event, \'http://tizen.org/appcontrol/operation/call\', \'org.tizen.phone\', \'tel:[$1]\')">[$1]</a>';
						var i = 0,
							l = matches.length;
						for(; i < l; i++){
							r_text = replaceAll(replace_text, '[$1]', matches[i]);
							text_arg = replaceAll(text_arg, matches[i], r_text);
						}
					}
				}
				return text_arg;
			}
		},
		
		textPost = {
			post: "_setText"
		};

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

		_linkifyText : function(textArg){
			
			var	functions = [];
			switch(this.autoLink){
				case UI.LINKIFY_EMAIL_ADDRESSES:
					functions.push('linkifyEmail');
					break;
				case UI.LINKIFY_WEB_URLS:
					functions.push('linkifyUrl');
					break;
				case UI.LINKIFY_PHONE_NUMBERS:
					functions.push('linkifyPhoneNumber');
					break;
				case UI.LINKIFY_ALL:
					functions.push('linkifyUrl');
					functions.push('linkifyEmail');
					functions.push('linkifyPhoneNumber');					
					break;
				default: 
					return textArg;
			}

			var i = 0,
				l = functions.length;
			for(; i < l; i++){
				textArg = linkifyFunctions[functions[i]](textArg);
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