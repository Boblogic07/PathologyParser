/**
 * Created by Bob on 21/07/2014.
 */
var dateOfTest;
var desiredResults =
{
    "HAEMOGLOBIN":0,
    "RBC":0,
    "PCV":0,
    "MCV":0,
    "MCH":0,
    "RDW":0,
    "WCC":0,
    "Neutrophils":0,
    "PLATELETS":0,
    "Sodium":0,
    "Potassium":0,
    "Urea":0,
    "Creatinine":0,
    "eGFR":0,
    "Adj. Ca.":0,
    "Magnesium":0,
    "Phosphate":0,
    "Albumin":0,
    "Globulin":0,
    "ALP":0,
    "Bilirubin":0,
    "GGT":0,
    "AST":0,
    "ALT":0,
    "CRP":0,
    "Prothrombin time":0,
    "INR":0,
    "A.P.T.T.":0,
    "Fibrinogen":0,
    "Thrombin time":0,
    "  Lipase  ":0 //extra spaces to make lipase specific to "Lipase as opposed to Lipase test performed on Siemens Advia 1800 analyser"

};

var MinimumValues =
{
    "HAEMOGLOBIN":115,
    "RBC":3.80,
    "PCV":0.35,
    "MCV":80,
    "MCH":27.0,
    "RDW":11.0,
    "WCC":4.0,
    "Neutrophils":2.0,
    "PLATELETS":150,
    "Sodium":135,
    "Potassium":3.5,
    "Urea":2.5,
    "Creatinine":45,
    "eGFR":89,
    "Adj. Ca.":2.15,
    "Magnesium":0.70,
    "Phosphate":0.75,
    "Albumin":35,
    "Globulin":20,
    "ALP":30,
    "Bilirubin":0,
    "GGT":0,
    "AST":0,
    "ALT":0,
    "CRP":0,
    "Prothrombin time":9.0,
    "INR":0.8,
    "A.P.T.T.":25.0,
    "Fibrinogen":2.0,
    "Thrombin time":0,
    "  Lipase  ":8
};

var MaximumValues =
{
    "HAEMOGLOBIN":165,
    "RBC":5.50,
    "PCV":0.47,
    "MCV":99,
    "MCH":32.0,
    "RDW":15.0,
    "WCC":11.0,
    "Neutrophils":8.0,
    "PLATELETS":450,
    "Sodium":145,
    "Potassium":5.2,
    "Urea":8.0,
    "Creatinine":90,
    "eGFR":91,
    "Adj. Ca.":2.55,
    "Magnesium":1.10,
    "Phosphate":1.50,
    "Albumin":50,
    "Globulin":39,
    "ALP":120,
    "Bilirubin":25,
    "GGT":51,
    "AST":41,
    "ALT":41,
    "CRP":6.0,
    "Prothrombin time":13.0,
    "INR":1.2,
    "A.P.T.T.":35.0,
    "Fibrinogen":4.0,
    "Thrombin time":21.0,
    "  Lipase  ":57
};

var rawInput;

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function parseDate(input) {
    var parts = input.split('/');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    var testYear = "20" + parts[2];
    var testMonth = parts[1]-1; // Note: months are 0-based
    var testDay = parts[0];
    return new Date(testYear, testMonth, testDay);
}

function setDateOfTest(input)
{
    var localRawLines = input.split(["\n"]);

    for(l = 0; l < localRawLines.length; l++) {
        line = localRawLines[l];

        if (line.indexOf("Date:") > -1) {
            var possibleDates = line.split(" ", 24);
            possibleDates = possibleDates.clean("");
            dateOfTest = parseDate(possibleDates[1]);

        }
    }

}

function loadCRP(input)
{
    var result;
    rawLines = input.split(["\n"]);
    rawResultLineWords = rawLines[2].split(" ");
    rawResultLineWords.clean("");
    if(parseFloat(rawResultLineWords[3]))
    {
        result = parseFloat(rawResultLineWords[3]);
    }
    if(parseFloat(rawResultLineWords[4]))
    {
        result = parseFloat(rawResultLineWords[4]);
    }

    desiredResults["CRP"] = result;
}
function loadValueFromTest(input)
{
    rawLines = input.split(["\n"]);
    for (var i = 0; i < rawLines.length;i++)
    {
        var line = rawLines[i];




        for(desiredResult in desiredResults)
        {
            if (line.indexOf(desiredResult) > -1)
            {
                var rawWords = line.split(" ", 30 - desiredResult.length);
                words = rawWords.clean("");

                for (var k = 0; k < words.length; k++)
                {
                    var result;
                        result = parseFloat(words[k]);
                        if(result)
                        {
                            desiredResults[desiredResult] = result;
                        }
                }

            }

        }
    }
}

