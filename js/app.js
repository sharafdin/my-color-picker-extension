// Get the color picker button, clear all button, color list, and picked colors from local storage
const colorPickerBtn = document.querySelector("#color-picker");
const clearAllBtn = document.querySelector(".clear-all");
const colorList = document.querySelector(".all-colors");
const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

// Function to copy the color code to the clipboard and update the element text
const copyColor = (elem) => {
  elem.innerText = "Copied";
  navigator.clipboard.writeText(elem.dataset.color);
  setTimeout(() => (elem.innerText = elem.dataset.color), 1000);
};

// Function to show picked colors
const showColors = () => {
  if (!pickedColors.length) return; // Return if there are no picked colors

  // Generate li for the picked color and add it to the colorList
  colorList.innerHTML = pickedColors
    .map(
      (color) => `
        <li class="color">
            <span class="rect" style="background: ${color}; border: 1px solid ${
        color == "#ffffff" ? "#ccc" : color
      }"></span>
            <span class="value hex" data-color="${color}">${color}</span>
        </li>
    `
    )
    .join("");

  document.querySelector(".picked-colors").classList.remove("hide");

  // Add a click event listener to each color element to copy the color code
  document.querySelectorAll(".color").forEach((li) => {
    li.addEventListener("click", (e) =>
      copyColor(e.currentTarget.lastElementChild)
    );
  });
};

// Call the showColors function to show picked colors
showColors();

// Function to activate the eye dropper tool to get the selected color
const activateEyeDropper = () => {
  document.body.style.display = "none";
  setTimeout(async () => {
    try {
      // Open the eye dropper and get the selected color
      const eyeDropper = new EyeDropper();
      const { sRGBHex } = await eyeDropper.open();
      navigator.clipboard.writeText(sRGBHex);

      // Add the color to the list if it doesn't already exist
      if (!pickedColors.includes(sRGBHex)) {
        pickedColors.push(sRGBHex);
        localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
        showColors();
      }
    } catch (error) {
      alert("Failed to copy the color code!");
    }
    document.body.style.display = "block";
  }, 10);
};

// Function to clear all picked colors, update local storage, and hide the colorList element
const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
  document.querySelector(".picked-colors").classList.add("hide");
};

// Add event listeners to the clear all and color picker buttons
clearAllBtn.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);

// Disable right-click and F12 to prevent developer tools from being opened
window.oncontextmenu = function () {
  return false;
};

document.addEventListener(
  "keydown",
  function (event) {
    var key = event.key || event.keyCode;

    if (key == 123) {
      return false;
    } else if (
      (event.ctrlKey && event.shiftKey && key == 73) ||
      (event.ctrlKey && event.shiftKey && key == 74)
    ) {
      return false;
    }
  },
  false
);