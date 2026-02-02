sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], (Controller, History) => {
	"use strict";

	return Controller.extend("com.codescale.radar.controller.BaseController", {
		getRouter() {
			return this.getOwnerComponent().getRouter();
		},

		getModel(sName) {
			return this.getView().getModel(sName);
		},

		setModel(oModel, sName) {
			this.getView().setModel(oModel, sName);
		},

		getText(sKey, aArgs) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey, aArgs);
		},

		navTo(sRoute, oParams) {
			this.getRouter().navTo(sRoute, oParams);
		},

		onNavBack() {
			const sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.navTo("radar", {}, true);
			}
		}
	});
});
