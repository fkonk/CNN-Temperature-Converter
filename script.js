/* 

	Title: CNN-Temperature-Converter 

	Program Summary: This is a program that is used as a temperature converter or the website CNN. The user inputs a value and selects there unit and a unit to output to.
     Then the code does some calculations at give the user an output. There is also a Thermometer that updates in real time and changes color to reflec the output value.
     Addiotionally there is a graph that will plot the output onto a graph. THere are also other section for example we have a tempature quiz section and a daily challenge section.
	
	Important (KEY) Program Elemnts Used: 
	Starting at the top we have a head with a nav bar that resesembles the CNN website. Addiontionally at the top right we have a theme changer that will change the theme to dark mode.
    Next we have are input and output conversions that are super responsives. The main highlights are the various convertion units we have to offer. There also is the custom decimal. Where you select how many decimals you us to output.
    You can also copy the conversion with just a click of a button. Next we have a Thermometor that chagnes colors to reflect the temperature. There also is a Temperature history colum where is shows your past 5 conversions.
    Next is a temperature quiz where you can test your knowledge on temperature related questions. Next we plot your conversion on a graph so you can better understand the conversion.
    Lastly we have a daily temperature conversion question that will test you daily.
	
	
	Authors Finn Konkin:
	
	Version V.1.4:
	
	Date Oct 11 2024:

*/ 






// Theme Toggle Function
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    // Change icon
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
    
});


// Handle Input with Character Limit
function handleInput(fieldId) {
    const inputField = document.getElementById(fieldId);
    const maxLength = 10;
    let value = inputField.value;

    // Remove any characters beyond maxLength
    if (value.length > maxLength) {
        inputField.value = value.slice(0, maxLength);
        value = inputField.value;
    }

    // Remove any non-numeric characters except for minus sign and decimal point
    inputField.value = value.replace(/[^0-9.\-]/g, '');

    // Ensure only one decimal point
    const parts = inputField.value.split('.');
    if (parts.length > 2) {
        inputField.value = parts[0] + '.' + parts.slice(1).join('');
    }

    // Ensure minus sign is only at the beginning
    if (inputField.value.indexOf('-') > 0) {
        inputField.value = inputField.value.replace('-', '');
        inputField.value = '-' + inputField.value;
    }

    // Prevent multiple minus signs
    const minusCount = (inputField.value.match(/-/g) || []).length;
    if (minusCount > 1) {
        inputField.value = inputField.value.replace(/-/g, '');
        inputField.value = '-' + inputField.value;
    }

    // Call convertTemperature function
    if (fieldId === 'inputValue') {
        convertTemperature('input');
    } else if (fieldId === 'outputValue') {
        convertTemperature('output');
    }
}

// Convert Temperature Function
function convertTemperature(source) {
    let inputValue = parseFloat(document.getElementById('inputValue').value);
    let outputValue = parseFloat(document.getElementById('outputValue').value);
    let inputUnit = document.getElementById('inputUnit').value;
    let outputUnit = document.getElementById('outputUnit').value;
    let decimalPlaces = parseInt(document.getElementById('decimalPlaces').value);
    let result = document.getElementById('result');
    let errorMessage = document.getElementById('error-message');
    let recommendation = document.getElementById('recommendation');

    let celsiusValue;

    if (source === 'input') {
        if (isNaN(inputValue)) {
            // Clear output field and other displays
            document.getElementById('outputValue').value = '';
            result.innerHTML = '';
            errorMessage.textContent = '';
            recommendation.textContent = '';
            updateThermometer(null);
            // Clear the graph
            clearGraph();
            return;
        }

        // Convert from input to output
        celsiusValue = toCelsius(inputValue, inputUnit);
        let convertedValue = fromCelsius(celsiusValue, outputUnit);
        convertedValue = roundToDecimalPlaces(convertedValue, decimalPlaces);
        document.getElementById('outputValue').value = convertedValue;
        result.innerHTML = `${inputValue}°${getUnitSymbol(inputUnit)} = ${convertedValue}°${getUnitSymbol(outputUnit)}`;
    } else if (source === 'output') {
        if (isNaN(outputValue)) {
            // Clear input field and other displays
            document.getElementById('inputValue').value = '';
            result.innerHTML = '';
            errorMessage.textContent = '';
            recommendation.textContent = '';
            updateThermometer(null);
            // Clear the graph
            clearGraph();
            return;
        }

        // Convert from output to input
        celsiusValue = toCelsius(outputValue, outputUnit);
        let convertedValue = fromCelsius(celsiusValue, inputUnit);
        convertedValue = roundToDecimalPlaces(convertedValue, decimalPlaces);
        document.getElementById('inputValue').value = convertedValue;
        result.innerHTML = `${convertedValue}°${getUnitSymbol(inputUnit)} = ${outputValue}°${getUnitSymbol(outputUnit)}`;
    }

    // Update thermometer and recommendation based on Celsius value
    updateThermometer(celsiusValue);
    provideRecommendation(celsiusValue);

    // Clear any previous error messages
    errorMessage.textContent = '';

    // Add to history
    addToHistory(result.innerHTML);

    // Update graph using the input value
    updateGraphWithRange(inputValue, inputUnit, outputUnit);
}





