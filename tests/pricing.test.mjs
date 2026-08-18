import assert from "node:assert/strict";
import test from "node:test";
import { formatRepairPrice, formatNumber, brands, allModels } from "../lib/data.ts";
import { translations } from "../lib/i18n/translations.ts";

test("formatNumber adds space thousands separators", () => {
  assert.equal(formatNumber(1490), "1 490");
  assert.equal(formatNumber(12000), "12 000");
  assert.equal(formatNumber(500), "500");
});

test("formatRepairPrice handles range, approx, from, and exact modes", () => {
  // Range formatting
  const rangeRepair = { priceFrom: 1490, priceTo: 1790, currency: "Kč" };
  assert.equal(formatRepairPrice(rangeRepair, "cs"), "1 490–1 790 Kč");
  assert.equal(formatRepairPrice(rangeRepair, "cs", { showCca: true }), "cca 1 490–1 790 Kč");
  assert.equal(formatRepairPrice(rangeRepair, "en", { showCca: true }), "cca 1 490–1 790 Kč");
  assert.equal(formatRepairPrice(rangeRepair, "ru", { showCca: true }), "ок. 1 490–1 790 Kč");

  // From formatting
  const fromRepair = { priceFrom: 1490, currency: "Kč" };
  assert.equal(formatRepairPrice(fromRepair, "cs"), "od 1 490 Kč");
  assert.equal(formatRepairPrice(fromRepair, "en"), "from 1 490 Kč");
  assert.equal(formatRepairPrice(fromRepair, "ru"), "от 1 490 Kč");

  // Exact formatting
  const exactRepair = { exactPrice: 1990, currency: "Kč" };
  assert.equal(formatRepairPrice(exactRepair, "cs"), "1 990 Kč");

  // Diagnostics 0–500
  const diagRepair = { priceFrom: 0, priceTo: 500, currency: "Kč" };
  assert.equal(formatRepairPrice(diagRepair, "cs"), "0–500 Kč");
});

test("Translations contain exact required pricing labels and trust promises across EN, CS, RU", () => {
  // English
  assert.equal(translations.en.pricing.partsAndLaborIncluded, "Parts and labor included");
  assert.equal(translations.en.pricing.finalPriceConfirmed, "We always confirm the final price before starting the repair.");
  assert.match(translations.en.pricing.noSurpriseChargesDesc, /No repair begins before you approve the final price/i);

  // Czech
  assert.equal(translations.cs.pricing.partsAndLaborIncluded, "Cena včetně dílu a práce");
  assert.equal(translations.cs.pricing.finalPriceConfirmed, "Cenu vždy potvrdíme před zahájením opravy.");
  assert.match(translations.cs.pricing.noSurpriseChargesDesc, /Žádná oprava nezačne bez vašeho schválení konečné ceny/i);

  // Russian
  assert.equal(translations.ru.pricing.partsAndLaborIncluded, "Запчасть и работа включены");
  assert.equal(translations.ru.pricing.finalPriceConfirmed, "Окончательную стоимость мы всегда согласовываем до начала ремонта.");
  assert.match(translations.ru.pricing.noSurpriseChargesDesc, /Ни один ремонт не начинается без согласования цены/i);
});

