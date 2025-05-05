// Attach event listeners to checkboxes for toggling edit mode
document.addEventListener("change", function (event) {
    if (event.target.classList.contains("toggle-edit")) {
        let fieldName = event.target.dataset.field;
        let valueSpan = document.getElementById(`value_${fieldName}`);
        let inputField = document.getElementById(`input_${fieldName}`);

        if (event.target.checked) {
            valueSpan.classList.add("d-none");
            inputField.classList.remove("d-none");
        } else {
            valueSpan.classList.remove("d-none");
            inputField.classList.add("d-none");
        }
    }
});

// Function to fetch and display the modal for a selected record
function openCrudModal(slug) {
    console.log(`🟠 1. Requesting modal for slug: ${slug}`);

    fetch(`/mapper/modal/${slug}/`)
        .then(response => response.text())
        .then(html => {
            console.log("🟢 2. Fetch response received");
            console.log("🟢 3. Modal HTML fetched");

            const existingModal = document.getElementById("crudModal");
            if (existingModal) {
                console.log("🟠 4. Existing modal found — disposing and removing");

                // ⚡️ Blur active element inside modal (fix ARIA warning)
                if (document.activeElement && existingModal.contains(document.activeElement)) {
                    document.activeElement.blur();
                }

                existingModal.remove();
            }

            // Inject new modal HTML
            console.log("🟢 5. Injecting new modal HTML");
            document.body.insertAdjacentHTML("beforeend", html);

            const newModal = document.getElementById("crudModal");

            // Ensure no rogue aria-hidden is left (defensive)
            if (newModal.hasAttribute("aria-hidden")) {
                console.log("🟠 Removing rogue aria-hidden attribute");
                newModal.removeAttribute("aria-hidden");
            }

            // Prepare and show new modal
            console.log("🟢 6. Preparing to show new modal");
            const $modal = new bootstrap.Modal(newModal);
            setTimeout(() => {
                $modal.show();
                console.log("🟢 6a. Modal shown after timeout");

                newModal.addEventListener('shown.bs.modal', () => {
                    console.log("🟢 7. Modal shown event triggered");
                });
            }, 50);
        })
        .catch(error => {
            console.error('🔴 Error fetching modal:', error);
        });
}
