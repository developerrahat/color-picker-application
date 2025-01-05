/**
 * Date: 01-04-2025
 * Author: Mohammad Rahat
 */


// ============== Global Variable ===========
let toastContainer = null;
const defaultPresetColors = [
    '#FFA07A',
    '#FA8072',
    '#FFD700',
    '#FFFFE0',
    '#7CFC00',
    '#228B22',
    '#00FFFF',
    '#008B8B',
    '#00BFFF',
    '#1E90FF',
    '#7B68EE',
    '#0000CD',
    '#EE82EE',
    '#FF00FF',
    '#9400D3',
    '#4B0082',
    '#FF1493',
    '#778899',
    '#F4A460',
    '#A52A2A',

]
let customColor = new Array(5);
const copySound = new Audio('./copy-sound.wav')






// ============ Select DOM Elements  From Html ===========
const docBody = document.getElementById('docBody')
const randomColor = document.getElementById('randomColor')

const colorSliderRed = document.getElementById('colorSliderRed')
const colorSliderGreen = document.getElementById('colorSliderGreen')
const colorSliderBlue = document.getElementById('colorSliderBlue')
const presetsColorParent = document.getElementById('presetsColor')

const bg_file_input = document.getElementById('bg_file_input')
const bg_input_file_btn = document.getElementById('bg_input_file_btn')
const bg_image_preview = document.getElementById('bg_image_preview')
const bgFileDeleteBtn = document.getElementById('bg_input_file_btn_delete')
bgFileDeleteBtn.style.display = 'none'
bgFileDeleteBtn.style.background = 'red'
const backgroundController = document.getElementById('background_control_panel')



displayColorBoxex(presetsColorParent, defaultPresetColors)

// ============ DOM Add Event Listener ============

randomColor.addEventListener('click', function () {
    let color = generateDicimalColor()
    updateColorCodeToDom(color)
})



// ========== Select Color Mood Event ==========
const colorMoodRadios = document.getElementsByName('color-mood')
const copyColorCode = document.getElementById('copyColorCode')
copyColorCode.addEventListener('click', function () {
    const mood = getCheckedValuesFromRadios(colorMoodRadios)

    if (mood === null) {
        throw new Error('Invalid Radio Input')
    }


    if (mood === 'hex') {
        const hexColor = document.getElementById('hexInputField').value
        if (hexColor && isValidHexCode(hexColor)) {
            navigator.clipboard.writeText(`#${hexColor}`)
            generateToastMessage(`#${hexColor} Copied`)
        } else {
            alert('Invalid Color Code')
        }

    } else {
        const rgbColor = document.getElementById('rgbInputField').value
        navigator.clipboard.writeText(rgbColor)
        generateToastMessage(`${rgbColor} Copied`)
    }
    if (toastContainer !== null) {
        toastContainer.remove();
        toastContainer = null
    }


})


// =========== Save Custom Color Event Listener
const saveColor = document.getElementById('saveColor')
const customColorParent = document.getElementById('customColors')
saveColor.addEventListener('click', function () {
    const color = `#${hexInputField.value}`
    if (customColor.includes(color)) {
        alert('Already picked')
        return
    };

    customColor.unshift(color)

    if (customColor.length > 5) {
        customColor = customColor.slice(0, 5)
    }
    localStorage.setItem('custom-colors', JSON.stringify(customColor))
    removeChildren(customColorParent)
    displayColorBoxex(customColorParent, customColor)

})


// =========== Type HEX Code on the inputfieldHex Event =============
const hexInputField = document.getElementById('hexInputField')
const errorAlert = document.getElementById('errorAlert')
hexInputField.addEventListener('keyup', function (e) {
    let hexcolor = e.target.value
    if (hexcolor) {
        hexInputField.value = hexcolor.toUpperCase()

        if (isValidHexCode(hexcolor)) {
            let colorBg = hexToDecimalColor(hexcolor);
            updateColorCodeToDom(colorBg);
            errorAlert.style.display = 'none'
        } else {
            errorAlert.innerText = 'Invalid color code'
            errorAlert.style.color = 'red'
            errorAlert.style.fontSize = '12px'
        }
    }

})




// =========== Color Slider Event =============
colorSliderRed.addEventListener('change', handleColorSlider)
colorSliderGreen.addEventListener('change', handleColorSlider)
colorSliderBlue.addEventListener('change', handleColorSlider)
function handleColorSlider() {
    const color = {
        red: parseInt(colorSliderRed.value),
        green: parseInt(colorSliderGreen.value),
        blue: parseInt(colorSliderBlue.value)

    }
    updateColorCodeToDom(color)
}


// ============ Preset Color Event============
presetsColor.addEventListener('click', function () {
    presetColorFunction('Preset code')
})
customColorParent.addEventListener('click', function () {
    presetColorFunction('Custom code')
})

function presetColorFunction(colorType) {
    const child = event.target
    if (child.className === 'color_box') {
        navigator.clipboard.writeText(child.getAttribute('data-color'))
        generateToastMessage(`${colorType} ${child.getAttribute('data-color')} copied`)
        copySound.play()
        copySound.volume = 0.5
    }
}



//  =========== Background File Input Event ==============
bg_input_file_btn.addEventListener('click', function () {
    bg_file_input.click()
})

bg_file_input.addEventListener('change', function (event) {
    const file = event.target.files[0]
    const imgUrl = URL.createObjectURL(file)
    bg_image_preview.style.background = `url(${imgUrl})`
    docBody.style.background = `url(${imgUrl})`
    bgFileDeleteBtn.style.display = 'inline'
    backgroundController.style.display = 'block'
})

