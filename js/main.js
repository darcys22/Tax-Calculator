$('#settingsModal').on('hidden.bs.modal', function () {
    editSettings();
});

function editSettings() {
    window.payer = $('#payer_form').serializeObject();
    var payerheading = document.getElementById('payername');
    payerheading.innerHTML = '';
    var text = document.createElement('small');
    text.appendChild(document.createTextNode(window.payer.tradingName || window.payer.name))
    text.appendChild(document.createTextNode( " - " + window.payer.ABN));
    payerheading.appendChild(text);
    openvalidate();
}

function stripwhitecommas(str) {
  if (!str || 0 === str.length) {
    return str
  } else {
    return str.toString().replace(/[\s,]+/g,'').trim()
  }
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function formatCapitalize(element) {
  element.value = toTitleCase(element.value.toString());
}

function moneyNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function tableCreate() {
    //var tbdy = document.getElementById('contractortable');
    //tbdy.innerHTML = '';
    //for (var i = 0; i < window.contractors.length; i++) {
        //var tr = document.createElement('tr');
        //var td = document.createElement('td');
        //var name = window.contractors[i].tradingName || window.contractors[i].businessName || window.contractors[i].name + ' ' + window.contractors[i].surname
        //td.appendChild(document.createTextNode(name))
        //tr.appendChild(td)
        //var td = document.createElement('td');
        //td.appendChild(document.createTextNode(window.contractors[i].abn))
        //tr.appendChild(td)
        //var td = document.createElement('td');
        //td.appendChild(document.createTextNode("$" + moneyNumber(window.contractors[i].grossPayments)));
        //tr.appendChild(td)
        //var td = document.createElement('td');
        //td.appendChild(document.createTextNode("$" + moneyNumber(window.contractors[i].gst)));
        //tr.appendChild(td)
        //var td = document.createElement('td');
        //var btn = document.createElement('button');
        //btn.className = 'btn btn-warning';
        //btn.setAttribute('data-param', i);
        //btn.onclick = function () {editContractor(this.getAttribute('data-param'));}; 
        //btn.innerHTML = "Edit";
        //td.appendChild(btn)
        //tr.appendChild(td)
        //var td = document.createElement('td');
        //var btn = document.createElement('button');
        //btn.className = 'btn btn-danger';
        //btn.setAttribute('data-param', i);
        //btn.onclick = function () {deleteContractor(this.getAttribute('data-param'));}; 
        //btn.innerHTML = "Delete";
        //td.appendChild(btn)
        //tr.appendChild(td)
        //tbdy.appendChild(tr);
    //}
}

function formatcomma(element) {
  return element.toString().replace(/ /g,'').replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function initdates() {
}

function main() {
  var estimator = new Estimator();
  console.log(estimator.lowIncomeTaxOffset(50000,2017));
  //tableCreate();
  window.now = moment();
  if (window.now.month() < 6) {
    window.now.set('year', now.year() -1);
  }
  window.now.set('month', 5);
  window.now.set('date', 30);
  window.endFY = moment(window.now);
  window.startFY = moment(window.now.subtract(1, 'years').add(1,'days'));
  $("#fybox").val(window.endFY.format("YYYY"));

  initdates();

}
main();
