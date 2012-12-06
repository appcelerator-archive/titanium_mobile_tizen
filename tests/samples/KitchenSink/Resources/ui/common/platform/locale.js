/**
 * locale basic sample
 */

function locale(_args) {
	var win = Ti.UI.createWindow();
	win.backgroundColor = 'black';
	
	var picker = Ti.UI.createPicker();
	var mobileOrTizen = (Ti.Platform.osname === 'mobileweb' || Ti.Platform.osname === 'tizen');
	if (mobileOrTizen) {
		picker = Ti.UI.createPicker({
			top: '250',
			height: '110',
			color: '#fc0'
		});
	}
	
	// just add each row implicitly to one column
	picker.add(Ti.UI.createPickerRow({title:"English (United States) - English (United States)",custom_item:"en-US"}));
	picker.add(Ti.UI.createPickerRow({title:"\u0627\u0644\u0639\u0631\u0628\u064a\u0629 (\u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u0633\u0639\u0648\u062f\u064a\u0629) - Arabic (Saudi Arabia)",custom_item:"ar-SA"}));
	picker.add(Ti.UI.createPickerRow({title:"\u4e2d\u6587(\u53f0\u7063) - Chinese (Traditional, Taiwan)",custom_item:"zh-TW"}));
	picker.add(Ti.UI.createPickerRow({title:"\u010de\u0161tina (\u010cesk\u00e1\u00a0republika) - Czech (Czech Republic)",custom_item:"cs-CZ"}));
	picker.add(Ti.UI.createPickerRow({title:"dansk (Danmark) - Danish (Denmark)",custom_item:"da-DK"}));
	picker.add(Ti.UI.createPickerRow({title:"Deutsch (Deutschland) - German (Germany)",custom_item:"de-DE"}));
	picker.add(Ti.UI.createPickerRow({title:"\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac (\u0395\u03bb\u03bb\u03ac\u03b4\u03b1) - Greek (Greece)",custom_item:"el-GR"}));
	picker.add(Ti.UI.createPickerRow({title:"suomi (Suomi) - Finnish (Finland)",custom_item:"fi-FI"}));
	picker.add(Ti.UI.createPickerRow({title:"fran\u00e7ais (France) - French (France)",custom_item:"fr-FR"}));
	picker.add(Ti.UI.createPickerRow({title:"\u05e2\u05d1\u05e8\u05d9\u05ea (\u05d9\u05e9\u05e8\u05d0\u05dc) - Hebrew (Israel)",custom_item:"he-IL"}));
	picker.add(Ti.UI.createPickerRow({title:"magyar (Magyarorsz\u00e1g) - Hungarian (Hungary)",custom_item:"hu-HU"}));
	picker.add(Ti.UI.createPickerRow({title:"\u00edslenska (\u00cdsland) - Icelandic (Iceland)",custom_item:"is-IS"}));
	picker.add(Ti.UI.createPickerRow({title:"italiano (Italia) - Italian (Italy)",custom_item:"it-IT"}));
	picker.add(Ti.UI.createPickerRow({title:"\u65e5\u672c\u8a9e (\u65e5\u672c) - Japanese (Japan)",custom_item:"ja-JP"}));
	picker.add(Ti.UI.createPickerRow({title:"\ud55c\uad6d\uc5b4 (\ub300\ud55c\ubbfc\uad6d) - Korean (Korea)",custom_item:"ko-KR"}));
	picker.add(Ti.UI.createPickerRow({title:"Nederlands (Nederland) - Dutch (Netherlands)",custom_item:"nl-NL"}));
	picker.add(Ti.UI.createPickerRow({title:"\u0938\u0902\u0938\u094d\u0915\u0943\u0924 (\u092d\u093e\u0930\u0924\u092e\u094d) - Sanskrit (India)",custom_item:"sa-IN"}));
	picker.add(Ti.UI.createPickerRow({title:"\u041c\u043e\u043d\u0433\u043e\u043b\u00a0\u0445\u044d\u043b (\u041c\u043e\u043d\u0433\u043e\u043b\u00a0\u0443\u043b\u0441) - Mongolian (Cyrillic, Mongolia)",custom_item:"mn-MN"}));
	picker.add(Ti.UI.createPickerRow({title:"\u0f56\u0f7c\u0f51\u0f0b\u0f61\u0f72\u0f42 (\u0f40\u0fb2\u0f74\u0f44\u0f0b\u0f67\u0fad\u0f0b\u0f58\u0f72\u0f0b\u0f51\u0f58\u0f44\u0f66\u0f0b\u0f66\u0fa4\u0fb1\u0f72\u0f0b\u0f58\u0f50\u0f74\u0f53\u0f0b\u0f62\u0f92\u0fb1\u0f63\u0f0b\u0f41\u0f56\u0f0d) - Tibetan (PRC)",custom_item:"bo-CN"}));
	picker.add(Ti.UI.createPickerRow({title:"Cymraeg (y Deyrnas Unedig) - Welsh (United Kingdom)",custom_item:"cy-GB"}));
	picker.add(Ti.UI.createPickerRow({title:"\u1781\u17d2\u1798\u17c2\u179a (\u1780\u1798\u17d2\u1796\u17bb\u1787\u17b6) - Khmer (Cambodia)",custom_item:"km-KH"}));
	picker.add(Ti.UI.createPickerRow({title:"\u0ea5\u0eb2\u0ea7 (\u0eaa.\u0e9b.\u0e9b. \u0ea5\u0eb2\u0ea7) - Lao (Lao P.D.R.)",custom_item:"lo-LA"}));
	picker.add(Ti.UI.createPickerRow({title:"galego (galego) - Galician (Galician)",custom_item:"gl-ES"}));
	picker.add(Ti.UI.createPickerRow({title:"\u0915\u094b\u0902\u0915\u0923\u0940 (\u092d\u093e\u0930\u0924) - Konkani (India)",custom_item:"kok-IN"}));
	picker.add(Ti.UI.createPickerRow({title:"\u0723\u0718\u072a\u071d\u071d\u0710 (\u0633\u0648\u0631\u064a\u0627) - Syriac (Syria)",custom_item:"syr-SY"}));
	picker.add(Ti.UI.createPickerRow({title:"\u0dc3\u0dd2\u0d82\u0dc4\u0dbd (\u0dc1\u0dca\u200d\u0dbb\u0dd3 \u0dbd\u0d82\u0d9a\u0dcf) - Sinhala (Sri Lanka)",custom_item:"si-LK"}));
	picker.add(Ti.UI.createPickerRow({title:"\u078b\u07a8\u0788\u07ac\u0780\u07a8\u0784\u07a6\u0790\u07b0 (\u078b\u07a8\u0788\u07ac\u0780\u07a8 \u0783\u07a7\u0787\u07b0\u0796\u07ac) - Divehi (Maldives)",custom_item:"dv-MV"}));
	picker.add(Ti.UI.createPickerRow({title:"Hausa (Nigeria) - Hausa (Latin, Nigeria)",custom_item:"ha-Latn-NG"}));
	picker.add(Ti.UI.createPickerRow({title:"Yoruba (Nigeria) - Yoruba (Nigeria)",custom_item:"yo-NG"}));
	picker.add(Ti.UI.createPickerRow({title:"Nederlands (Belgi\u00eb) - Dutch (Belgium)",custom_item:"nl-BE"}));
	picker.add(Ti.UI.createPickerRow({title:"norsk, nynorsk (Noreg) - Norwegian, Nynorsk (Norway)",custom_item:"nn-NO"}));
	
	// turn on the selection indicator (off by default)
	picker.selectionIndicator = true;
	
	win.add(picker);
	
	var label = Ti.UI.createLabel({
		text:'Select some locale...',
		top:10,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});
	
	var labelCurrency = Ti.UI.createLabel({
		text:"1234567.89 in system locale's currency is: "+ String.formatCurrency(1234567.89),
		top:50,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});

	var labelDecimal= Ti.UI.createLabel({
		text:'',
		top:90,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});

	var labelCurrencySymbol = Ti.UI.createLabel({
		text:'Local currency symbol:',
		top:130,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});

	var labelCurrencyCode= Ti.UI.createLabel({
		text:'Local currency code:',
		top:170,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});

	win.add(label);
	win.add(labelCurrency);
	win.add(labelDecimal);
	win.add(labelCurrencySymbol);
	win.add(labelCurrencyCode);
	
	picker.addEventListener('change',function(e)
	{
		Ti.API.info("You selected locale: " + e.row.custom_item);
		label.text = "Selcted locale: " + e.row.custom_item;

                if (mobileOrTizen)
		{
			labelCurrency.text = "1234567.89 as currency: "+ String.formatCurrency(1234567.89, e.row.custom_item);
		}

		labelDecimal.text = "9876543.21 as decimal: "+ String.formatDecimal(9876543.21, e.row.custom_item);
		labelCurrencySymbol.text = "Local currency symbol: "+Ti.Locale.getLocaleCurrencySymbol(e.row.custom_item);
		labelCurrencyCode.text = "Local currency code: "+Ti.Locale.getCurrencyCode(e.row.custom_item);
	});

        picker.setSelectedRow(0,1,false);
	return win;
};

module.exports = locale;
