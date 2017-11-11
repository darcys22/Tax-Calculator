$('#TaxableIncomeInput').on('input', function () {
    window.taxableIncome = stripwhitecommas($(this).val());
    calculate();
});
$('#FinancialYearInput').on('input', function () {
    calculate();
});
$('#settingsModal').on('hidden.bs.modal', function () {
    editSettings();
});

function editSettings() {
}

function calculate() {
  $("#TaxableIncomeOutput").html(moneyNumber(window.taxableIncome));
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
  var estimator = new Estimator();
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

}
main();
