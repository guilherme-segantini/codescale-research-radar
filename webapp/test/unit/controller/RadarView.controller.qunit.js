sap.ui.define([
	"com/codescale/radar/controller/RadarView.controller",
	"sap/ui/model/json/JSONModel"
], (RadarViewController, JSONModel) => {
	"use strict";

	QUnit.module("RadarView Controller - _processRadarData", {
		beforeEach() {
			this.oController = new RadarViewController();

			// Create mock view model
			this.oViewModel = new JSONModel({
				voiceAiUx: [],
				agentOrchestration: [],
				durableRuntime: [],
				lastUpdated: ""
			});

			// Save original methods
			this._origGetView = this.oController.getView;
			this._origGetOwnerComponent = this.oController.getOwnerComponent;
			this._origGetText = this.oController.getText;

			// Create mock view
			const that = this;
			this.oController.getView = function() {
				return {
					getModel: function(sName) {
						if (sName === "view") {
							return that.oViewModel;
						}
						return null;
					},
					setModel: function() {}
				};
			};

			// Create mock component
			this.oController.getOwnerComponent = function() {
				return {
					getModel: function(sName) {
						if (sName === "i18n") {
							return {
								getResourceBundle: function() {
									return {
										getText: function(sKey, aArgs) {
											if (sKey === "lastUpdatedLabel" && aArgs) {
												return "Last Updated: " + aArgs[0];
											}
											return sKey;
										}
									};
								}
							};
						}
						return null;
					}
				};
			};

			// Mock getText
			this.oController.getText = function(sKey, aArgs) {
				if (sKey === "lastUpdatedLabel" && aArgs) {
					return "Last Updated: " + aArgs[0];
				}
				return sKey;
			};
		},
		afterEach() {
			// Restore original methods
			this.oController.getView = this._origGetView;
			this.oController.getOwnerComponent = this._origGetOwnerComponent;
			this.oController.getText = this._origGetText;
			this.oViewModel.destroy();
			this.oController.destroy();
		}
	});

	QUnit.test("Should group trends by focus area correctly", function(assert) {
		// Arrange
		var oMockData = {
			radar_date: "2026-01-30",
			trends: [
				{ focus_area: "voice_ai_ux", tool_name: "LiveKit", classification: "signal" },
				{ focus_area: "voice_ai_ux", tool_name: "VoiceHype", classification: "noise" },
				{ focus_area: "agent_orchestration", tool_name: "LangGraph", classification: "signal" },
				{ focus_area: "durable_runtime", tool_name: "Temporal", classification: "signal" }
			]
		};
		var oDataModel = new JSONModel(oMockData);

		// Act
		this.oController._processRadarData(oDataModel);

		// Assert
		var aVoiceAi = this.oViewModel.getProperty("/voiceAiUx");
		var aAgentOrch = this.oViewModel.getProperty("/agentOrchestration");
		var aDurable = this.oViewModel.getProperty("/durableRuntime");

		assert.strictEqual(aVoiceAi.length, 2, "Voice AI UX has 2 trends");
		assert.strictEqual(aAgentOrch.length, 1, "Agent Orchestration has 1 trend");
		assert.strictEqual(aDurable.length, 1, "Durable Runtime has 1 trend");

		assert.strictEqual(aVoiceAi[0].tool_name, "LiveKit", "First Voice AI trend is LiveKit");
		assert.strictEqual(aAgentOrch[0].tool_name, "LangGraph", "Agent Orchestration trend is LangGraph");

		oDataModel.destroy();
	});

	QUnit.test("Should set lastUpdated with radar_date", function(assert) {
		// Arrange
		var oMockData = {
			radar_date: "2026-02-01",
			trends: []
		};
		var oDataModel = new JSONModel(oMockData);

		// Act
		this.oController._processRadarData(oDataModel);

		// Assert
		var sLastUpdated = this.oViewModel.getProperty("/lastUpdated");
		assert.strictEqual(sLastUpdated, "Last Updated: 2026-02-01", "Last updated contains radar date");

		oDataModel.destroy();
	});

	QUnit.test("Should handle empty trends array", function(assert) {
		// Arrange
		var oMockData = {
			radar_date: "2026-01-30",
			trends: []
		};
		var oDataModel = new JSONModel(oMockData);

		// Act
		this.oController._processRadarData(oDataModel);

		// Assert
		assert.strictEqual(this.oViewModel.getProperty("/voiceAiUx").length, 0, "Voice AI is empty");
		assert.strictEqual(this.oViewModel.getProperty("/agentOrchestration").length, 0, "Agent Orchestration is empty");
		assert.strictEqual(this.oViewModel.getProperty("/durableRuntime").length, 0, "Durable Runtime is empty");

		oDataModel.destroy();
	});

	QUnit.test("Should handle null data gracefully", function(assert) {
		// Arrange
		var oDataModel = new JSONModel(null);

		// Act - should not throw
		this.oController._processRadarData(oDataModel);

		// Assert - view model should remain unchanged
		assert.strictEqual(this.oViewModel.getProperty("/voiceAiUx").length, 0, "Voice AI remains empty");

		oDataModel.destroy();
	});

	QUnit.test("Should handle data without trends property", function(assert) {
		// Arrange
		var oDataModel = new JSONModel({ radar_date: "2026-01-30" });

		// Act - should not throw
		this.oController._processRadarData(oDataModel);

		// Assert - view model should remain unchanged
		assert.strictEqual(this.oViewModel.getProperty("/voiceAiUx").length, 0, "Voice AI remains empty");

		oDataModel.destroy();
	});

	QUnit.test("Should ignore unknown focus areas", function(assert) {
		// Arrange
		var oMockData = {
			radar_date: "2026-01-30",
			trends: [
				{ focus_area: "unknown_area", tool_name: "Mystery Tool", classification: "signal" },
				{ focus_area: "voice_ai_ux", tool_name: "LiveKit", classification: "signal" }
			]
		};
		var oDataModel = new JSONModel(oMockData);

		// Act
		this.oController._processRadarData(oDataModel);

		// Assert
		assert.strictEqual(this.oViewModel.getProperty("/voiceAiUx").length, 1, "Only valid focus area trend is added");

		oDataModel.destroy();
	});
});
