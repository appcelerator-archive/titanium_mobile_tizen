var h2c = require("h2c");

function CountPixels(){
    var allPixels;
    this.countPixels = function(pixelColor, el, callback) {
        var options = {allowTaint:true, taintTest:false};
        var nEl = el.domNode ? el.domNode : el; 
        options.onrendered = function(canvasObject) {
                var count = 0,
                    c = canvasObject.getContext('2d'),
                    p,
                    wl = canvasObject.width,
                    hl = canvasObject.height;
                    allPixels = wl*hl;
                    
                for(var i=0; i<wl; i++) {
                    for(var k=0; k< hl; k++) {
                        p = c.getImageData(i, k, 1, 1).data;
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
