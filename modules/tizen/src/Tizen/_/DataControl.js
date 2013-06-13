// Wraps Tizen module "DataControl".

define(['Ti/_/lang', 'Tizen/_/DataControl/MappedDataControlConsumer', 'Tizen/_/DataControl/SQLDataControlConsumer', 'Ti/_/Evented'], 
function(lang, MappedDataControlConsumer, SQLDataControlConsumer, Evented) {
	return lang.mixProps(require.mix({}, Evented), {

		constants: {
			DATA_TYPE_MAP: 'MAP',
			DATA_TYPE_SQL: 'SQL',
		},

		getDataControlConsumer: function(providerId /*DOMString*/, dataId /*DOMString*/, type /*DataType*/) {
			var obj = tizen.datacontrol.getDataControlConsumer(providerId, dataId, type);
			if('select' in obj) {
				return new SQLDataControlConsumer(void 0, obj);
			} else if('getValue' in obj) {
				return new MappedDataControlConsumer(void 0, obj);
			} else {
				throw new Error('Object of unknown type');
			}
		}

	}, true);
});
