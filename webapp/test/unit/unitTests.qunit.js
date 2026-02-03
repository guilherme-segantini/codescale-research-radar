/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"test-resources/unit/model/formatter.qunit",
	"test-resources/unit/controller/RadarView.controller.qunit"
], () => {
	"use strict";
	QUnit.start();
});
