'use strict';
'require view';
'require fs';
'require ui';

return view.extend({
	load: function() {
		return L.resolveDefault(fs.read('/etc/nftables.d/10-custom-filter-chains.nft'), '');
	},

	handleSave: function(ev) {
		var value = (document.querySelector('textarea').value || '').trim().replace(/\r\n/g, '\n') + '\n';

		return fs.write('/etc/nftables.d/10-custom-filter-chains.nft', value).then(function(rc) {
			document.querySelector('textarea').value = value;
			ui.addNotification(null, E('p', _('Contents have been saved.')), 'info');
			fs.exec('/etc/init.d/firewall', ['restart']);
		}).catch(function(e) {
			ui.addNotification(null, E('p', _('Unable to save contents: %s').format(e.message)));
		});
	},

	render: function(fwuser) {
		return E([
			E('h2', _('Firewall - Custom Rules')),
			E('p', {}, _('Custom ntf firewall rules.')),
			E('p', {}, E('textarea', { 'style': 'width:100%', 'rows': 25 }, [ fwuser != null ? fwuser : '' ]))
		]);
	},

	handleSaveApply: null,
	handleReset: null
});
