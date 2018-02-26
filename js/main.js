var estimator = new Estimator();

$('#TaxableIncomeInput').on('input', function () {
    window.taxableIncome = stripwhitecommas($(this).val());
    window.FY = stripwhitecommas($('#FinancialYearInput').val());
    calculate();
});
$('#FinancialYearInput').on('input', function () {
    window.FY = stripwhitecommas($(this).val());
    calculate();
});
$('#settingsModal').on('hidden.bs.modal', function () {
    calculate();
});

function calculate() {
  checkSettings();
  $("#TaxableIncomeOutput").html(moneyNumber(window.taxableIncome));
  var payableObject = estimator.calculateTaxPayable(window.taxableIncome,window.settings, window.FY);
  $("#TaxPayableVal").html(moneyNumber(payableObject.taxOnIncome));
  $("#MedicareVal").html(moneyNumber(payableObject.medicareLevy));
  $("#HelpVal").html(moneyNumber(payableObject.hecs));
  $("#MLSVal").html(moneyNumber(payableObject.medicareLevySurcharge));
  $("#LITOVal").html(moneyNumber(payableObject.offsets.lowIncomeTaxOffset));

  var sumPayable = payableObject.totalTaxesPayable;
  var sumOffsets = payableObject.offsets.lowIncomeTaxOffset;
  var amountPayable = sumPayable - sumOffsets;
  $("#SumOffset").html(moneyNumber(sumOffsets));
  $("#SumPayable").html(moneyNumber(sumPayable));
  $("#PayableVal").html(moneyNumber(amountPayable));
  $("#PayableVal2").html(moneyNumber(amountPayable));

  //TODO(Sean):Temporary budger repair levy
  //TODO(Sean):Excess private health reduction or refund
  //TODO(Sean):Financial supplement repayment
  //TODO(Sean):Trade Support Loan Repayment
  //TODO(Sean):Franking Credits
  //TODO(Sean):Foreign resident withholding credits
  //TODO(Sean):Seniors and Pensioners (SAPTO)
  //TODO(Sean):Superannuation Offset
  //TODO(Sean):Private health insurance
  
}

function checkSettings() {
  window.settings.healthinsurance = document.getElementById("healthinsurance").checked
  window.settings.hecs = document.getElementById("hecs").checked
}

function stripwhitecommas(str) {
  if (!str || 0 === str.length) {
    return str
  } else {
    return str.toString().replace(/[\s,]+/g,'').trim()
  }
}

function moneyNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatcomma(element) {
  return element.toString().replace(/ /g,'').replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function main() {
  window.settings = {};
  window.now = moment();
  if (window.now.month() < 6) {
    window.now.set('year', now.year() -1);
  }
  window.now.set('month', 5);
  window.now.set('date', 30);
  window.endFY = moment(window.now);
  window.startFY = moment(window.now.subtract(1, 'years').add(1,'days'));
  $("#FinancialYearInput").val(window.endFY.format("YYYY"));
  $("#FinancialYearInput").attr({"max": window.endFY.format("YYYY")});

  window.taxableIncome = 50000;
  window.FY = 2017;
  calculate();
}
main();
