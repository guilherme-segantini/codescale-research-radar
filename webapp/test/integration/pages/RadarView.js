sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/PropertyStrictEquals"
], (Opa5, AggregationLengthEquals, PropertyStrictEquals) => {
	"use strict";

	Opa5.createPageObjects({
		onTheRadarView: {
			viewName: "RadarView",

			assertions: {
				iShouldSeeThePage() {
					return this.waitFor({
						id: "radarPage",
						success() {
							Opa5.assert.ok(true, "The RadarView page is displayed");
						},
						errorMessage: "Could not find the RadarView page"
					});
				},

				iShouldSeeThreePanel() {
					return this.waitFor({
						id: ["voiceAiPanel", "agentOrchestrationPanel", "durableRuntimePanel"],
						success(aPanels) {
							Opa5.assert.strictEqual(aPanels.length, 3, "All 3 focus area panels are displayed");
						},
						errorMessage: "Could not find all 3 panels"
					});
				},

				iShouldSeeVoiceAiPanel() {
					return this.waitFor({
						id: "voiceAiPanel",
						success(oPanel) {
							Opa5.assert.ok(oPanel.getVisible(), "Voice AI UX panel is visible");
						},
						errorMessage: "Voice AI UX panel not found"
					});
				},

				iShouldSeeAgentOrchestrationPanel() {
					return this.waitFor({
						id: "agentOrchestrationPanel",
						success(oPanel) {
							Opa5.assert.ok(oPanel.getVisible(), "Agent Orchestration panel is visible");
						},
						errorMessage: "Agent Orchestration panel not found"
					});
				},

				iShouldSeeDurableRuntimePanel() {
					return this.waitFor({
						id: "durableRuntimePanel",
						success(oPanel) {
							Opa5.assert.ok(oPanel.getVisible(), "Durable Runtime panel is visible");
						},
						errorMessage: "Durable Runtime panel not found"
					});
				},

				iShouldSeeItemsInVoiceAiList() {
					return this.waitFor({
						id: "voiceAiList",
						matchers: new AggregationLengthEquals({
							name: "items",
							length: 2
						}),
						success() {
							Opa5.assert.ok(true, "Voice AI list contains 2 items");
						},
						errorMessage: "Voice AI list does not have expected items"
					});
				},

				iShouldSeeItemsInAgentOrchestrationList() {
					return this.waitFor({
						id: "agentOrchestrationList",
						matchers: new AggregationLengthEquals({
							name: "items",
							length: 2
						}),
						success() {
							Opa5.assert.ok(true, "Agent Orchestration list contains 2 items");
						},
						errorMessage: "Agent Orchestration list does not have expected items"
					});
				},

				iShouldSeeItemsInDurableRuntimeList() {
					return this.waitFor({
						id: "durableRuntimeList",
						matchers: new AggregationLengthEquals({
							name: "items",
							length: 2
						}),
						success() {
							Opa5.assert.ok(true, "Durable Runtime list contains 2 items");
						},
						errorMessage: "Durable Runtime list does not have expected items"
					});
				},

				iShouldSeeFooterWithLastUpdated() {
					return this.waitFor({
						id: "lastUpdatedText",
						success(oText) {
							const sText = oText.getText();
							Opa5.assert.ok(
								sText.includes("Last Updated"),
								"Footer shows last updated text: " + sText
							);
						},
						errorMessage: "Footer last updated text not found"
					});
				}
			}
		}
	});
});
