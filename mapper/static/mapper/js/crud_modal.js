// crud_modal.js

// 🟢 Attach event listeners to checkboxes for toggling edit mode
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

// 🟢 Function to fetch and display the modal for a selected record
function openCrudModal(slug) {
    console.log(`🟠 1. Requesting modal content for slug: ${slug}`);

    fetch(`/mapper/modal/${slug}/`)
        .then(response => response.text())
        .then(html => {
            console.log("🟢 2. Fetch response received and HTML fetched");

            // Inject HTML into modal body
            const modalElement = document.getElementById("crudModal");
            const modalBody = modalElement.querySelector("#modalContent");
            modalBody.innerHTML = html;

            // Update title (optional)
            const modalTitle = modalElement.querySelector(".modal-title");
            modalTitle.textContent = "Record Details";

            // Store slug on modal element for later use
            modalElement.dataset.slug = slug;

            // Show the modal
            const $modal = new bootstrap.Modal(modalElement);
            $modal.show();

            // 🟢 Attach Save button logic after modal is shown
            modalElement.addEventListener('shown.bs.modal', () => {
                console.log("🟢 3. Modal shown event triggered");

                const saveBtn = document.getElementById('saveRecordBtn');
                if (saveBtn) {
                    saveBtn.addEventListener('click', function () {
                        saveRecord(slug);
                    });
                }
            });
        })
        .catch(error => {
            console.error('🔴 Error fetching modal content:', error);
        });
}

// 🟢 Function to handle saving updates
function saveRecord(slug) {
    const modalElement = document.getElementById("crudModal");
    const formElements = modalElement.querySelectorAll('.field-input');
    const formData = new FormData();

    formElements.forEach(input => {
        formData.append(input.name, input.value);
    });

    fetch(`/mapper/modal/${slug}/update/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCsrfToken(),
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("🟢 Record updated successfully:", data);

            // Update value spans and hide inputs
            formElements.forEach(input => {
                const fieldName = input.name;
                const valueSpan = document.getElementById(`value_${fieldName}`);
                valueSpan.textContent = input.value;
                input.classList.add("d-none");
                valueSpan.classList.remove("d-none");

                // Uncheck toggle
                const toggle = modalElement.querySelector(`.toggle-edit[data-field="${fieldName}"]`);
                if (toggle) toggle.checked = false;
            });

            // Optional: Close modal (uncomment if desired)
            // const modalInstance = bootstrap.Modal.getInstance(modalElement);
            // modalInstance.hide();

        } else {
            console.error("🔴 Validation errors:", data.errors);
            alert('Please correct the form errors.');
        }
    })
    .catch(error => {
        console.error("🔴 Error updating record:", error);
    });
}

// 🟢 Helper to get CSRF token from cookie
function getCsrfToken() {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const trimmed = cookie.trim();
        if (trimmed.startsWith(name + '=')) {
            return decodeURIComponent(trimmed.substring(name.length + 1));
        }
    }
    return '';
}