test("Configurable example repair prices meet all specification rules", () => {
  // Check iPhone 13 specific battery range
  const apple = brands.find(b => b.id === "apple");
  assert.ok(apple, "Apple brand should exist");

  const iphone13 = apple.models.find(m => m.name === "iPhone 13");
  assert.ok(iphone13, "iPhone 13 model should exist");

  const iphone13Battery = iphone13.repairs.find(r => r.id === "battery");
  assert.ok(iphone13Battery, "iPhone 13 battery repair should exist");
  assert.equal(iphone13Battery.priceFrom, 1490);
  assert.equal(iphone13Battery.priceTo, 1790);
  assert.equal(iphone13Battery.partsIncluded, true);
  assert.equal(iphone13Battery.laborIncluded, true);
  assert.equal(iphone13Battery.finalPriceRequiresConfirmation, true);

  // Check MacBook cleaning
  const macbook = apple.models.find(m => m.category === "MacBook");
  assert.ok(macbook, "MacBook model should exist");
  const cleaning = macbook.repairs.find(r => r.id === "cleaning");
  assert.ok(cleaning, "MacBook cleaning should exist");
  assert.equal(cleaning.priceFrom, 700);
  assert.equal(cleaning.priceTo, 1200);

  // Check MacBook battery
  const macBattery = macbook.repairs.find(r => r.id === "battery");
  assert.equal(macBattery.priceFrom, 2500);
  assert.equal(macBattery.priceTo, 5000);

  // Check MacBook display
  const macDisplay = macbook.repairs.find(r => r.id === "display");
  assert.equal(macDisplay.priceFrom, 5000);
  assert.equal(macDisplay.priceTo, 12000);

  // Check Samsung Galaxy Phone
  const samsung = brands.find(b => b.id === "samsung");
  assert.ok(samsung, "Samsung brand should exist");
  const s25 = samsung.models.find(m => m.name === "Galaxy S25");
  assert.ok(s25, "Galaxy S25 should exist");
  const s25Battery = s25.repairs.find(r => r.id === "battery");
  assert.equal(s25Battery.priceFrom, 1000);
  assert.equal(s25Battery.priceTo, 2000);
  const s25Display = s25.repairs.find(r => r.id === "screen");
  assert.equal(s25Display.priceFrom, 2000);
  assert.equal(s25Display.priceTo, 6000);

  // Check all repairs have partsIncluded and laborIncluded set to true
  for (const model of allModels) {
    for (const repair of model.repairs) {
      assert.equal(repair.partsIncluded, true, `Repair ${repair.name} on ${model.name} must include parts`);
      assert.equal(repair.laborIncluded, true, `Repair ${repair.name} on ${model.name} must include labor`);
    }
  }

  // Check iPhone back glass, camera, charging, audio
  const iphone14 = apple.models.find(m => m.name === "iPhone 14");
  assert.ok(iphone14, "iPhone 14 should exist");

  const backGlass = iphone14.repairs.find(r => r.id === "back-glass");
  assert.ok(backGlass, "Back glass repair should exist");
  assert.equal(backGlass.priceFrom, 1500);
  assert.equal(backGlass.priceTo, 3500);

  const camera = iphone14.repairs.find(r => r.id === "camera");
  assert.ok(camera, "Camera repair should exist");
  assert.equal(camera.priceFrom, 1500);
  assert.equal(camera.priceTo, 3500);

  const charging = iphone14.repairs.find(r => r.id === "charging");
  assert.ok(charging, "Charging repair should exist");
  assert.equal(charging.priceFrom, 1200);
  assert.equal(charging.priceTo, 2500);

  const speakerMic = iphone14.repairs.find(r => r.id === "speaker-mic");
  assert.ok(speakerMic, "Speaker/mic repair should exist");
  assert.equal(speakerMic.priceFrom, 1000);
  assert.equal(speakerMic.priceTo, 2000);

  // Check iPad display
  const ipad = apple.models.find(m => m.category === "iPad");
  assert.ok(ipad, "iPad should exist");
  const ipadDisplay = ipad.repairs.find(r => r.id === "screen");
  assert.equal(ipadDisplay.priceFrom, 2000);
  assert.equal(ipadDisplay.priceTo, 5000);

  // Check Diagnostics Policy
  const diag = iphone14.repairs.find(r => r.id === "diagnostics");
  assert.ok(diag, "Diagnostics should exist");
  assert.equal(diag.priceFrom, 0);
  assert.equal(diag.priceTo, 500);
  assert.equal(diag.diagnosticsPolicy, "included_if_repaired");
});

