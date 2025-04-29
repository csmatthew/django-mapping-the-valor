const toggleButton = document.getElementById("toggle-button");
const hiddenRows = document.querySelectorAll(".hidden-row");

// Track the current state (initially "hidden")
let isHidden = true;

toggleButton.addEventListener("click", () => {
    hiddenRows.forEach(row => {
        // Toggle rows visibility based on the current state
        row.style.display = isHidden ? "table-row" : "none";
    });

    // Update the button text and toggle the state
    toggleButton.textContent = isHidden ? "Show Less" : "Show More";
    isHidden = !isHidden; // Flip the state
});
