sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
	"use strict";

	const FOCUS_AREA_MAP = {
		"voice_ai_ux": "voiceAiUx",
		"agent_orchestration": "agentOrchestration",
		"durable_runtime": "durableRuntime"
	};

	return BaseController.extend("com.codescale.radar.controller.RadarView", {
		onInit() {
			const oViewModel = new JSONModel({
				voiceAiUx: [],
				agentOrchestration: [],
				durableRuntime: [],
				lastUpdated: ""
			});
			this.getView().setModel(oViewModel, "view");

			const oDataModel = this.getOwnerComponent().getModel();
			oDataModel.attachRequestCompleted(() => {
				this._processRadarData(oDataModel);
			});

			// Handle case where data is already loaded
			if (oDataModel.getData() && oDataModel.getData().trends) {
				this._processRadarData(oDataModel);
			}
		},

		_processRadarData(oDataModel) {
			const oData = oDataModel.getData();
			if (!oData || !oData.trends) {
				return;
			}

			const oGrouped = {
				voiceAiUx: [],
				agentOrchestration: [],
				durableRuntime: []
			};

			oData.trends.forEach((oTrend) => {
				const sKey = FOCUS_AREA_MAP[oTrend.focus_area];
				if (sKey && oGrouped[sKey]) {
					oGrouped[sKey].push(oTrend);
				}
			});

			const oViewModel = this.getView().getModel("view");
			oViewModel.setProperty("/voiceAiUx", oGrouped.voiceAiUx);
			oViewModel.setProperty("/agentOrchestration", oGrouped.agentOrchestration);
			oViewModel.setProperty("/durableRuntime", oGrouped.durableRuntime);
			oViewModel.setProperty("/lastUpdated", this.getText("lastUpdatedLabel", [oData.radar_date]));
		}
	});
});