bgFileDeleteBtn.addEventListener('click', function () {
    bg_image_preview.style.background = `none`
    bg_image_preview.style.background = `#D2DEE9`
    docBody.style.background = `none`
    docBody.style.background = `#D2DEE9`
    bgFileDeleteBtn.style.display = 'none'
    bg_file_input.value = null
    backgroundController.style.display = 'none'

})

document.getElementById('bgSize').addEventListener('change', chnageBackgroundPreferences)
document.getElementById('bgRepeat').addEventListener('change', chnageBackgroundPreferences)
document.getElementById('bgPosition').addEventListener('change', chnageBackgroundPreferences)
document.getElementById('bgAttachment').addEventListener('change', chnageBackgroundPreferences)



// ========== Present Color get from Local Stroge ==============
const customColorsString = localStorage.getItem('custom-colors')
if (customColor) {
    customColor = JSON.parse(customColorsString)
    displayColorBoxex(customColorParent, customColor)
}







// ============= DOM Functions ===============


function updateColorCodeToDom(color) {
    const hexColor = generateHEXColor(color);
    const rgbColor = generateRGBColor(color);

    document.getElementById('displayColor').style.background = `#${hexColor}`;

    document.getElementById('hexInputField').value = hexColor;
    document.getElementById('rgbInputField').value = rgbColor;

    document.getElementById('colorSliderRed').value = color.red;
    document.getElementById('colorSliderRedLabel').innerText = color.red;

    document.getElementById('colorSliderGreen').value = color.green;
    document.getElementById('colorSliderGreenLabel').innerText = color.green;

    document.getElementById('colorSliderBlue').value = color.blue;
    document.getElementById('colorSliderBlueLabel').innerText = color.blue;

}


/**
 * Find the checked elements from a list of ratio buttons
 * @param {Array} nodes 
 * @returns {string | null}
 */

function getCheckedValuesFromRadios(nodes) {
    let checkedValue = null;
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            checkedValue = nodes[i].value;
            break;
        }
    }

    return checkedValue
}



/**
 * Create a div element with class name is color_box
 * @param {*} color 
 * @returns 
 */

function generateColorBox(color) {
    const colorBoxDiv = document.createElement('div')
    colorBoxDiv.className = 'color_box'
    colorBoxDiv.style.background = color
    colorBoxDiv.setAttribute('data-color', color)

    return colorBoxDiv
}

/**
 * This function will create append new color boxex
 * @param {object} parent 
 * @param {Array} colors 
 */
function displayColorBoxex(parent, colors) {
    colors.forEach((color) => {
        if (isValidHexCode(color.slice(1))) {
            const colorBox = generateColorBox(color)
            parent.appendChild(colorBox)
        }

    })
}


/**
 * 
 * @param {object} parent 
 */

function removeChildren(parent) {
    let child = parent.lastElementChild
    while (child) {
        parent.removeChild(child)
        child = parent.lastElementChild
    }
}



/**
 * Generate toast message function when user copied the code =============
 * @param {string} msg 
 */
function generateToastMessage(msg) {
    let toastContainer = document.createElement('div')
    toastContainer.innerText = msg
    toastContainer.className = 'toast-message toast-message-slide-in'

    setTimeout(function() {
        toastContainer.classList.remove('toast-message-slide-in')
        toastContainer.remove()
    }, 2000)


    docBody.appendChild(toastContainer)

}



// =========== Bg Controller Function 
function chnageBackgroundPreferences() {
    docBody.style.backgroundSize = document.getElementById('bgSize').value
    docBody.style.backgroundRepeat = document.getElementById('bgRepeat').value
    docBody.style.backgroundPosition = document.getElementById('bgPosition').value
    docBody.style.backgroundAttachment = document.getElementById('bgAttachment').value
}





// ============ Utility Functions ============

/**
 * Generate Decimal Color Code that returns an object of three color decimal values
 * @returns {object}
 */
function generateDicimalColor() {
    let red = Math.floor(Math.random() * 255)
    let green = Math.floor(Math.random() * 255)
    let blue = Math.floor(Math.random() * 255)

    return {
        red,
        green,
        blue
    }
}



/**
 * Take a color object of three decimal values and return a rgb color code
 * @param {string} param0 
 * 
 */
function generateRGBColor({ red, green, blue }) {
    return `rgb(${red}, ${green}, ${blue})`
}


/**
 * Take a color object of three decimal values and return a hex color code
 * @param {string} param0 
 * 
 */
function generateHEXColor({ red, green, blue }) {
    let getTwoCode = value => {
        let hex = value.toString(16)
        return hex.length === 1 ? `0${hex}` : hex
    }
    return `${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`.toUpperCase()
}


/**
 * Convert Hex to Decimal Color
 * @param {string} hex 
 * @returns {object}
 */

function hexToDecimalColor(hex) {
    let red = parseInt(hex.slice(0, 2), 16)
    let green = parseInt(hex.slice(2, 4), 16)
    let blue = parseInt(hex.slice(4), 16)

    return {
        red,
        green,
        blue
    }

}


/**
 * Is valid hex decimal code function ==================
 * @param {string} color 
 * @returns {boolean}
 */
function isValidHexCode(color) {
    if (color.length !== 6) return false

    return /^[0-9A-Fa-f]{6}$/i.test(color)
}





// ============ Color Picker Application's Requirements ============
