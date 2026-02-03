sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/test/Opa5"
], (opaTest, Opa5) => {
	"use strict";

	QUnit.module("Radar View Journey");

	Opa5.extendConfig({
		viewNamespace: "com.codescale.radar.view.",
		autoWait: true
	});

	opaTest("Should see the RadarView with 3 panels", function(Given, When, Then) {
		// Arrange
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "com.codescale.radar"
			}
		});

		// Assert
		Then.onTheRadarView.iShouldSeeThePage();
		Then.onTheRadarView.iShouldSeeThreePanel();
		Then.onTheRadarView.iShouldSeeVoiceAiPanel();
		Then.onTheRadarView.iShouldSeeAgentOrchestrationPanel();
		Then.onTheRadarView.iShouldSeeDurableRuntimePanel();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should display items in all focus area lists", function(Given, When, Then) {
		// Arrange
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "com.codescale.radar"
			}
		});

		// Assert - each panel should have 2 items from mock data
		Then.onTheRadarView.iShouldSeeItemsInVoiceAiList();
		Then.onTheRadarView.iShouldSeeItemsInAgentOrchestrationList();
		Then.onTheRadarView.iShouldSeeItemsInDurableRuntimeList();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should show last updated in footer", function(Given, When, Then) {
		// Arrange
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "com.codescale.radar"
			}
		});

		// Assert
		Then.onTheRadarView.iShouldSeeFooterWithLastUpdated();

		// Cleanup
		Then.iTeardownMyApp();
	});
});