function checkResultNormal(nameOfTest)
{
    if(desiredResults[nameOfTest] < MinimumValues[nameOfTest] || desiredResults[nameOfTest] > MaximumValues[nameOfTest])
    {
        return '<span class = "abnormalResult">' + desiredResults[nameOfTest] + '</span>';
    }
    else
    {
        return '<span class = "normalResult">' + desiredResults[nameOfTest] + '</span>';
    }
}
function generateOutput()
{
    var outputTarget = document.getElementById("output");
    var monthRaw = dateOfTest.getMonth();
    var monthRawNumber = parseFloat(monthRaw);
    var monthNubmer = monthRawNumber + 1;
    var outputStringDate = '<span class = "testHeader">' +  dateOfTest.getDate() + "/" + monthNubmer + "/" + dateOfTest.getFullYear() + '</span>';


    var outputStringFBE = "";
    if(desiredResults["HAEMOGLOBIN"])
    {

        var Hb = checkResultNormal("HAEMOGLOBIN");
        var Wcc = checkResultNormal("WCC");
        var Plt = checkResultNormal("PLATELETS");


        outputStringFBE =
            "</br>" + "FBE: " + Hb + "/"
                + Wcc + "/"
                + Plt;
    }

    var outputStringUEC = "";
    if(desiredResults["Sodium"])
    {
        var Na = checkResultNormal("Sodium");
        var K = checkResultNormal("Potassium");
        var Urea = checkResultNormal("Urea");
        var Cr = checkResultNormal("Creatinine");
        var eGFR = checkResultNormal("eGFR");
        outputStringUEC =
            "</br>" + "UEC: " + Na + "/"
                + K + "/"
                + Urea + "/"
                + Cr + "/"
                + eGFR;
    }

    var outputStringCMP = "";
    if(desiredResults["Magnesium"])
    {
        var adjCa = checkResultNormal("Adj. Ca.");
        var Mg = checkResultNormal("Magnesium");
        var PO4 = checkResultNormal("Phosphate");

        outputStringCMP =
            "<br/>" + "CMP: " + adjCa + "/"
                + Mg + "/"
                + PO4;


    }

    var outputStringLFT = "";
    if(desiredResults["ALT"])
    {
        var Albumin = checkResultNormal("Albumin");
        var ALP = checkResultNormal("ALP");
        var Bil = checkResultNormal("Bilirubin");
        var GGT = checkResultNormal("GGT");
        var AST = checkResultNormal("AST");
        var ALT = checkResultNormal("ALT");

        outputStringLFT =
            "</br>" + "LFT: Alb " + Albumin + " " +
                "ALP " + ALP + " " +
                "Bil " + Bil + " " +
                "GGT " + GGT + " " +
                "AST " + AST + " " +
                "ALT " + ALT;


    }

    var outputStringCRP = "";
    if(desiredResults["CRP"])
    {
        var outCRP = checkResultNormal("CRP");
        outputStringCRP = "</br>" + "CRP: " + outCRP;

    }

    var outputStringCoags = "";
    if(desiredResults["A.P.T.T."])
    {
        var PT = checkResultNormal("Prothrombin time");
        var INR = checkResultNormal("INR");
        var APTT = checkResultNormal("A.P.T.T.");
        var Fib = checkResultNormal("Fibrinogen");
        var TT = checkResultNormal("Thrombin time");

        outputStringCoags = '<br>' + "Coags: " + "PT " + PT + " " + "INR " + INR + " " + "APTT " + APTT + " " + "Fib " + Fib + " " + "TT " + TT;
    }

    var outputStringLipase = "";
    if(desiredResults["  Lipase  "])
    {
        var Lipase = checkResultNormal("  Lipase  ");

        outputStringLipase = '<br>' + "Lipase: " + Lipase;
    }




    outputTarget.innerHTML = outputStringDate + outputStringFBE + outputStringUEC + outputStringCMP + outputStringLFT + outputStringCRP + outputStringCoags + outputStringLipase;

}


    function parsePathology()
{
    rawInput = document.getElementById("inputField").value;
    setDateOfTest(rawInput);
    var rawFBE;
    var rawcrp;
    var rawUEC;
    var rawCoags;
    var rawLipase;
    var rawInputTests = rawInput.split(["Date"]);
    for (var h = 0; h < rawInputTests.length; h++)
    {
        if(rawInputTests[h].indexOf("HAEMOGLOBIN")>-1)
        {
            rawFBE = rawInputTests[h];
            loadValueFromTest(rawFBE);

        }
        if(rawInputTests[h].indexOf("Sodium")>-1)
        {
            rawUEC = rawInputTests[h];
            loadValueFromTest(rawUEC);
        }
        if(rawInputTests[h].indexOf("        CRP  ")>-1)
        {
            rawcrp = rawInputTests[h];
            loadCRP(rawcrp);
        }
        if(rawInputTests[h].indexOf("Prothrombin time")>-1)
        {
            rawCoags = rawInputTests[h];
            loadValueFromTest(rawCoags);
        }
        if(rawInputTests[h].indexOf("  Lipase  ")>-1)
        {
            rawLipase = rawInputTests[h];
            loadValueFromTest(rawLipase);
        }
    }


    generateOutput();

}

function reset()
{
    desiredResults = {
        "HAEMOGLOBIN":0,
        "RBC":0,
        "PCV":0,
        "MCV":0,
        "MCH":0,
        "RDW":0,
        "WCC":0,
        "Neutrophils":0,
        "PLATELETS":0,
        "Sodium":0,
        "Potassium":0,
        "Urea":0,
        "Creatinine":0,
        "eGFR":0,
        "Adj. Ca.":0,
        "Magnesium":0,
        "Phosphate":0,
        "Albumin":0,
        "Globulin":0,
        "ALP":0,
        "Bilirubin":0,
        "GGT":0,
        "AST":0,
        "ALT":0,
        "CRP":0
    };
    document.getElementById("inputField").value = "";
    document.getElementById("output").innerHTML = "";
}

