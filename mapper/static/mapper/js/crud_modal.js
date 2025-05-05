// Attach event listeners to checkboxes for toggling edit mode
document.addEventListener("change", function (event) {
    if (event.target.classList.contains("toggle-edit")) {
        let fieldName = event.target.dataset.field;
        let valueSpan = document.getElementById(`value_${fieldName}`);
        let inputField = document.getElementById(`input_${fieldName}`);

        if (event.target.checked) {
            valueSpan.classList.add("d-none");  // ✅ Hide read-only value
            inputField.classList.remove("d-none");  // ✅ Show input field
        } else {
            valueSpan.classList.remove("d-none");  // ✅ Show read-only value
            inputField.classList.add("d-none");  // ✅ Hide input field
        }
    }
});


// Function to fetch and display the modal for a selected record
function openCrudModal(slug) {
    console.log(`Opening modal for slug: ${slug}`);

    fetch(`/mapper/modal/${slug}/`)
        .then(response => response.text())
        .then(html => {
            // ✅ Ensure old modal is removed before injecting new one
            let existingModal = document.getElementById("crudModal");
            if (existingModal) {
                existingModal.remove();
            }

            document.body.insertAdjacentHTML("beforeend", html);  // ✅ Inject fresh modal
            $("#crudModal").modal("show");  // ✅ Activate Bootstrap modal
        })
        .catch(error => console.error(`Error loading modal: ${error.message}`));
}