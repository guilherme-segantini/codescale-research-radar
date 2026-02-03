/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"test-resources/integration/pages/RadarView",
	"test-resources/integration/RadarJourney"
], (Opa5) => {
	"use strict";

	Opa5.extendConfig({
		viewNamespace: "com.codescale.radar.view.",
		autoWait: true
	});

	QUnit.start();
});
