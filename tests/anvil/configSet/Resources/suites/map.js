/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
Ti.include('countPixels.js');
module.exports = new function() {
	var finish;
	var valueOf;
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "map";
	this.tests = [
		{name: "constants", timeout: 10000},
		{name: "mapView", timeout: 20000},
		{name: "annotation", timeout: 10000},
		{name: "add_annotation", timeout: 10000},
		{name: "map_properties", timeout: 10000},
		{name: "simple_map_methods", timeout: 10000},
		{name: "route", timeout: 10000}
	]

	this.constants = function(testRun) {
		valueOf(testRun, Ti.Map.ANNOTATION_GREEN).shouldBeNumber();
		valueOf(testRun, Ti.Map.ANNOTATION_PURPLE).shouldBeNumber();
		valueOf(testRun, Ti.Map.ANNOTATION_RED).shouldBeNumber();
                
		valueOf(testRun, Ti.Map.HYBRID_TYPE).shouldBeNumber();
		valueOf(testRun, Ti.Map.SATELLITE_TYPE).shouldBeNumber();
		valueOf(testRun, Ti.Map.STANDARD_TYPE).shouldBeNumber();
		valueOf(testRun, Ti.Map.TERRAIN_TYPE).shouldBeNumber();
		finish(testRun);
	}
	
	this.mapView = function(testRun) {
            var map;
            var win = Titanium.UI.createWindow({
                backgroundColor: '#FF0000'
            });
            
            valueOf(testRun, function(){
                map =  Titanium.Map.createView({
                    mapType: Titanium.Map.STANDARD_TYPE,
                    region: {latitude:33.74511, longitude:-84.38993, 
                            latitudeDelta:0.5, longitudeDelta:0.5},
                    animate:true,
                    regionFit:true,
                    userLocation:true,
                    animated: true
                });
            }).shouldNotThrowException();
            
            win.add(map);
            win.open();
            var cp = new CountPixels();
            var callback = function(count){
                    valueOf(testRun, count).shouldBeLessThan(100);
                    win.close();
                    finish(testRun);
                }
                
            setTimeout(function(){
                cp.countPixelsPercentage([255, 0, 0], win, callback);
            }, 100);
            
	}
        this.annotation = function(testRun) {
            var annotation1;
            var map;
            var win = Titanium.UI.createWindow();
                
                map =  Titanium.Map.createView({
                    mapType: Titanium.Map.STANDARD_TYPE,
                    region: {latitude:33.74511, longitude:-84.38993, 
                            latitudeDelta:0.01, longitudeDelta:0.01},
                    animate:true,
                    regionFit:true,
                    userLocation:true
                });
                
            valueOf(testRun, function(){
                annotation1 = Titanium.Map.createAnnotation({
                    latitude:37.390749,
                    longitude:-122.081651,
                    title:"Test",
                    subtitle:'Test, CA',
                    pincolor:Titanium.Map.ANNOTATION_RED,
                    animate:true,
                    leftButton: '../images/appcelerator_small.png',
                    myid:1 // Custom property to uniquely identify this annotation.
                });
            }).shouldNotThrowException();
            map.addEventListener('complete', function(){
                win.close();
                finish(testRun);
            });
            win.add(map);
            win.open();
	}
        this.add_annotation = function(testRun) {
            var annotationList;
            var annotation1;
            var annotation2;
            var annotation3;
            
            var map;
            var win = Titanium.UI.createWindow();
                map =  Titanium.Map.createView({
                    mapType: Titanium.Map.STANDARD_TYPE,
                    region: {latitude:37.390749, longitude:-122.081651, 
                            latitudeDelta:0.01, longitudeDelta:0.1},
                    animate:true,
                    regionFit:true,
                    userLocation:true
                });
                
            valueOf(testRun, map.annotations.length).shouldBeEqual(0);
            
            
            annotation1 = Titanium.Map.createAnnotation({
                latitude:37.390749,
                longitude:-122.081651,
                title:"Test1",
                subtitle:'Test1, CA',
                pincolor:Titanium.Map.ANNOTATION_RED,
                animate:true,
                leftButton: '../images/appcelerator_small.png',
                myid:1 // Custom property to uniquely identify this annotation.
            });
            annotation2 = Titanium.Map.createAnnotation({
                latitude:39.390749,
                longitude:-121.081651,
                title:"Test2",
                subtitle:'Test2, CA',
                pincolor:Titanium.Map.ANNOTATION_RED,
                animate:true,
                leftButton: '../images/appcelerator_small.png',
                myid:2 // Custom property to uniquely identify this annotation.
            });
            annotation3 = Titanium.Map.createAnnotation({
                latitude:38.390749,
                longitude:-120.081651,
                title:"Test3",
                subtitle:'Test3, CA',
                pincolor:Titanium.Map.ANNOTATION_RED,
                animate:true,
                leftButton: '../images/appcelerator_small.png',
                myid:3 // Custom property to uniquely identify this annotation.
            });
            
            map.addEventListener('complete', function(){
                win.close();
                finish(testRun);
            }); 
            
            map.addAnnotation(annotation1);
            valueOf(testRun, map.annotations.length).shouldBeEqual(1);
            
            map.addAnnotations([annotation2, annotation3]);
            valueOf(testRun, map.annotations.length).shouldBeEqual(3);
            
            annotationList = map.getAnnotations();
           
            for(var i=0, len=annotationList.length; i<len; i++){
                valueOf(testRun, annotationList[i]).shouldBeObject();
            }
            map.removeAnnotation(annotation2)
            valueOf(testRun, map.annotations.length).shouldBeEqual(2);
            
            map.removeAnnotations([annotation3]);
            valueOf(testRun, map.annotations.length).shouldBeEqual(1);
            
            map.removeAllAnnotations();
            valueOf(testRun, map.annotations.length).shouldBeEqual(0);
            
            win.add(map);
            win.open();
	};
        this.map_properties = function(testRun){
            var win = Titanium.UI.createWindow({
                backgroundColor: '#FF0000'
            });
            var map =  Titanium.Map.createView({
                    mapType: Titanium.Map.STANDARD_TYPE,
                    region: {latitude:33.74511, longitude:-84.38993, 
                            latitudeDelta:0.05, longitudeDelta:0.05},
                    animate:true,
                    regionFit:true,
                    userLocation:true,
                    animated: true
                });
            map.addEventListener('complete', function(){
                //console.log('latitudeDelta '+map.latitudeDelta);
                //console.log('longitudeDelta '+map.longitudeDelta);
                //console.log('map.region.latitudeDelta '+map.region.latitudeDelta);
                //console.log('map.region.longitudeDelta '+map.region.longitudeDelta);
                win.close();
                finish(testRun);
            }); 
            
            valueOf(testRun, map.animated).shouldBeTrue();
            valueOf(testRun, map.mapType).shouldBeEqual(Titanium.Map.STANDARD_TYPE);
            valueOf(testRun, map.regionFit).shouldBeTrue();
            valueOf(testRun, Math.round(map.region.latitude)).shouldBeEqual(34);
            valueOf(testRun, Math.round(map.region.longitude)).shouldBeEqual(-84);
            valueOf(testRun, map.regionFit).shouldBeTrue();
            valueOf(testRun, map.userLocation).shouldBeTrue();
            
            win.add(map);
            win.open();
            
        };
        this.simple_map_methods = function(testRun){
            var win = Titanium.UI.createWindow({
                backgroundColor: '#FF0000'
            });
            var map =  Titanium.Map.createView({
                    mapType: Titanium.Map.STANDARD_TYPE,
                    region: {latitude:33.74511, longitude:-84.38993, 
                            latitudeDelta:0.05, longitudeDelta:0.05},
                    animate:true,
                    regionFit:true,
                    userLocation:true,
                    animated: true
                });
            map.addEventListener('complete', function(){
                win.close();
                finish(testRun);
            });     
            win.add(map);
            win.open();
            //console.log('map.getLatitudeDelta() '+map.getLatitudeDelta());
            //console.log('map.getLatitudeDelta() '+map.getLongitudeDelta());
            valueOf(testRun, map.getAnimated()).shouldBeTrue();
            map.setAnimated(false);
            valueOf(testRun, map.getAnimated()).shouldBeFalse();
            valueOf(testRun, map.getMapType()).shouldBeEqual(Titanium.Map.STANDARD_TYPE);
            valueOf(testRun, Math.round(map.getRegion().latitude)).shouldBeEqual(34);
            valueOf(testRun, Math.round(map.getRegion().longitude)).shouldBeEqual(-84);
            valueOf(testRun, map.getRegion().latitudeDelta).shouldBeEqual(0.05);
            valueOf(testRun, map.getRegion().longitudeDelta).shouldBeEqual(0.05);
            valueOf(testRun, map.getRegionFit()).shouldBeTrue();
            valueOf(testRun, map.getUserLocation()).shouldBeTrue();
        };
        this.route = function(testRun){
            var win = Titanium.UI.createWindow({
                backgroundColor: '#FF0000'
            });
            var map =  Titanium.Map.createView({
                    mapType: Titanium.Map.STANDARD_TYPE,
                    region: {latitude:37.74511, longitude:-84.38993, 
                            latitudeDelta:5, longitudeDelta:5},
                    animate:true,
                    regionFit:true,
                    userLocation:true,
                    animated: true
                });
            var rout = {
                    color: '#FF0000',
                    name: 'testRout',
                    points:[{'latitude':37.390749, 'longitude':-122.081651}, {'latitude':39.390749, 'longitude':-84.38993}],
                    width: 10
                }    
            map.addEventListener('complete', function(){
                win.close();
                finish(testRun);
            }); 
            
            valueOf(testRun, function(){ 
                map.addRoute(rout); 
            }).shouldNotThrowException();
            
            valueOf(testRun, function(){ 
                map.removeRoute(rout); 
            }).shouldNotThrowException();
            
           win.add(map);
           win.open();
        };
}
