sap.ui.define([], () => {
	"use strict";

	return {
		confidenceText(iScore) {
			return iScore + "%";
		},

		classificationIcon(sClassification) {
			return sClassification === "signal" ? "sap-icon://accept" : "sap-icon://decline";
		},

		classificationState(sClassification) {
			return sClassification === "signal" ? "Success" : "None";
		},

		classificationText(sClassification) {
			return sClassification === "signal" ? "Signal" : "Noise";
		}
	};
});
