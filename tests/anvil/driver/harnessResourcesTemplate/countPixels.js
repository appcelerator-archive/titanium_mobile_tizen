var h2c = require("h2c");

function CountPixels(){
    var allPixels;

    // The position parameter: object with properties left, top, width, height.
	// The position parameter, or any of its properties, is optional.
    
    this.countPixels = function(pixelColor, el, callback, position) {
        var options = {allowTaint:true, taintTest:false};
        var nEl = el.domNode ? el.domNode : el; 
        options.onrendered = function(canvasObject) {
                var count = 0,
                    c = canvasObject.getContext('2d'),
                    p,
                    wl = canvasObject.width,
                    hl = canvasObject.height;
                    
                if(typeof position !== 'object'){
                        position = {};
                }
                var x = position.left || 0,
                    y = position.top || 0,
                    w, h;
                if((x > wl) || (y > hl)){
                    Ti.API.info('The position of the chosen area is out off element area');
                }
                if(position.width == undefined){
                    w = wl;
                } else {
                    if((w = x + position.width) > wl){
                        w = wl
                    }
                }
                if(position.height == undefined){
                    h = hl;
                } else {
                    if((h = y + position.height) > hl){
                        h = hl
                    }
                }

                allPixels = w*h;
                for(var i = y; i < h; i++) {
                    for(var k = x; k < w; k++) {
                        p = c.getImageData(k, i, 1, 1).data;
                        p[0] == pixelColor[0] && p[1] == pixelColor[1] && p[2] == pixelColor[2] && count++;
                    }
                }
                callback(count);
        }
        h2c([nEl], options);
    };
    this.countPixelsPercentage = function(pixelColor, el, callback) {
        var elCB = function(count){
            var percentsavings = Math.round((count/allPixels) * 100); 
            callback(percentsavings);
        }
        this.countPixels(pixelColor, el, elCB);
    };
}
