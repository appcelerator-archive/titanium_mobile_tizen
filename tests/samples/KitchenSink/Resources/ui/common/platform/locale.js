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
			height: '120',
			color: '#fc0'
		});
	}

	picker.add(GetAllLocalesForPicker());
	// turn on the selection indicator (off by default)
	picker.selectionIndicator = true;

	win.add(picker);
	var textFieldWinNumber = Titanium.UI.createTextField({
		value:"7654321.89",
		top:70,
		backgroundColor: 'white',
		color:'black',
		height:'auto',
		width:'200px',
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_LINE
	});

	var labelInput = Ti.UI.createLabel({
		text:'Enter number to format:',
		top:40,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});

	var labelLocale = Ti.UI.createLabel({
		text:'',
		top:5,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});

	var label = Ti.UI.createLabel({
		text:'Select target locale...',
		top:220,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});

	var labelDecimal= Ti.UI.createLabel({
		text:'',
		top:130,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});

	var labelCurrencyEx = Ti.UI.createLabel({
		text:'Local currency symbol:',
		top:170,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});


	win.add(label);
	win.add(labelInput);
	win.add(labelLocale);
	win.add(textFieldWinNumber);
	win.add(labelDecimal);
	win.add(labelCurrencyEx);
	var selectedLocale ='';


	picker.addEventListener('change',function(e)
	{
		selectedLocale = e.row.custom_item;
		Ti.API.info("You selected locale: " + selectedLocale);
		labelLocale.text = "Selected locale: " + selectedLocale;

		labelDecimal.text = "as decimal: "+String.formatDecimal(textFieldWinNumber.value, selectedLocale);
		labelCurrencyEx.text = "Currency code: "+Ti.Locale.getCurrencyCode(selectedLocale)+", symbol: "+Ti.Locale.getLocaleCurrencySymbol(selectedLocale);
	});

	textFieldWinNumber.addEventListener('change',function(e)
	{
		labelDecimal.text = 'as decimal: '+String.formatDecimal(e.value, selectedLocale);
	});

	picker.setSelectedRow(0,1,false);
	return win;
};


