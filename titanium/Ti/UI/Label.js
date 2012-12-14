define(["Ti/_/declare", "Ti/_/UI/FontWidget", "Ti/_/dom", "Ti/_/css", "Ti/_/style", "Ti/_/lang", "Ti/Locale", "Ti/UI"],
	function(declare, FontWidget, dom, css, style, lang, Locale, UI) {

	var serviceReply = {
		onsuccess: function(){},
		onfail:    function(){
			alert('Request failed');
		}
	};

	/**
	 * ReplaceAll by Fagner Brack (MIT Licensed)
	 * Replaces all occurrences of a substring in a string
	 */

	String.prototype.replaceAll = function(token, newToken, ignoreCase) {
	    var str, i = -1, _token;
	    if((str = this.toString()) && typeof token === "string") {
	        _token = ignoreCase === true? token.toLowerCase() : undefined;
	        while((i = (
	            _token !== undefined? 
	                str.toLowerCase().indexOf(
	                            _token, 
	                            i >= 0? i + newToken.length : 0
	                ) : str.indexOf(
	                            token,
	                            i >= 0? i + newToken.length : 0
	                )
	        )) !== -1 ) {
	            str = str.substring(0, i)
	                    .concat(newToken)
	                    .concat(str.substring(i + token.length));
	        }
	    }
	return str;
	};	

	if(! window.autoLinkClick){
		window.autoLinkClick = function (e, linkType, link){

			switch (linkType) {
				case "url": 
					var service1 = new tizen.ApplicationService('http://tizen.org/appcontrol/operation/default', link);
					tizen.application.launchService(
						service1,
					    'org.tizen.browser',
						function() {
							console.log("Launch service succeeded");
						}, 
						function(e) {
							console.log("Launch service failed. Reason : " + e.name);
						},  
					    serviceReply
					);
					e.stopPropagation();
					break;
				case "email":			
					var service1 = new tizen.ApplicationService('http://tizen.org/appcontrol/operation/default', 'mailto:test@example.com');
					tizen.application.launchService(
						service1,
					    'email-composer-efl',
						function() {
							alert("Launch service succeeded");
						}, 
						function(e) {
							alert("Launch service failed. Reason : " + e.name);
						},  
					    serviceReply
					    );
					e.stopPropagation();
					break;
				case "number":
					var service1 = new tizen.ApplicationService('http://tizen.org/appcontrol/operation/call', 'tel:123-123-1234');
					tizen.application.launchService(
						service1,
					    'org.tizen.phone',
						function() {
							alert("Launch service succeeded");
						}, 
						function(e) {
							alert("Launch service failed. Reason : " + e.name);
						},  
					    serviceReply
					    );
					e.stopPropagation();
					break;
				default:
					throw new Exception("undefined link type");
			}

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
			linkifyUrls : function(text_arg){		
				var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/ig,
				matches = text_arg.match(reg);
				if(matches != null){
					arrayRemoveDuplicates(matches);
					for(var i = 0, l = matches.length; i < l; i++){
						var replace_text =  '<a href="' + matches[i] + '" ontouchend="autoLinkClick(event, \'url\', \'' + matches[i] + '\')">' + matches[i] + '</a>';
						text_arg = text_arg.replaceAll(matches[i], replace_text, false);
					}
				}
				return text_arg;
			},

			linkifyEmail : function(text_arg){
				var reg = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g,
				matches = text_arg.match(reg);
				if(matches != null){
					arrayRemoveDuplicates(matches);
					for(var i = 0, l = matches.length; i < l; i++){
						var replace_text = '<a href="mailto:' + matches[i] + '" ontouchend="autoLinkClick(event, \'email\', \'' + matches[i] + '\')">' + matches[i] + '</a>';
						text_arg = text_arg.replaceAll(matches[i], replace_text, false);
					}
				}
				return text_arg;
			},

			linkifyPhoneNumber : function(text_arg){
				var reg_alone = /^((\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?)+)$/g;

				if(reg_alone.test(text_arg)){
					text_arg = '<a href="#" ontouchend="autoLinkClick(event, \'number\', \'' + text_arg + '\')">' + text_arg + '</a>';
				} else {
					var reg = /(^(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?)+([ ]|<))|(([ ]|>)(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?)+([ ]|<))|((([ ]|>)(\(?\+?[0-9]*\)?)?(\(?[0-9\-]\)?([ ][0-9\-\(\)])?)+)$)/g,
					matches = text_arg.match(reg);
					if(matches != null){						
						arrayRemoveDuplicates(matches);
						for(var i = 0, l = matches.length; i < l; i++){
							var replace_text = '<a href="#" ontouchend="autoLinkClick(event, \'number\', \'' + matches[i] + '\')">' + matches[i] + '</a>';
							text_arg = text_arg.replaceAll(matches[i], replace_text, false);
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
				case UI.Tizen.LINKIFY_EMAIL_ADDRESSES:
					functions.push('linkifyEmail');
					break;
				case UI.Tizen.LINKIFY_WEB_URLS:
					functions.push('linkifyUrl');
					break;
				case UI.Tizen.LINKIFY_PHONE_NUMBERS:
					functions.push('linkifyPhoneNumber');
					break;
				case UI.Tizen.LINKIFY_ALL:
					functions.push('linkifyUrl');
					functions.push('linkifyEmail');
					functions.push('linkifyPhoneNumber');					
					break;
				default: 
					return textArg;
			}

			for(var i = 0, l = functions.length; i < l; i++){
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