function calculatePay() {
    let hours = parseFloat(document.getElementById("hours").value);
    let rate = parseFloat(document.getElementById("rate").value);
    let margin = parseFloat(document.getElementById("margin").value);
    let pension = parseFloat(document.getElementById("pension").value);
    const paymentFrequency = document.querySelector('input[name="payment_frequency"]:checked');
    if (paymentFrequency) {
        const selectedFrequency = paymentFrequency.value;

    if (isNaN(hours) || isNaN(rate) || isNaN(margin) || hours <= 0 || rate <= 0 || margin < 0) {
        alert("Please enter valid values.");
        return;
    }

    if (isNaN(pension)) || pension <= 0 {
        pension = 0
    } else {
        pension = pension/100
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
    if (paymentFrequency == 'Weekly') {
        frequency = 52
        LEL = 242
        UEL = 967
    } else if (paymentFrequency == 'Bi-weekly') {
        frequency = 26
        LEL = 242 * 2
        UEL = 967 * 2
    } else if (paymentFrequency == 'Monthly') {
        frequency = 12
        LEL = 1,048.67
        UEL = 4,186.33

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
            document.getElementById("employerNI").textContent = employerNI.toFixed(2);
            document.getElementById("appLevy").textContent = appLevy.toFixed(2);
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
    taxPay = finalTaxablePay
    niPay = finalTaxablePay
    if (taxPay > (125140/frequency)) {
        payeTax += (taxPay - (125140/frequency)) * 0.45;
        taxPay = 125140/frequency;
    }
    if (taxPay > (50270/frequency)) {
        payeTax += (taxPay - (50270/frequency)) * 0.40;
        taxPay = 50270/frequency;
    }
    if (taxPay > (12570/frequency)) {
        payeTax += (taxPay - (12570/frequency)) * 0.20;
    }

    // Employee NI Calculation
    let employeeNI = 0;
    if (niPay > UEL) {
        employeeNI += (niPay - UEL) * 0.02;
        niPay = UEL;
    }
    if (niPay > LEL) {
        employeeNI += (niPay - LEL) * 0.08;
    }

    let payeTakeHome = finalTaxablePay - payeTax - employeeNI;

    // Display Results
    document.getElementById("cisTax").textContent = cisTax.toFixed(2);
    document.getElementById("cisTakeHome").textContent = cisTakeHome.toFixed(2);
    document.getElementById("payeTax").textContent = payeTax.toFixed(2);
    document.getElementById("employeeNI").textContent = employeeNI.toFixed(2);
    document.getElementById("payeTakeHome").textContent = payeTakeHome.toFixed(2);
}
