function xml_rss() {
	var win = Ti.UI.createWindow();
	
	// create table view data object
	var data = [];
	
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET","http://v2.0.news.tmg.s3.amazonaws.com/feeds/news.xml");
	xhr.onload = function()
	{
		try
		{
			var doc = this.responseXML.documentElement;
			var items = doc.getElementsByTagName("item");  
			var x = 0;
			var doctitle = this.responseXML.evaluate("//channel/title/text()", doc, null, XPathResult.ANY_TYPE, null);
			doctitle = doctitle.iterateNext().nodeValue;
			for (var c=0;c<items.length;c++)
			{
				var item = items.item(c);
				var thumbnails =  this.responseXML.evaluate("./*[name() = 'media:thumbnail']/@url", item, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
				thumbnails = thumbnails.iterateNext();
				if (thumbnails && thumbnails.value)
				{
					var media = thumbnails.value;  
					var title = item.getElementsByTagName("title").item(0).firstChild.nodeValue;
					var row = Ti.UI.createTableViewRow({height:80});
					var label = Ti.UI.createLabel({
						text:title,
						left:72,
						top:5,
						bottom:5,
						right:5				
					});
					row.add(label);
					var img;
					if (Titanium.Platform.name == 'android') 
					{
						// iphone moved to a single image property - android needs to do the same
						img = Ti.UI.createImageView({
							image:media,
							left:5,
							height:60,
							width:60
						});
	
					}
					else
					{
						img = Ti.UI.createImageView({
							image:media,
							left:5,
							height:60,
							width:60
						});
						
					}
					row.add(img);
					data[x++] = row;
					row.url = item.getElementsByTagName("link").item(0).firstChild.nodeValue;
				}
			}
			var tableview = Titanium.UI.createTableView({data:data});
			win.add(tableview);
			tableview.addEventListener('click',function(e)
			{
				var w = Ti.UI.createWindow({title:doctitle});
				console.log("Created");
				var wb = Ti.UI.createWebView({url:e.row.url});
				w.add(wb);
				win.containingTab.open(w, {animated: true})
			});
		}
		catch(E)
		{
			alert(E);
		}
	};
	xhr.send();
	
	
	return win;
};

module.exports = xml_rss;
	
	
	