function GetAllLocalesForPicker(){
	var data = [];
	// just add each row implicitly to one column
	data[0]=(Ti.UI.createPickerRow({title:"Arabic (Saudi Arabia)",custom_item:"ar-SA"}));
	data[1]=(Ti.UI.createPickerRow({title:"Bulgarian (Bulgaria)",custom_item:"bg-BG"}));
	data[2]=(Ti.UI.createPickerRow({title:"Catalan (Catalan)",custom_item:"ca-ES"}));
	data[3]=(Ti.UI.createPickerRow({title:"Chinese (Traditional, Taiwan)",custom_item:"zh-TW"}));
	data[4]=(Ti.UI.createPickerRow({title:"Czech (Czech Republic)",custom_item:"cs-CZ"}));
	data[5]=(Ti.UI.createPickerRow({title:"Danish (Denmark)",custom_item:"da-DK"}));
	data[6]=(Ti.UI.createPickerRow({title:"German (Germany)",custom_item:"de-DE"}));
	data[7]=(Ti.UI.createPickerRow({title:"Greek (Greece)",custom_item:"el-GR"}));
	data[8]=(Ti.UI.createPickerRow({title:"English (United States)",custom_item:"en-US"}));
	data[9]=(Ti.UI.createPickerRow({title:"Finnish (Finland)",custom_item:"fi-FI"}));
	data[10]=(Ti.UI.createPickerRow({title:"French (France)",custom_item:"fr-FR"}));
	data[11]=(Ti.UI.createPickerRow({title:"Hebrew (Israel)",custom_item:"he-IL"}));
	data[12]=(Ti.UI.createPickerRow({title:"Hungarian (Hungary)",custom_item:"hu-HU"}));
	data[13]=(Ti.UI.createPickerRow({title:"Icelandic (Iceland)",custom_item:"is-IS"}));
	data[14]=(Ti.UI.createPickerRow({title:"Italian (Italy)",custom_item:"it-IT"}));
	data[15]=(Ti.UI.createPickerRow({title:"Japanese (Japan)",custom_item:"ja-JP"}));
	data[16]=(Ti.UI.createPickerRow({title:"Korean (Korea)",custom_item:"ko-KR"}));
	data[17]=(Ti.UI.createPickerRow({title:"Dutch (Netherlands)",custom_item:"nl-NL"}));
	data[18]=(Ti.UI.createPickerRow({title:"Norwegian, BokmГҐl (Norway)",custom_item:"nb-NO"}));
	data[19]=(Ti.UI.createPickerRow({title:"Polish (Poland)",custom_item:"pl-PL"}));
	data[20]=(Ti.UI.createPickerRow({title:"Portuguese (Brazil)",custom_item:"pt-BR"}));
	data[21]=(Ti.UI.createPickerRow({title:"Romansh (Switzerland)",custom_item:"rm-CH"}));
	data[22]=(Ti.UI.createPickerRow({title:"Romanian (Romania)",custom_item:"ro-RO"}));
	data[23]=(Ti.UI.createPickerRow({title:"Russian (Russia)",custom_item:"ru-RU"}));
	data[24]=(Ti.UI.createPickerRow({title:"Croatian (Croatia)",custom_item:"hr-HR"}));
	data[25]=(Ti.UI.createPickerRow({title:"Slovak (Slovakia)",custom_item:"sk-SK"}));
	data[26]=(Ti.UI.createPickerRow({title:"Albanian (Albania)",custom_item:"sq-AL"}));
	data[27]=(Ti.UI.createPickerRow({title:"Swedish (Sweden)",custom_item:"sv-SE"}));
	data[28]=(Ti.UI.createPickerRow({title:"Thai (Thailand)",custom_item:"th-TH"}));
	data[29]=(Ti.UI.createPickerRow({title:"Turkish (Turkey)",custom_item:"tr-TR"}));
	data[30]=(Ti.UI.createPickerRow({title:"Urdu (Islamic Republic of Pakistan)",custom_item:"ur-PK"}));
	data[31]=(Ti.UI.createPickerRow({title:"Indonesian (Indonesia)",custom_item:"id-ID"}));
	data[32]=(Ti.UI.createPickerRow({title:"Ukrainian (Ukraine)",custom_item:"uk-UA"}));
	data[33]=(Ti.UI.createPickerRow({title:"Belarusian (Belarus)",custom_item:"be-BY"}));
	data[34]=(Ti.UI.createPickerRow({title:"Slovenian (Slovenia)",custom_item:"sl-SI"}));
	data[35]=(Ti.UI.createPickerRow({title:"Estonian (Estonia)",custom_item:"et-EE"}));
	data[36]=(Ti.UI.createPickerRow({title:"Latvian (Latvia)",custom_item:"lv-LV"}));
	data[37]=(Ti.UI.createPickerRow({title:"Lithuanian (Lithuania)",custom_item:"lt-LT"}));
	data[38]=(Ti.UI.createPickerRow({title:"Tajik (Cyrillic, Tajikistan)",custom_item:"tg-Cyrl-TJ"}));
	data[39]=(Ti.UI.createPickerRow({title:"Persian",custom_item:"fa-IR"}));
	data[40]=(Ti.UI.createPickerRow({title:"Vietnamese (Vietnam)",custom_item:"vi-VN"}));
	data[41]=(Ti.UI.createPickerRow({title:"Armenian (Armenia)",custom_item:"hy-AM"}));
	data[42]=(Ti.UI.createPickerRow({title:"Azeri (Latin, Azerbaijan)",custom_item:"az-Latn-AZ"}));
	data[43]=(Ti.UI.createPickerRow({title:"Basque (Basque)",custom_item:"eu-ES"}));
	data[44]=(Ti.UI.createPickerRow({title:"Upper Sorbian (Germany)",custom_item:"hsb-DE"}));
	data[45]=(Ti.UI.createPickerRow({title:"Macedonian (Former Yugoslav Republic of Macedonia)",custom_item:"mk-MK"}));
	data[46]=(Ti.UI.createPickerRow({title:"Setswana (South Africa)",custom_item:"tn-ZA"}));
	data[47]=(Ti.UI.createPickerRow({title:"isiXhosa (South Africa)",custom_item:"xh-ZA"}));
	data[48]=(Ti.UI.createPickerRow({title:"isiZulu (South Africa)",custom_item:"zu-ZA"}));
	data[49]=(Ti.UI.createPickerRow({title:"Afrikaans (South Africa)",custom_item:"af-ZA"}));
	data[50]=(Ti.UI.createPickerRow({title:"Georgian (Georgia)",custom_item:"ka-GE"}));
	/*	data[51]=(Ti.UI.createPickerRow({title:"Faroese (Faroe Islands)",custom_item:"fo-FO"}));
	 data[52]=(Ti.UI.createPickerRow({title:"Hindi (India)",custom_item:"hi-IN"}));
	 data[53]=(Ti.UI.createPickerRow({title:"Maltese (Malta)",custom_item:"mt-MT"}));
	 data[54]=(Ti.UI.createPickerRow({title:"Sami, Northern (Norway)",custom_item:"se-NO"}));
	 data[55]=(Ti.UI.createPickerRow({title:"Malay (Malaysia)",custom_item:"ms-MY"}));
	 data[56]=(Ti.UI.createPickerRow({title:"Kazakh (Kazakhstan)",custom_item:"kk-KZ"}));
	 data[57]=(Ti.UI.createPickerRow({title:"Kyrgyz (Kyrgyzstan)",custom_item:"ky-KG"}));
	 data[58]=(Ti.UI.createPickerRow({title:"Kiswahili (Kenya)",custom_item:"sw-KE"}));
	 data[59]=(Ti.UI.createPickerRow({title:"Turkmen (Turkmenistan)",custom_item:"tk-TM"}));
	 data[60]=(Ti.UI.createPickerRow({title:"Uzbek (Latin, Uzbekistan)",custom_item:"uz-Latn-UZ"}));
	 data[61]=(Ti.UI.createPickerRow({title:"Tatar (Russia)",custom_item:"tt-RU"}));
	 data[62]=(Ti.UI.createPickerRow({title:"Bengali (India)",custom_item:"bn-IN"}));
	 data[63]=(Ti.UI.createPickerRow({title:"Punjabi (India)",custom_item:"pa-IN"}));
	 data[64]=(Ti.UI.createPickerRow({title:"Gujarati (India)",custom_item:"gu-IN"}));
	 data[65]=(Ti.UI.createPickerRow({title:"Oriya (India)",custom_item:"or-IN"}));
	 data[66]=(Ti.UI.createPickerRow({title:"Tamil (India)",custom_item:"ta-IN"}));
	 data[67]=(Ti.UI.createPickerRow({title:"Telugu (India)",custom_item:"te-IN"}));
	 data[68]=(Ti.UI.createPickerRow({title:"Kannada (India)",custom_item:"kn-IN"}));
	 data[69]=(Ti.UI.createPickerRow({title:"Malayalam (India)",custom_item:"ml-IN"}));
	 data[70]=(Ti.UI.createPickerRow({title:"Assamese (India)",custom_item:"as-IN"}));
	 data[71]=(Ti.UI.createPickerRow({title:"Marathi (India)",custom_item:"mr-IN"}));
	 data[72]=(Ti.UI.createPickerRow({title:"Sanskrit (India)",custom_item:"sa-IN"}));
	 data[73]=(Ti.UI.createPickerRow({title:"Mongolian (Cyrillic, Mongolia)",custom_item:"mn-MN"}));
	 data[74]=(Ti.UI.createPickerRow({title:"Tibetan (PRC)",custom_item:"bo-CN"}));
	 data[75]=(Ti.UI.createPickerRow({title:"Welsh (United Kingdom)",custom_item:"cy-GB"}));
	 data[76]=(Ti.UI.createPickerRow({title:"Khmer (Cambodia)",custom_item:"km-KH"}));
	 data[77]=(Ti.UI.createPickerRow({title:"Lao (Lao P.D.R.)",custom_item:"lo-LA"}));
	 data[78]=(Ti.UI.createPickerRow({title:"Galician (Galician)",custom_item:"gl-ES"}));
	 data[79]=(Ti.UI.createPickerRow({title:"Konkani (India)",custom_item:"kok-IN"}));
	 data[80]=(Ti.UI.createPickerRow({title:"Syriac (Syria)",custom_item:"syr-SY"}));
	 data[81]=(Ti.UI.createPickerRow({title:"Sinhala (Sri Lanka)",custom_item:"si-LK"}));
	 data[82]=(Ti.UI.createPickerRow({title:"Inuktitut (Syllabics, Canada)",custom_item:"iu-Cans-CA"}));
	 data[83]=(Ti.UI.createPickerRow({title:"Amharic (Ethiopia)",custom_item:"am-ET"}));
	 data[84]=(Ti.UI.createPickerRow({title:"Nepali (Nepal)",custom_item:"ne-NP"}));
	 data[85]=(Ti.UI.createPickerRow({title:"Frisian (Netherlands)",custom_item:"fy-NL"}));
	 data[86]=(Ti.UI.createPickerRow({title:"Pashto (Afghanistan)",custom_item:"ps-AF"}));
	 data[87]=(Ti.UI.createPickerRow({title:"Filipino (Philippines)",custom_item:"fil-PH"}));
	 data[88]=(Ti.UI.createPickerRow({title:"Divehi (Maldives)",custom_item:"dv-MV"}));
	 data[89]=(Ti.UI.createPickerRow({title:"Hausa (Latin, Nigeria)",custom_item:"ha-Latn-NG"}));
	 data[90]=(Ti.UI.createPickerRow({title:"Yoruba (Nigeria)",custom_item:"yo-NG"}));
	 data[91]=(Ti.UI.createPickerRow({title:"Quechua (Bolivia)",custom_item:"quz-BO"}));
	 data[92]=(Ti.UI.createPickerRow({title:"Sesotho sa Leboa (South Africa)",custom_item:"nso-ZA"}));
	 data[93]=(Ti.UI.createPickerRow({title:"Bashkir (Russia)",custom_item:"ba-RU"}));
	 data[94]=(Ti.UI.createPickerRow({title:"Luxembourgish (Luxembourg)",custom_item:"lb-LU"}));
	 data[95]=(Ti.UI.createPickerRow({title:"Greenlandic (Greenland)",custom_item:"kl-GL"}));
	 data[96]=(Ti.UI.createPickerRow({title:"Igbo (Nigeria)",custom_item:"ig-NG"}));
	 data[97]=(Ti.UI.createPickerRow({title:"Yi (PRC)",custom_item:"ii-CN"}));
	 data[98]=(Ti.UI.createPickerRow({title:"Mapudungun (Chile)",custom_item:"arn-CL"}));
	 data[99]=(Ti.UI.createPickerRow({title:"Mohawk (Mohawk)",custom_item:"moh-CA"}));
	 data[100]=(Ti.UI.createPickerRow({title:"Breton (France)",custom_item:"br-FR"}));
	 data[101]=(Ti.UI.createPickerRow({title:"Uyghur (PRC)",custom_item:"ug-CN"}));
	 data[102]=(Ti.UI.createPickerRow({title:"Maori (New Zealand)",custom_item:"mi-NZ"}));
	 data[103]=(Ti.UI.createPickerRow({title:"Occitan (France)",custom_item:"oc-FR"}));
	 data[104]=(Ti.UI.createPickerRow({title:"Corsican (France)",custom_item:"co-FR"}));
	 data[105]=(Ti.UI.createPickerRow({title:"Alsatian (France)",custom_item:"gsw-FR"}));
	 data[106]=(Ti.UI.createPickerRow({title:"Yakut (Russia)",custom_item:"sah-RU"}));
	 data[107]=(Ti.UI.createPickerRow({title:"K'iche (Guatemala)",custom_item:"qut-GT"}));
	 data[108]=(Ti.UI.createPickerRow({title:"Kinyarwanda (Rwanda)",custom_item:"rw-RW"}));
	 data[109]=(Ti.UI.createPickerRow({title:"Wolof (Senegal)",custom_item:"wo-SN"}));
	 data[110]=(Ti.UI.createPickerRow({title:"Dari (Afghanistan)",custom_item:"prs-AF"}));
	 data[111]=(Ti.UI.createPickerRow({title:"Scottish Gaelic (United Kingdom)",custom_item:"gd-GB"}));
	 data[112]=(Ti.UI.createPickerRow({title:"Arabic (Iraq)",custom_item:"ar-IQ"}));
	 data[113]=(Ti.UI.createPickerRow({title:"Chinese (Simplified, PRC)",custom_item:"zh-CN"}));
	 data[114]=(Ti.UI.createPickerRow({title:"German (Switzerland)",custom_item:"de-CH"}));
	 data[115]=(Ti.UI.createPickerRow({title:"English (United Kingdom)",custom_item:"en-GB"}));
	 data[116]=(Ti.UI.createPickerRow({title:"Spanish (Mexico)",custom_item:"es-MX"}));
	 data[117]=(Ti.UI.createPickerRow({title:"French (Belgium)",custom_item:"fr-BE"}));
	 data[118]=(Ti.UI.createPickerRow({title:"Italian (Switzerland)",custom_item:"it-CH"}));
	 data[119]=(Ti.UI.createPickerRow({title:"Dutch (Belgium)",custom_item:"nl-BE"}));
	 data[120]=(Ti.UI.createPickerRow({title:"Norwegian, Nynorsk (Norway)",custom_item:"nn-NO"}));
	 data[121]=(Ti.UI.createPickerRow({title:"Portuguese (Portugal)",custom_item:"pt-PT"}));
	 data[122]=(Ti.UI.createPickerRow({title:"Serbian (Latin, Serbia and Montenegro (Former))",custom_item:"sr-Latn-CS"}));
	 data[123]=(Ti.UI.createPickerRow({title:"Swedish (Finland)",custom_item:"sv-FI"}));
	 data[124]=(Ti.UI.createPickerRow({title:"Azeri (Cyrillic, Azerbaijan)",custom_item:"az-Cyrl-AZ"}));
	 data[125]=(Ti.UI.createPickerRow({title:"Lower Sorbian (Germany)",custom_item:"dsb-DE"}));
	 data[126]=(Ti.UI.createPickerRow({title:"Sami, Northern (Sweden)",custom_item:"se-SE"}));
	 data[127]=(Ti.UI.createPickerRow({title:"Irish (Ireland)",custom_item:"ga-IE"}));
	 data[128]=(Ti.UI.createPickerRow({title:"Malay (Brunei Darussalam)",custom_item:"ms-BN"}));
	 data[129]=(Ti.UI.createPickerRow({title:"Uzbek (Cyrillic, Uzbekistan)",custom_item:"uz-Cyrl-UZ"}));
	 data[130]=(Ti.UI.createPickerRow({title:"Bengali (Bangladesh)",custom_item:"bn-BD"}));
	 data[131]=(Ti.UI.createPickerRow({title:"Mongolian (Traditional Mongolian, PRC)",custom_item:"mn-Mong-CN"}));
	 data[132]=(Ti.UI.createPickerRow({title:"Inuktitut (Latin, Canada)",custom_item:"iu-Latn-CA"}));
	 data[133]=(Ti.UI.createPickerRow({title:"Tamazight (Latin, Algeria)",custom_item:"tzm-Latn-DZ"}));
	 data[134]=(Ti.UI.createPickerRow({title:"Quechua (Ecuador)",custom_item:"quz-EC"}));
	 data[135]=(Ti.UI.createPickerRow({title:"Arabic (Egypt)",custom_item:"ar-EG"}));
	 data[136]=(Ti.UI.createPickerRow({title:"Chinese (Traditional, Hong Kong S.A.R.)",custom_item:"zh-HK"}));
	 data[137]=(Ti.UI.createPickerRow({title:"German (Austria)",custom_item:"de-AT"}));
	 data[138]=(Ti.UI.createPickerRow({title:"English (Australia)",custom_item:"en-AU"}));
	 data[139]=(Ti.UI.createPickerRow({title:"Spanish (Spain, International Sort)",custom_item:"es-ES"}));
	 data[140]=(Ti.UI.createPickerRow({title:"French (Canada)",custom_item:"fr-CA"}));
	 data[141]=(Ti.UI.createPickerRow({title:"Serbian (Cyrillic, Serbia and Montenegro (Former))",custom_item:"sr-Cyrl-CS"}));
	 data[142]=(Ti.UI.createPickerRow({title:"Sami, Northern (Finland)",custom_item:"se-FI"}));
	 data[143]=(Ti.UI.createPickerRow({title:"Quechua (Peru)",custom_item:"quz-PE"}));
	 data[144]=(Ti.UI.createPickerRow({title:"Arabic (Libya)",custom_item:"ar-LY"}));
	 data[145]=(Ti.UI.createPickerRow({title:"Chinese (Simplified, Singapore)",custom_item:"zh-SG"}));
	 data[146]=(Ti.UI.createPickerRow({title:"German (Luxembourg)",custom_item:"de-LU"}));
	 data[147]=(Ti.UI.createPickerRow({title:"English (Canada)",custom_item:"en-CA"}));
	 data[148]=(Ti.UI.createPickerRow({title:"Spanish (Guatemala)",custom_item:"es-GT"}));
	 data[149]=(Ti.UI.createPickerRow({title:"French (Switzerland)",custom_item:"fr-CH"}));
	 data[150]=(Ti.UI.createPickerRow({title:"Croatian (Latin, Bosnia and Herzegovina)",custom_item:"hr-BA"}));
	 data[151]=(Ti.UI.createPickerRow({title:"Sami, Lule (Norway)",custom_item:"smj-NO"}));
	 data[152]=(Ti.UI.createPickerRow({title:"Arabic (Algeria)",custom_item:"ar-DZ"}));
	 data[153]=(Ti.UI.createPickerRow({title:"Chinese (Traditional, Macao S.A.R.)",custom_item:"zh-MO"}));
	 data[154]=(Ti.UI.createPickerRow({title:"German (Liechtenstein)",custom_item:"de-LI"}));
	 data[155]=(Ti.UI.createPickerRow({title:"English (New Zealand)",custom_item:"en-NZ"}));
	 data[156]=(Ti.UI.createPickerRow({title:"Spanish (Costa Rica)",custom_item:"es-CR"}));
	 data[157]=(Ti.UI.createPickerRow({title:"French (Luxembourg)",custom_item:"fr-LU"}));
	 data[158]=(Ti.UI.createPickerRow({title:"Bosnian (Latin, Bosnia and Herzegovina)",custom_item:"bs-Latn-BA"}));
	 data[159]=(Ti.UI.createPickerRow({title:"Sami, Lule (Sweden)",custom_item:"smj-SE"}));
	 data[160]=(Ti.UI.createPickerRow({title:"Arabic (Morocco)",custom_item:"ar-MA"}));
	 data[161]=(Ti.UI.createPickerRow({title:"English (Ireland)",custom_item:"en-IE"}));
	 data[162]=(Ti.UI.createPickerRow({title:"Spanish (Panama)",custom_item:"es-PA"}));
	 data[163]=(Ti.UI.createPickerRow({title:"French (Monaco)",custom_item:"fr-MC"}));
	 data[164]=(Ti.UI.createPickerRow({title:"Serbian (Latin, Bosnia and Herzegovina)",custom_item:"sr-Latn-BA"}));
	 data[165]=(Ti.UI.createPickerRow({title:"Sami, Southern (Norway)",custom_item:"sma-NO"}));
	 data[166]=(Ti.UI.createPickerRow({title:"Arabic (Tunisia)",custom_item:"ar-TN"}));
	 data[167]=(Ti.UI.createPickerRow({title:"English (South Africa)",custom_item:"en-ZA"}));
	 data[168]=(Ti.UI.createPickerRow({title:"Spanish (Dominican Republic)",custom_item:"es-DO"}));
	 data[169]=(Ti.UI.createPickerRow({title:"Serbian (Cyrillic, Bosnia and Herzegovina)",custom_item:"sr-Cyrl-BA"}));
	 data[170]=(Ti.UI.createPickerRow({title:"Sami, Southern (Sweden)",custom_item:"sma-SE"}));
	 data[171]=(Ti.UI.createPickerRow({title:"Arabic (Oman)",custom_item:"ar-OM"}));
	 data[172]=(Ti.UI.createPickerRow({title:"English (Jamaica)",custom_item:"en-JM"}));
	 data[173]=(Ti.UI.createPickerRow({title:"Spanish (Bolivarian Republic of Venezuela)",custom_item:"es-VE"}));
	 data[174]=(Ti.UI.createPickerRow({title:"Bosnian (Cyrillic, Bosnia and Herzegovina)",custom_item:"bs-Cyrl-BA"}));
	 data[175]=(Ti.UI.createPickerRow({title:"Sami, Skolt (Finland)",custom_item:"sms-FI"}));
	 data[176]=(Ti.UI.createPickerRow({title:"Arabic (Yemen)",custom_item:"ar-YE"}));
	 data[177]=(Ti.UI.createPickerRow({title:"English (Caribbean)",custom_item:"en-029"}));
	 data[178]=(Ti.UI.createPickerRow({title:"Spanish (Colombia)",custom_item:"es-CO"}));
	 data[179]=(Ti.UI.createPickerRow({title:"Serbian (Latin, Serbia)",custom_item:"sr-Latn-RS"}));
	 data[180]=(Ti.UI.createPickerRow({title:"Sami, Inari (Finland)",custom_item:"smn-FI"}));
	 data[181]=(Ti.UI.createPickerRow({title:"Arabic (Syria)",custom_item:"ar-SY"}));
	 data[182]=(Ti.UI.createPickerRow({title:"English (Belize)",custom_item:"en-BZ"}));
	 data[183]=(Ti.UI.createPickerRow({title:"Spanish (Peru)",custom_item:"es-PE"}));
	 data[184]=(Ti.UI.createPickerRow({title:"Serbian (Cyrillic, Serbia)",custom_item:"sr-Cyrl-RS"}));
	 data[185]=(Ti.UI.createPickerRow({title:"Arabic (Jordan)",custom_item:"ar-JO"}));
	 data[186]=(Ti.UI.createPickerRow({title:"English (Trinidad and Tobago)",custom_item:"en-TT"}));
	 data[187]=(Ti.UI.createPickerRow({title:"Spanish (Argentina)",custom_item:"es-AR"}));
	 data[188]=(Ti.UI.createPickerRow({title:"Serbian (Latin, Montenegro)",custom_item:"sr-Latn-ME"}));
	 data[189]=(Ti.UI.createPickerRow({title:"Arabic (Lebanon)",custom_item:"ar-LB"}));
	 data[190]=(Ti.UI.createPickerRow({title:"English (Zimbabwe)",custom_item:"en-ZW"}));
	 data[191]=(Ti.UI.createPickerRow({title:"Spanish (Ecuador)",custom_item:"es-EC"}));
	 data[192]=(Ti.UI.createPickerRow({title:"Serbian (Cyrillic, Montenegro)",custom_item:"sr-Cyrl-ME"}));
	 data[193]=(Ti.UI.createPickerRow({title:"Arabic (Kuwait)",custom_item:"ar-KW"}));
	 data[194]=(Ti.UI.createPickerRow({title:"English (Republic of the Philippines)",custom_item:"en-PH"}));
	 data[195]=(Ti.UI.createPickerRow({title:"Spanish (Chile)",custom_item:"es-CL"}));
	 data[196]=(Ti.UI.createPickerRow({title:"Arabic (U.A.E.)",custom_item:"ar-AE"}));
	 data[197]=(Ti.UI.createPickerRow({title:"Spanish (Uruguay)",custom_item:"es-UY"}));
	 data[198]=(Ti.UI.createPickerRow({title:"Arabic (Bahrain)",custom_item:"ar-BH"}));
	 data[199]=(Ti.UI.createPickerRow({title:"Spanish (Paraguay)",custom_item:"es-PY"}));
	 data[200]=(Ti.UI.createPickerRow({title:"Arabic (Qatar)",custom_item:"ar-QA"}));
	 data[201]=(Ti.UI.createPickerRow({title:"English (India)",custom_item:"en-IN"}));
	 data[202]=(Ti.UI.createPickerRow({title:"Spanish (Bolivia)",custom_item:"es-BO"}));
	 data[203]=(Ti.UI.createPickerRow({title:"English (Malaysia)",custom_item:"en-MY"}));
	 data[204]=(Ti.UI.createPickerRow({title:"Spanish (El Salvador)",custom_item:"es-SV"}));
	 data[205]=(Ti.UI.createPickerRow({title:"English (Singapore)",custom_item:"en-SG"}));
	 data[206]=(Ti.UI.createPickerRow({title:"Spanish (Honduras)",custom_item:"es-HN"}));
	 data[207]=(Ti.UI.createPickerRow({title:"Spanish (Nicaragua)",custom_item:"es-NI"}));
	 data[208]=(Ti.UI.createPickerRow({title:"Spanish (Puerto Rico)",custom_item:"es-PR"}));
	 data[209]=(Ti.UI.createPickerRow({title:"Spanish (United States)",custom_item:"es-US"}));*/
	return data;
}

module.exports = locale;
