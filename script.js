function calculatePay() {
    let hours = parseFloat(document.getElementById("hours").value);
    let rate = parseFloat(document.getElementById("rate").value);
    let margin = parseFloat(document.getElementById("margin").value);
    const paymentFrequency = document.querySelector('input[name="payment_frequency"]:checked');
    if (paymentFrequency) {
        const selectedFrequency = paymentFrequency.value;
    }

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

    if (minEmployerNI < 0) minEmployerNI = 0;

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
    let right = companyIncome;
    let tolerance = 0.05;
    let finalTaxablePay = 0;
    if (paymentFrequency.value == 'Weekly') {
        frequency = 52;
        LEL = 242;
        UEL = 967;
    } else if (paymentFrequency.value == 'Bi-weekly') {
        frequency = 26;
        LEL = 242 * 2;
        UEL = 967 * 2;
    } else if (paymentFrequency.value == 'Monthly') {
        frequency = 12;
        LEL = 1,048.67;
        UEL = 4,186.33;
    }

    let maxIterations = 1000000;
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        let additional = (left + right) / 2;
        let holidayPay = (basicPay + additional) * 0.1207;
        let taxablePay = basicPay + additional + holidayPay;
        let employerNI = taxablePay > employerNIThreshold ? (taxablePay - employerNIThreshold) * employerNIRate : 0;
        let appLevy = taxablePay * 0.005;
        let summation = taxablePay + margin + appLevy + employerNI;
        if (Math.abs(summation - companyIncome) < tolerance) {
            finalTaxablePay = taxablePay;
            document.getElementById("employerNI").textContent = employerNI.toFixed(2);
            document.getElementById("appLevy").textContent = appLevy.toFixed(2);
            break;
        }
        if (summation < companyIncome) {
            left = additional;
        } else {
            right = additional;
        }
    }

    let payeTax = 0;
    taxPay = finalTaxablePay;
    niPay = finalTaxablePay;
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

    let employeeNI = 0;
    if (niPay > UEL) {
        employeeNI += (niPay - UEL) * 0.02;
        niPay = UEL;
    }
    if (niPay > LEL) {
        employeeNI += (niPay - LEL) * 0.08;
    }

    let payeTakeHome = finalTaxablePay - payeTax - employeeNI;


    let leftPens = 0;
    let rightPens = companyIncome;
    let finalTaxablePayPens = 0;
    for (let iteration = 0; iteration < maxIterations; iteration++) {
        let additionalPens = (leftPens + rightPens) / 2;
        let holidayPayPens = (basicPay + additionalPens) * 0.1207;
        let taxablePayPens = basicPay + additionalPens + holidayPayPens;
        let employerNIPens = taxablePayPens > employerNIThreshold ? (taxablePayPens - employerNIThreshold) * employerNIRate : 0;
        let appLevyPens = taxablePayPens * 0.005;
        if (taxablePayPens > 967) {
            let employerPens = (967 - 120) * 0.03;
        } else if (taxablePayPens > 120) {
            let employerPens = (taxablePayPens - 120) * 0.03;
        } else {
            let employerPens = 0;
        }
        let summationPens = taxablePayPens + margin + appLevyPens + employerNIPens + employerPens;
        if (Math.abs(summationPens - companyIncome) < tolerance) {
            finalTaxablePayPens = taxablePayPens;
            document.getElementById("employerNIPens").textContent = employerNIPens.toFixed(2);
            document.getElementById("appLevyPens").textContent = appLevyPens.toFixed(2);
            document.getElementById("employerPens").textContent = employerPens.toFixed(2);
            break;
        }
        if (summationPens < companyIncome) {
            leftPens = additionalPens;
        } else {
            rightPens = additionalPens;
        }
    }

    let payeTaxPens = 0;
    taxPayPens = finalTaxablePayPens;
    niPayPens = finalTaxablePayPens;
    pensPay = finalTaxablePayPens;
    if (taxPayPens > (125140/frequency)) {
        payeTaxPens += (taxPayPens - (125140/frequency)) * 0.45;
        taxPayPens = 125140/frequency;
    }
    if (taxPayPens > (50270/frequency)) {
        payeTaxPens += (taxPayPens - (50270/frequency)) * 0.40;
        taxPayPens = 50270/frequency;
    }
    if (taxPayPens > (12570/frequency)) {
        payeTaxPens += (taxPayPens - (12570/frequency)) * 0.20;
    }

    let employeeNIPens = 0;
    if (niPayPens > UEL) {
        employeeNIPens += (niPayPens - UEL) * 0.02;
        niPayPens = UEL;
    }
    if (niPayPens > LEL) {
        employeeNIPens += (niPayPens - LEL) * 0.08;
    }

    let employeePens = 0;
    if (pensPay > 967) {
        employeePens = (967 - 120) * 0.04;
    } else if (pensPay > 120) {
        employeePens = (pensPay - 120) * 0.04;
    } else {
        employeePens = 0;
    }

    let payeTakeHomePens = finalTaxablePayPens - payeTaxPens - employeeNIPens - employeePens;
        
    document.getElementById("cisTax").textContent = cisTax.toFixed(2);
    document.getElementById("cisTakeHome").textContent = cisTakeHome.toFixed(2);
    document.getElementById("payeTax").textContent = payeTax.toFixed(2);
    document.getElementById("employeeNI").textContent = employeeNI.toFixed(2);
    document.getElementById("payeTakeHome").textContent = payeTakeHome.toFixed(2);
    document.getElementById("payeTaxPens").textContent = payeTaxPens.toFixed(2);
    document.getElementById("employeeNIPens").textContent = employeeNIPens.toFixed(2);
    document.getElementById("employeePens").textContent = employeePens.toFixed(2);
    document.getElementById("payeTakeHomePens").textContent = payeTakeHomePens.toFixed(2);
}