// Round to specified decimal places
function roundToDecimalPlaces(value, decimalPlaces) {
    let factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor;
}





// Convert any unit to Celsius
function toCelsius(value, unit) {
    switch (unit) {
        case 'Celsius':
            return value;
        case 'Fahrenheit':
            return (value - 32) * 5 / 9;
        case 'Kelvin':
            return value - 273.15;
        case 'Rankine':
            return (value - 491.67) * 5 / 9;
        case 'Reaumur':
            return value * 1.25;
        case 'Delisle':
            return 100 - value * 2 / 3;
        case 'Newton':
            return value * 100 / 33;
        case 'Romer':
            return (value - 7.5) * 40 / 21;
        case 'Leiden':
            return value - 253.15;
        default:
            return NaN;
    }
}






// Convert Celsius to any unit
function fromCelsius(value, unit) {
    switch (unit) {
        case 'Celsius':
            return value;
        case 'Fahrenheit':
            return value * 9 / 5 + 32;
        case 'Kelvin':
            return value + 273.15;
        case 'Rankine':
            return (value + 273.15) * 9 / 5;
        case 'Reaumur':
            return value * 0.8;
        case 'Delisle':
            return (100 - value) * 3 / 2;
        case 'Newton':
            return value * 33 / 100;
        case 'Romer':
            return value * 21 / 40 + 7.5;
        case 'Leiden':
            return value + 253.15;
        default:
            return NaN;
    }
}






// Get unit symbol for display
function getUnitSymbol(unit) {
    switch (unit) {
        case 'Celsius':
            return 'C';
        case 'Fahrenheit':
            return 'F';
        case 'Kelvin':
            return 'K';
        case 'Rankine':
            return 'R';
        case 'Reaumur':
            return 'Ré';
        case 'Delisle':
            return 'De';
        case 'Newton':
            return 'N';
        case 'Romer':
            return 'Rø';
        case 'Leiden':
            return 'L';
        default:
            return '';
    }
}






// Update the thermometer visualization
function updateThermometer(celsiusValue) {
    let mercury = document.getElementById('mercury');
    if (celsiusValue === null) {
        // Hide mercury
        mercury.style.height = '0%';
        mercury.style.backgroundColor = '';
        return;
    }
    // Normalize Celsius value between -100°C and 100°C for display purposes
    let height = ((celsiusValue + 100) / 200) * 100;
    height = Math.min(100, Math.max(0, height)); // Clamp between 0% and 100%
    mercury.style.height = height + '%';

    // Change mercury color based on temperature
    let mercuryColor;
    if (celsiusValue <= 0) {
        mercuryColor = '#0000FF'; // Blue for cold temperatures
    } else if (celsiusValue > 0 && celsiusValue <= 40) {
        // Create a gradient from blue to red without green
        let ratio = celsiusValue / 40; // Normalize ratio between 0 and 1
        let r = Math.round(0 + (255 * ratio)); // Red increases from 0 to 255
        let g = 0; // Keep green at 0 to avoid green color
        let b = Math.round(255 - (255 * ratio)); // Blue decreases from 255 to 0
        mercuryColor = `rgb(${r},${g},${b})`;
    } else {
        mercuryColor = '#FF0000'; // Red for hot temperatures
    }
    mercury.style.backgroundColor = mercuryColor;
}






// Provide clothing recommendation based on temperature
function provideRecommendation(celsiusValue) {
    let recommendation = document.getElementById('recommendation');
    let message = '';

    if (celsiusValue <= 0) {
        message = "It's freezing! Wear a heavy coat, gloves, and a hat.";
    } else if (celsiusValue > 0 && celsiusValue <= 10) {
        message = "It's cold. Wear a coat and warm clothes.";
    } else if (celsiusValue > 10 && celsiusValue <= 20) {
        message = "It's cool. A light jacket should be fine.";
    } else if (celsiusValue > 20 && celsiusValue <= 30) {
        message = "It's warm. Wear comfortable clothes.";
    } else if (celsiusValue > 30) {
        message = "It's hot! Wear shorts and a t-shirt.";
    }

    recommendation.textContent = message;
}






