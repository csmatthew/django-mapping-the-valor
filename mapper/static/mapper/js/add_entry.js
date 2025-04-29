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
    const submitEntryBtn = document.getElementById("submitEntryBtn");
    if (submitEntryBtn) {
        submitEntryBtn.addEventListener("click", function () {
            const form = document.getElementById("addEntryForm");

            // Validate deanery selection
            const deanery = form.entryDeanery.value;
            if (!deanery) {
                alert("Please select a valid deanery.");
                return;
            }

            // Gather form data
            const formData = {
                name: form.entryName.value,
                record_type: form.entryType.value,
                latitude: form.entryLatitude.value,
                longitude: form.entryLongitude.value,
                dedication: form.entryDedication.value,
                deanery: deanery, // Pass the deanery name
            };

            // Send the data to the backend via an AJAX request
            fetch("/valor-records/add/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken"), // Include CSRF token for Django
                },
                body: JSON.stringify(formData),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message);
                        location.reload(); // Reload the page to reflect the new record
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error("Error adding entry:", error));
        });
    }


    const deaneryDropdown = document.getElementById("entryDeanery");
    if (deaneryDropdown) {
        console.log("Deanery dropdown found:", deaneryDropdown);

        // Log the options in the dropdown
        const options = deaneryDropdown.options;
        for (let i = 0; i < options.length; i++) {
            console.log("Option:", options[i].value, options[i].text);
        }
    }
});
