document.getElementById("calculate").addEventListener("click", function () {
    const kdDays = parseInt(document.getElementById("kd-days").value) || 0;
    const wdDays = parseInt(document.getElementById("wd-days").value) || 0;
    const wpDays = parseInt(document.getElementById("wp-days").value) || 0;
    const spDays = parseInt(document.getElementById("sp-days").value) || 0;
    const vitaminDDays = parseInt(document.getElementById("vitamin-d-days").value) || 0;
    const zincDays = parseInt(document.getElementById("zinc-days").value) || 0;
    const steps = parseInt(document.getElementById("step-count").value) || 0;

    const results = [];

    if (kdDays > 0) {
        const kdChange = calculateTestosteroneChange("KD", kdDays);
        results.push(`Ketogenic Diet: Testosterone Change: ${kdChange.toFixed(2)} ng/dL`);
    }

    if (wdDays > 0) {
        const wdChange = calculateTestosteroneChange("WD", wdDays);
        results.push(`Western Diet: Testosterone Change: ${wdChange.toFixed(2)} ng/dL`);
    }

    if (wpDays > 0) {
        const wpChange = calculateTestosteroneChange("WPC", wpDays);
        results.push(`Whey Protein: Testosterone Change: ${wpChange.toFixed(2)} ng/dL`);
    }

    if (spDays > 0) {
        const spChange = calculateTestosteroneChange("SPC", spDays);
        results.push(`Soy Protein: Testosterone Change: ${spChange.toFixed(2)} ng/dL`);
    }

    if (vitaminDDays > 0) {
        const vitaminDChange = calculateTestosteroneChange("vitamin_d", vitaminDDays);
        results.push(`Vitamin D: Testosterone Change: ${vitaminDChange.toFixed(2)} ng/dL`);
    }

    if (zincDays > 0) {
        const zincChange = calculateTestosteroneChange("zinc", zincDays);
        results.push(`Zinc: Testosterone Change: ${zincChange.toFixed(2)} ng/dL`);
    }

    if (steps > 0) {
        const stepChange = calculateStepBasedTestosteroneChange(steps);
        results.push(`Steps: Testosterone Increase: ${stepChange.toFixed(2)} ng/dL`);
    }

    document.getElementById("result").innerHTML = results.length > 0 ?
        `<ul>${results.map(r => `<li>${r}</li>`).join('')}</ul>` :
        "<p>No data entered or no effects calculated.</p>";
});

function calculateTestosteroneChange(intervention, days) {
    const effectSizes = {
        "KD": { 30: 0.4, 90: 0.63, beyond: 0.75 },
        "WD": { 30: 0.35, 90: 0.45, beyond: 0.55 },
        "WPC": { 30: 0.5, 90: 0.59, beyond: 0.7 },
        "SPC": { 30: 0.4, 90: 0.47, beyond: 0.6 },
        "vitamin_d": { 30: 0.4, 90: 0.63, beyond: 0.75 },
        "zinc": { 30: 0.35, 90: 0.59, beyond: 0.7 }
    };

    const sdPrePost = {
        "KD": { sdPre: 5.89, sdPost: 6.79 },
        "WD": { sdPre: 5.66, sdPost: 5.25 },
        "WPC": { sdPre: 0.056, sdPost: 0.081 },
        "SPC": { sdPre: 0.060, sdPost: 0.106 },
        "vitamin_d": { sdPre: 3.9, sdPost: 4.7 },
        "zinc": { sdPre: 5.81, sdPost: 5.81 }
    };

    const effectSize = days <= 30 ? effectSizes[intervention][30] :
                      days <= 90 ? effectSizes[intervention][90] :
                      effectSizes[intervention].beyond;

    const pooledSD = Math.sqrt((Math.pow(sdPrePost[intervention].sdPre, 2) + Math.pow(sdPrePost[intervention].sdPost, 2)) / 2);
    return effectSize * pooledSD * 28.845; // Convert to ng/dL
}

function calculateStepBasedTestosteroneChange(steps) {
    const ttIncreasePer1000Steps = 7; // ng/dL increase per 1000 steps
    return (steps / 1000) * ttIncreasePer1000Steps;
}
