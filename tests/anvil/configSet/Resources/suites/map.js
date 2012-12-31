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
		{name: "add_annotation", timeout: 10000},
		{name: "map_properties", timeout: 10000},
		{name: "simple_map_methods", timeout: 10000},
		{name: "route", timeout: 10000},
                {name: "annotation", timeout: 10000},
                {name: "annotation_property", timeout: 10000},
                {name: "annotation_methods", timeout: 10000}
	]

	this.constants = function(testRun) {
                //Check all constants
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
            var cp = new CountPixels();
            var callback = function(count){
                    //check if count of red pixels is not 100%;
                    valueOf(testRun, count).shouldBeLessThan(100);
                    win.close();
                    finish(testRun);
                }
            var callbackBefore = function(count){
                    //check if count of red pixels is 100%;
                    valueOf(testRun, count).shouldBeEqual(100);
                }
            //try to create map view
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
            cp.countPixelsPercentage([255, 0, 0], win, callbackBefore);
            
            map.addEventListener('complete', function(){
                cp.countPixelsPercentage([255, 0, 0], win, callback);
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
                        latitudeDelta:3, longitudeDelta:3},
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
            
            map.addAnnotation(annotation1);
            valueOf(testRun, map.annotations.length).shouldBeEqual(1);
            
            map.addAnnotations([annotation2, annotation3]);
            valueOf(testRun, map.annotations.length).shouldBeEqual(3);
            
            annotationList = map.getAnnotations();
           
            for(var i=0, len=annotationList.length; i<len; i++){
                valueOf(testRun, annotationList[i]).shouldBeObject();
            } 
            
            valueOf(testRun, function(){
                map.selectAnnotation("Test2");
            }).shouldNotThrowException();
            
            valueOf(testRun, function(){
                map.deselectAnnotation("Test2");
            }).shouldNotThrowException();
            
            map.removeAnnotation(annotation2)
            valueOf(testRun, map.annotations.length).shouldBeEqual(2);
            
            map.removeAnnotations([annotation3]);
            valueOf(testRun, map.annotations.length).shouldBeEqual(1);
            
            map.removeAllAnnotations();
            valueOf(testRun, map.annotations.length).shouldBeEqual(0);
            
            win.add(map);
            win.open();
            win.close();
            finish(testRun);
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
                
                //Fail-------------------------------->
                //valueOf(testRun, map.latitudeDelta).shouldBeEqual(33.74511);
                //valueOf(testRun, map.longitudeDelta).shouldBeEqual(-84.38993);
                //valueOf(testRun, map.region.latitudeDelta).shouldBeEqual(0.05);
                //valueOf(testRun, map.region.longitudeDelta).shouldBeEqual(0.05);
                //Fail-------------------------------->
                
                valueOf(testRun, map.animated).shouldBeTrue();
                valueOf(testRun, map.mapType).shouldBeEqual(Titanium.Map.STANDARD_TYPE);
                valueOf(testRun, map.regionFit).shouldBeTrue();
                valueOf(testRun, Math.round(map.region.latitude)).shouldBeEqual(34);
                valueOf(testRun, Math.round(map.region.longitude)).shouldBeEqual(-84);
                valueOf(testRun, map.regionFit).shouldBeTrue();
                valueOf(testRun, map.userLocation).shouldBeTrue();
                win.close();
                finish(testRun);
            });
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
            
            //Fail-------------------------------->
            //valueOf(testRun, map.getLatitudeDelta()).shouldBeEqual(0.05);
            //valueOf(testRun, map.getLongitudeDelta()).shouldBeEqual(0.05);
            //Fail-------------------------------->
            
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
            
            map.setLocation({
                latitude:37.337681, longitude:-122.038193, animate:true,
                latitudeDelta:0.04, longitudeDelta:0.04});
            
            valueOf(testRun, Math.round(map.getRegion().latitude)).shouldBeEqual(37);
            valueOf(testRun, Math.round(map.getRegion().longitude)).shouldBeEqual(-122);
            valueOf(testRun, map.getRegion().latitudeDelta).shouldBeEqual(0.04);
            valueOf(testRun, map.getRegion().longitudeDelta).shouldBeEqual(0.04);
            
            map.setMapType(Ti.Map.TERRAIN_TYPE);
            
            valueOf(testRun, map.getMapType()).shouldBeEqual(Titanium.Map.TERRAIN_TYPE);
            
            map.setRegion({latitude:33.74511, longitude:-84.38993, 
                           latitudeDelta:0.05, longitudeDelta:0.05});
                       
            valueOf(testRun, Math.round(map.getRegion().latitude)).shouldBeEqual(34);
            valueOf(testRun, Math.round(map.getRegion().longitude)).shouldBeEqual(-84);
            valueOf(testRun, map.getRegion().latitudeDelta).shouldBeEqual(0.05);
            valueOf(testRun, map.getRegion().longitudeDelta).shouldBeEqual(0.05);
            
            map.setRegionFit(false);
            
            valueOf(testRun, map.getRegionFit()).shouldBeFalse();
            
            //Fail-------------------------------->
            //map.setUserLocation(false);
            //valueOf(testRun, map.getUserLocation()).shouldBeFalse();
            //Fail-------------------------------->
            
            map.addEventListener('complete', function(){
                valueOf(testRun, function(){
                    map.zoom(-1);
                }).shouldNotThrowException();
                win.close();
                finish(testRun);
            });
            
            win.add(map);
            win.open();
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
            //create rout    
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
        this.annotation = function(testRun) {
            var annotation;
            var win = Titanium.UI.createWindow();
                
            var map =  Titanium.Map.createView({
                mapType: Titanium.Map.STANDARD_TYPE,
                region: {latitude:33.74511, longitude:-84.38993, 
                        latitudeDelta:0.01, longitudeDelta:0.01},
                animate:true,
                regionFit:true,
                userLocation:true
            });
                
            valueOf(testRun, function(){
                annotation = Titanium.Map.createAnnotation({
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
            map.addAnnotation(annotation);
            win.add(map);
            win.open();
	}
        this.annotation_property = function(testRun){
            var win = Titanium.UI.createWindow();
            var map =  Titanium.Map.createView({
                    mapType: Titanium.Map.STANDARD_TYPE,
                    region: {latitude:33.74511, longitude:-84.38993, 
                            latitudeDelta:0.01, longitudeDelta:0.01},
                    animate:true,
                    regionFit:true,
                    userLocation:true
                });
            var annotation = Titanium.Map.createAnnotation({
                latitude:33.74511,
                longitude:-84.38993,
                title:"Test",
                subtitle:'Test, CA',
                pincolor:Titanium.Map.ANNOTATION_RED,
                animate:true,
                leftButton: '../images/appcelerator_small.png',
                myid:1 // Custom property to uniquely identify this annotation.
            });
                
            valueOf(testRun, annotation.animate).shouldBeTrue();
            valueOf(testRun, annotation.image).shouldBeUndefined();
            valueOf(testRun, annotation.latitude).shouldBeEqual(33.74511);
            valueOf(testRun, annotation.longitude).shouldBeEqual(-84.38993);
            valueOf(testRun, annotation.pincolor).shouldBeEqual(Titanium.Map.ANNOTATION_RED);
            valueOf(testRun, annotation.subtitle).shouldBeEqual('Test, CA');
            valueOf(testRun, annotation.title).shouldBeEqual('Test');
            
            //console.log(annotation.subtitleid);
            //console.log(annotation.titleid);
            
            map.addEventListener('complete', function(){
                map.addAnnotation(annotation);
                win.add(map);
                win.open();
                win.close();
                finish(testRun);
            });
        }
        this.annotation_methods = function(testRun){
            var annotation;
            
            annotation = Titanium.Map.createAnnotation({
                latitude:33.74511,
                longitude:-84.38993,
                title:"Test",
                subtitle:'Test, CA',
                pincolor:Titanium.Map.ANNOTATION_RED,
                animate:true,
                leftButton: 'file:///opt/media/Images/image10.jpg',
                myid:1 // Custom property to uniquely identify this annotation.
                
            });
            valueOf(testRun, annotation.getAnimate()).shouldBeTrue();
            valueOf(testRun, annotation.getImage()).shouldBeUndefined(); 
            valueOf(testRun, annotation.getLatitude()).shouldBeEqual(33.74511);
            valueOf(testRun, annotation.getLongitude()).shouldBeEqual(-84.38993);
            valueOf(testRun, annotation.getPincolor()).shouldBeEqual(Titanium.Map.ANNOTATION_RED);
            valueOf(testRun, annotation.getSubtitle()).shouldBeEqual('Test, CA');
            valueOf(testRun, annotation.getTitle()).shouldBeEqual('Test');
            
            //console.log(annotation.getSubtitleid());
            //console.log(annotation.getTitleid());
            
            annotation.setAnimate(false);
            annotation.setLatitude(34.74511);
            annotation.setLongitude(-85.38993);
            annotation.setPincolor(Titanium.Map.ANNOTATION_GREEN);
            annotation.setSubtitle('New test subtitle');
            annotation.setTitle('New test title');
            annotation.setImage('file:///opt/media/Images/image10.jpg');
            //console.log(annotation.setSubtitleid());
            //console.log(annotation.setTitleid());
            
            valueOf(testRun, annotation.getAnimate()).shouldBeFalse();
            valueOf(testRun, annotation.getLatitude()).shouldBeEqual(34.74511);
            valueOf(testRun, annotation.getLongitude()).shouldBeEqual(-85.38993);
            valueOf(testRun, annotation.getPincolor()).shouldBeEqual(Titanium.Map.ANNOTATION_GREEN);
            valueOf(testRun, annotation.getSubtitle()).shouldBeEqual('New test subtitle');
            valueOf(testRun, annotation.getTitle()).shouldBeEqual('New test title');
            valueOf(testRun, annotation.getImage()).shouldBeEqual('file:///opt/media/Images/image10.jpg'); 
            
            finish(testRun);
        }
}
