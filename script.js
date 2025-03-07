function calculatePay() {
    let hours = parseFloat(document.getElementById("hours").value);
    let rate = parseFloat(document.getElementById("rate").value);
    let margin = parseFloat(document.getElementById("margin").value);

    if (isNaN(hours) || isNaN(rate) || isNaN(margin) || hours <= 0 || rate <= 0 || margin < 0) {
        alert("Please enter valid values.");
        return;
    }

    let grossPay = hours * rate;
    let companyIncome = hours * rate;
    let basicPay = hours * 11.44;

    let minHolidayPay = basicPay * 0.1207; 
    let minEmployerNI = (basicPay - 175) * 0.138;  
    let minAppLevy = basicPay * 0.005;  

    if (minEmployerNI < 0) minEmployerNI = 0;  // No Employer NI below the threshold

    let minTotalCost = basicPay + minHolidayPay + minEmployerNI + minAppLevy + margin;

    // **Check if the company income is too low**
    if (companyIncome < minTotalCost) {
        alert("Rate is too low for umbrella PAYE");
    }

    // CIS Calculation
    let cisTaxablePay = grossPay - margin;
    let cisTax = cisTaxablePay * 0.20;
    let cisTakeHome = cisTaxablePay - cisTax;

    // PAYE Calculation
    let employerNIRate = 0.138;
    let employerNIThreshold = 175;
    let left = 0;
    let right = companyIncome; // Set an upper bound for `additional` (could be adjusted)
    let tolerance = 0.05;  // Desired accuracy
    let finalTaxablePay = 0;

    let maxIterations = 1000000;
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        let additional = (left + right) / 2;  // Midpoint of the range
        let holidayPay = (basicPay + additional) * 0.1207;
        let taxablePay = basicPay + additional + holidayPay;

        // Employer NI calculation
        let employerNI = taxablePay > employerNIThreshold ? (taxablePay - employerNIThreshold) * employerNIRate : 0;

        // Apprenticeship Levy
        let appLevy = taxablePay * 0.005;
        let summation = taxablePay + margin + appLevy + employerNI;

        if (Math.abs(summation - companyIncome) < tolerance) {
            finalTaxablePay = taxablePay;
            console.log(`Found one set of amounts`);
            console.log(`Basic pay: £${basicPay.toFixed(2)}`);
            console.log(`Additional taxable: £${additional.toFixed(2)}`);
            console.log(`Holiday pay: £${holidayPay.toFixed(2)}`);
            console.log(`Employer NI: £${employerNI.toFixed(2)}`);
            console.log(`App. Levy: £${appLevy.toFixed(2)}`);
            break;
        }

        // Adjust the range for binary search
        if (summation < companyIncome) {
            left = additional;  // Increase the additional value
        } else {
            right = additional;  // Decrease the additional value
        }
    }
    // PAYE Income Tax Calculation
    let payeTax = 0;
    if (finalTaxablePay > (125140/52)) {
        payeTax += (finalTaxablePay - (125140/52)) * 0.45;
        finalTaxablePay = 125140/52;
    }
    if (finalTaxablePay > (50270/52)) {
        payeTax += (finalTaxablePay - (50270/52)) * 0.40;
        finalTaxablePay = 50270/52;
    }
    if (finalTaxablePay > (12570/52)) {
        payeTax += (finalTaxablePay - (12570/52)) * 0.20;
    }

    // Employee NI Calculation
    let employeeNI = 0;
    if (finalTaxablePay > 967) {
        employeeNI += (finalTaxablePay - 967) * 0.02;
        finalTaxablePay = 967;
    }
    if (finalTaxablePay > 242) {
        employeeNI += (finalTaxablePay - 242) * 0.08;
    }

    let payeTakeHome = finalTaxablePay - payeTax - employeeNI;

    // Display Results
    document.getElementById("cisTax").textContent = cisTax.toFixed(2);
    document.getElementById("cisTakeHome").textContent = cisTakeHome.toFixed(2);
    document.getElementById("payeTaxNI").textContent = (payeTax + employeeNI).toFixed(2);
    document.getElementById("payeTakeHome").textContent = payeTakeHome.toFixed(2);
}
