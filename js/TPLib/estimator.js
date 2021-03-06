/*
* EstimatorJS 0.0.1 - Australian Tax Payable Estimator
* Copyright (c) 2017 Sean Darcy (Darcys22@gmail.com)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
* ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
* THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
  else if (typeof define === 'function' && define.amd) { define(definition); }
  else { context[name] = definition(); }
})('Estimator', this, function () {
  'use strict';

  var Estimator = function (options) {
    var nativeForEach, nativeMap;
    nativeForEach = Array.prototype.forEach;
    nativeMap = Array.prototype.map;

    this.each = function (obj, iterator, context) {
      if (obj === null) {
        return;
      }
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === {}) return;
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === {}) return;
          }
        }
      }
    };

    this.map = function(obj, iterator, context) {
      var results = [];
      // Not using strict equality so that this acts as a
      // shortcut to checking for `null` and `undefined`.
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      this.each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    };

    if (typeof options == 'object'){
      //this.hasher = options.hasher;
    } else if(typeof options == 'function'){
      //this.hasher = options;
    }
  };

  Estimator.prototype = {

    calculateTaxPayable: function (taxableIncome, parameters, year) {
			var taxPayable = {};
      taxPayable.offsets = {};

      //Tax
			taxPayable.taxOnIncome = this.taxOnTaxableIncome(taxableIncome,year);

      //HECS
			taxPayable.hecs= 0;
      if (parameters.hecs) {
        taxPayable.hecs = this.hecsCalc(taxableIncome,year);
      }

      //Medicare Levy
      taxPayable.medicareLevy = this.medicareLevyCalc(taxableIncome,year);

      //Medicare Levy Surchage
			taxPayable.medicareLevySurcharge = 0;
      if (!parameters.healthinsurance) {
        taxPayable.medicareLevySurcharge = this.medicareLevySurchargeCalc(taxableIncome,year);
      }

      //Low Income Tax Offset
			taxPayable.offsets.lowIncomeTaxOffset = this.lowIncomeTaxOffset(taxableIncome,year);
      taxPayable.totalTaxesPayable =  taxPayable.taxOnIncome + taxPayable.medicareLevy + taxPayable.medicareLevySurcharge + taxPayable.hecs;
      if (taxPayable.totalTaxesPayable < taxPayable.offsets.lowIncomeTaxOffset)
        taxPayable.offsets.lowIncomeTaxOffset = taxPayable.totalTaxesPayable;


      return taxPayable;

		},
    
    taxOnTaxableIncome: function(taxableIncome, year) {
      //2018 FY
      if (year == '2018') {
        var offset = 0;
        if (taxableIncome <=  18200) {
          return 0;
        }
        if (taxableIncome <=  37000) {
          return this.round(0 + ((taxableIncome - 18200) * 0.19),0);
        }
        if (taxableIncome <=  87000) {
          return this.round(3572 + ((taxableIncome - 37000) * 0.325),0);
        }
        if (taxableIncome <=  180000) {
          return this.round(19822 + ((taxableIncome - 87000) * 0.37),0);
        }
        return this.round(54232 + ((taxableIncome - 180000) * 0.45),0);
      //2019 FY
      } else if (year == '2019') {
        var offset = 0;
        if (taxableIncome <=  18200) {
          return 0;
        }
        if (taxableIncome <=  37000) {
          return this.round(0 + ((taxableIncome - 18200) * 0.19),0);
        }
        if (taxableIncome <=  87000) {
          return this.round(3572 + ((taxableIncome - 37000) * 0.325),0);
        }
        if (taxableIncome <=  180000) {
          return this.round(19822 + ((taxableIncome - 87000) * 0.37),0);
        }
        return this.round(54232 + ((taxableIncome - 180000) * 0.45),0);
      }
		},

    hecsCalc: function(taxableIncome, year) {
      //2018 FY
      if (year == '2018') {
        var amount = 0;

        var weeklyIncome = taxableIncome/52

        if (weeklyIncome < 1073.99) { 
          amount = 0;
        } else if (weeklyIncome < 1195.99) { 
          amount = weeklyIncome * 0.04;
        } else if (weeklyIncome < 1318.99) { 
          amount = weeklyIncome * 0.045;
        } else if (weeklyIncome < 1387.99) { 
          amount = weeklyIncome * 0.05;
        } else if (weeklyIncome < 1491.99) { 
          amount = weeklyIncome * 0.055;
        } else if (weeklyIncome < 1615.99) { 
          amount = weeklyIncome * 0.06;
        } else if (weeklyIncome < 1700.99) { 
          amount = weeklyIncome * 0.065;
        } else if (weeklyIncome < 1871.99) { 
          amount = weeklyIncome * 0.07;
        } else if (weeklyIncome < 1994.99) { 
          amount = weeklyIncome * 0.075;
        } else { 
          amount = weeklyIncome * 0.08;
        } 

        return this.round(amount * 52,0);
      //2019 FY
      } else if (year == '2019') {
        var amount = 0;

        var weeklyIncome = taxableIncome/52

        if (weeklyIncome < 1073.99) { 
          amount = 0;
        } else if (weeklyIncome < 1195.99) { 
          amount = weeklyIncome * 0.04;
        } else if (weeklyIncome < 1318.99) { 
          amount = weeklyIncome * 0.045;
        } else if (weeklyIncome < 1387.99) { 
          amount = weeklyIncome * 0.05;
        } else if (weeklyIncome < 1491.99) { 
          amount = weeklyIncome * 0.055;
        } else if (weeklyIncome < 1615.99) { 
          amount = weeklyIncome * 0.06;
        } else if (weeklyIncome < 1700.99) { 
          amount = weeklyIncome * 0.065;
        } else if (weeklyIncome < 1871.99) { 
          amount = weeklyIncome * 0.07;
        } else if (weeklyIncome < 1994.99) { 
          amount = weeklyIncome * 0.075;
        } else { 
          amount = weeklyIncome * 0.08;
        } 

        return this.round(amount * 52,0);
      }
		}, 

    lowIncomeTaxOffset: function(taxableIncome, year) {
      //2018 FY
      if (year == '2018') {
        var offset = 0;
        if (taxableIncome <=  37000) {
          offset = 445;
        } else if (taxableIncome <=  66666) {
          offset = this.round(445 - ((taxableIncome - 37000) * 0.015),0);
        }
        return offset;
      //2019 FY
      } else if (year == '2019') {
        var offset = 0;
        if (taxableIncome <=  37000) {
          offset = 445;
        } else if (taxableIncome <=  66666) {
          offset = this.round(445 - ((taxableIncome - 37000) * 0.015),0);
        }
        return offset;
      }
		},

    medicareLevyCalc: function(taxableIncome, year) {
      //2018 FY
      if (year == '2018') {
        var levy = 0;
        if (taxableIncome <=  21655) {
          levy = 0;
        } else if (taxableIncome <=  27068) {
          levy = this.round((taxableIncome-21655)*0.1,0);
        } else {
          levy = this.round(taxableIncome* 0.02,0);
        }
        return levy;
      //2019 FY
      } else if (year == '2019') {
        var levy = 0;
        if (taxableIncome <=  21655) {
          levy = 0;
        } else if (taxableIncome <=  27068) {
          levy = this.round((taxableIncome-21655)*0.1,0);
        } else {
          levy = this.round(taxableIncome* 0.02,0);
        }
        return levy;
      }
		},

    medicareLevySurchargeCalc: function(taxableIncome, year) {
      //2018 FY
      if (year == '2018') {
        var surcharge = 0;
        if (taxableIncome <=  90000) {
          surcharge = 0;
        } else if (taxableIncome <=  105000) {
          surcharge = this.round(taxableIncome * 0.01,0);
        } else if (taxableIncome <=  140000) {
          surcharge = this.round(taxableIncome * 0.0125,0);
        } else {
          surcharge = this.round(taxableIncome * 0.015,0);
        }
        return surcharge;
      //2019 FY
      } else if (year == '2019') {
        var surcharge = 0;
        if (taxableIncome <=  90000) {
          surcharge = 0;
        } else if (taxableIncome <=  105000) {
          surcharge = this.round(taxableIncome * 0.01,0);
        } else if (taxableIncome <=  140000) {
          surcharge = this.round(taxableIncome * 0.0125,0);
        } else {
          surcharge = this.round(taxableIncome * 0.015,0);
        }
        return surcharge;
      }
		},

    round: function(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
		}

  };


  return Estimator;

});
