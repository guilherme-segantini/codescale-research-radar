sap.ui.define([
	"com/codescale/radar/model/formatter"
], (formatter) => {
	"use strict";

	QUnit.module("formatter - confidenceText");

	QUnit.test("Should format integer score as percentage string", (assert) => {
		assert.strictEqual(formatter.confidenceText(92), "92%", "92 formatted as 92%");
		assert.strictEqual(formatter.confidenceText(0), "0%", "0 formatted as 0%");
		assert.strictEqual(formatter.confidenceText(100), "100%", "100 formatted as 100%");
	});

	QUnit.test("Should handle edge cases", (assert) => {
		assert.strictEqual(formatter.confidenceText(50), "50%", "50 formatted as 50%");
		assert.strictEqual(formatter.confidenceText(1), "1%", "1 formatted as 1%");
		assert.strictEqual(formatter.confidenceText(99), "99%", "99 formatted as 99%");
	});

	QUnit.module("formatter - classificationIcon");

	QUnit.test("Should return accept icon for signal", (assert) => {
		assert.strictEqual(
			formatter.classificationIcon("signal"),
			"sap-icon://accept",
			"Signal returns accept icon"
		);
	});

	QUnit.test("Should return decline icon for noise", (assert) => {
		assert.strictEqual(
			formatter.classificationIcon("noise"),
			"sap-icon://decline",
			"Noise returns decline icon"
		);
	});

	QUnit.test("Should return decline icon for unknown classification", (assert) => {
		assert.strictEqual(
			formatter.classificationIcon("unknown"),
			"sap-icon://decline",
			"Unknown classification defaults to decline icon"
		);
		assert.strictEqual(
			formatter.classificationIcon(""),
			"sap-icon://decline",
			"Empty string defaults to decline icon"
		);
	});

	QUnit.module("formatter - classificationState");

	QUnit.test("Should return Success state for signal", (assert) => {
		assert.strictEqual(
			formatter.classificationState("signal"),
			"Success",
			"Signal returns Success state"
		);
	});

	QUnit.test("Should return None state for noise", (assert) => {
		assert.strictEqual(
			formatter.classificationState("noise"),
			"None",
			"Noise returns None state"
		);
	});

	QUnit.test("Should return None state for unknown classification", (assert) => {
		assert.strictEqual(
			formatter.classificationState("invalid"),
			"None",
			"Invalid classification defaults to None state"
		);
	});

	QUnit.module("formatter - classificationColor");

	QUnit.test("Should return green color for signal", (assert) => {
		assert.strictEqual(
			formatter.classificationColor("signal"),
			"#2b7c2b",
			"Signal returns green color"
		);
	});

	QUnit.test("Should return gray color for noise", (assert) => {
		assert.strictEqual(
			formatter.classificationColor("noise"),
			"#999999",
			"Noise returns gray color"
		);
	});

	QUnit.test("Should return gray color for unknown classification", (assert) => {
		assert.strictEqual(
			formatter.classificationColor("other"),
			"#999999",
			"Unknown classification defaults to gray color"
		);
	});
});
