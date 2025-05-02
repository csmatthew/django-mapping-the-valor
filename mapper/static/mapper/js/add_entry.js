// Function to retrieve the CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener("DOMContentLoaded", function () {
    // Show modal when 'Add Entry' button is clicked
    const addEntryBtn = document.getElementById("add-entry-btn");
    if (addEntryBtn) {
        addEntryBtn.addEventListener("click", function () {
            const addEntryModal = new bootstrap.Modal(document.getElementById("addEntryModal"));
            addEntryModal.show();
        });
    }

    // Ensure modal-backdrop is removed when the modal is closed
    const addEntryModalElement = document.getElementById("addEntryModal");
    if (addEntryModalElement) {
        addEntryModalElement.addEventListener("hidden.bs.modal", function () {
            const backdrops = document.querySelectorAll(".modal-backdrop");
            backdrops.forEach(backdrop => backdrop.remove()); // Remove lingering backdrops
        });
    }

    // Handle form submission
    const form = document.getElementById("addEntryForm");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            const formData = {
                name: form.entryName.value,
                deanery: form.entryDeanery.value,
                record_type: form.entryRecordType.value,
                house_type: form.entryHouseType.value,
                religious_order: form.entryReligiousOrder.value,
                latitude: form.entryLatitude.value,
                longitude: form.entryLongitude.value,
                dedication: form.entryDedication.value,
                entry_pounds: form.entryPounds.value,
                entry_shillings: form.entryShillings.value,
                entry_pence: form.entryPence.value,
            };

            fetch(form.action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"), // Include CSRF token
                },
                body: JSON.stringify(formData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.success) {
                        alert(data.message);
                        location.reload(); // Reload the page to reflect changes
                    } else {
                        alert(data.message);
                    }
                })
                .catch((error) => console.error("Error adding entry:", error));
        });
    }

    // Conditional visibility of fields for religious entries
    const recordTypeField = $("#entryRecordType"); // Use jQuery to target the Select2 element
    const houseTypeField = document.getElementById("houseTypeField");
    const religiousOrderField = document.getElementById("religiousOrderField");

    function toggleFields() {
        const selectedOption = recordTypeField.val(); // Get the selected value using Select2's API
        const selectedText = recordTypeField.find("option:selected").text(); // Get the selected text

        if (selectedText === "Monastery") {
            houseTypeField.style.display = "block";
            religiousOrderField.style.display = "block";
        } else {
            houseTypeField.style.display = "none";
            religiousOrderField.style.display = "none";
        }
    }

    // Initialize visibility on page load
    toggleFields();

    // Add event listener to toggle visibility on change
    recordTypeField.on("change", toggleFields); // Use Select2's change event
});
