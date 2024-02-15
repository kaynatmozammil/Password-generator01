const inputSlider = document.querySelector('[data-lenghtSlider]');
const lengthDisplay = document.querySelector('[data-lenghtNumber]');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type=checkbox');
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//Initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength  circle to gray
setIndicator('#ccc');
//set passeordLenght
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //Or kuchh bhi aana chahiye ya nhi
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);

}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked)
        hasUpper = true;
    if (lowercaseCheck.checked)
        hasLower = true
    if (numbersCheck.checked)
        hasNum = true;
    if (symbolsCheck.checked)
        hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        (passwordLength >= 6)) {
        setIndicator("#0ff0");
    }
    else {
        setIndicator("#f00");
    }

}

async function copyContent() {

    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala  span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePasswors(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    })
    //Special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordLength > 0)
        // if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //Non of checkbox are selected
    if (checkCount == 0)
        return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //Let's Start the journy to find the Password
    console.log("Starting the journey");
    //Removed old password
    password = "";

    //let's put the stuff mentioned  by checkbox
    // if(uppercaseCheck.checked){
    //     password=generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password=generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password=generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password=generateSymbol();
    // }


    let funArr = [];
    if (uppercaseCheck.checked)
        funArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funArr.push(generateSymbol);


    //Compulsory additon
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }

    console.log("compulsory addition is done");
    //remaining addtion
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        console.log("randIndex" + randIndex);
        password += funArr[randIndex]();
    }

    console.log("remaining addition is done");
    //Shuffle the password
    password = shufflePasswors(Array.from(password));
    console.log("Shuffling is done");

    //show in UI
    passwordDisplay.value = password;
    console.log("UI Addition is done");

    //calculation strength
    calcStrength();
});