// Reset the converter
function resetConverter() {
    document.getElementById('inputValue').value = '';
    document.getElementById('outputValue').value = '';
    document.getElementById('result').innerHTML = '';
    updateThermometer(null);
    document.getElementById('history').innerHTML = '';
    document.getElementById('error-message').textContent = '';
    document.getElementById('recommendation').textContent = '';
    clearGraph();
}






// Copy result to clipboard
function copyResult() {
    let resultText = document.getElementById('result').innerText;
    if (resultText) {
        navigator.clipboard.writeText(resultText).then(() => {
            alert('Result copied to clipboard!');
        });
    }
}






// Add conversion to history
function addToHistory(conversion) {
    let historyList = document.getElementById('history');
    let listItem = document.createElement('li');
    listItem.textContent = conversion;
    historyList.insertBefore(listItem, historyList.firstChild);

    // Limit the history to the last 5 conversions
    if (historyList.childElementCount > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}






// Update the graph using a range around the input value
function updateGraphWithRange(centerValue, inputUnit, outputUnit) {
    let range = 10; // Define the range around the input value
    let step = (range * 2) / 50; // Adjust step for smoother curve
    let dataPoints = [];
    let labels = [];

    for (let i = centerValue - range; i <= centerValue + range; i += step) {
        let celsiusValue = toCelsius(i, inputUnit);
        let outputValue = fromCelsius(celsiusValue, outputUnit);
        dataPoints.push(outputValue);
        labels.push(roundToDecimalPlaces(i, 2)); // Limit labels to 2 decimal places
    }



    // Update chart with new data
    const ctx = document.getElementById('conversionGraph').getContext('2d');
    if (window.conversionChart) window.conversionChart.destroy();
    window.conversionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Input values as labels
            datasets: [{
                label: `Conversion from ${getUnitSymbol(inputUnit)} to ${getUnitSymbol(outputUnit)}`,
                data: dataPoints,
                borderColor: '#CC0000',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: `Temperature (${getUnitSymbol(inputUnit)})`
                    },
                    ticks: {
                        maxTicksLimit: 10
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: `Converted Temperature (${getUnitSymbol(outputUnit)})`
                    }
                }
            }
        }
    });
}





// Function to clear the graph
function clearGraph() {
    const ctx = document.getElementById('conversionGraph').getContext('2d');
    if (window.conversionChart) {
        window.conversionChart.destroy();
    }
}






// Reveal the answer to the daily challenge
function revealAnswer() {
    document.getElementById('challenge-answer').style.display = 'block';
}



// Array of quiz questions
const quizQuestions = [
    {
        question: "At what temperature does water boil in Celsius?",
        options: ["0°C", "50°C", "100°C", "150°C"],
        answer: "100°C"
    },
    {
        question: "What is absolute zero in Celsius?",
        options: ["0°C", "-273.15°C", "-100°C", "273.15°C"],
        answer: "-273.15°C"
    },
    {
        question: "At what temperature are Celsius and Fahrenheit equal?",
        options: ["-40°C", "0°C", "100°C", "40°C"],
        answer: "-40°C"
    },
    // Add more questions as desired
];






// Function to display a random quiz question
function displayQuizQuestion() {
    const quizElement = document.getElementById('quiz-content');
    const randomIndex = Math.floor(Math.random() * quizQuestions.length);
    const questionObj = quizQuestions[randomIndex];

    // Create question element
    const questionText = document.createElement('p');
    questionText.textContent = questionObj.question;

    // Create options
    const optionsDiv = document.createElement('div');
    questionObj.options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option;
        optionButton.onclick = () => checkAnswer(option, questionObj.answer);
        optionsDiv.appendChild(optionButton);
    });

    // Clear previous content and append new question
    quizElement.innerHTML = '';
    quizElement.appendChild(questionText);
    quizElement.appendChild(optionsDiv);
}







// Function to check the answer
function checkAnswer(selected, correct) {
    if (selected === correct) {
        alert("Correct!");
    } else {
        alert(`Incorrect. The correct answer is ${correct}.`);
    }
    // Display a new question
    displayQuizQuestion();
}





// Set the daily challenge question
function setDailyChallenge() {
    const dailyChallenges = [
        {
            question: "Can you guess the boiling point of water in °C?",
            answer: "The boiling point of water is 100°C."
        },
        {
            question: "At what temperature does water freeze in °F?",
            answer: "Water freezes at 32°F."
        },
        {
            question: "What is the average human body temperature in °C?",
            answer: "The average human body temperature is about 37°C."
        },
        // Add more challenges
    ];
    const challengeElement = document.getElementById('daily-challenge');
    const today = new Date().getDate();
    const challenge = dailyChallenges[today % dailyChallenges.length];

    challengeElement.textContent = challenge.question;
    document.getElementById('challenge-answer').textContent = challenge.answer;
}
