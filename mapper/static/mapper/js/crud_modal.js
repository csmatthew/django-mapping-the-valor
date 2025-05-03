function openCrudModal(slug) {
    console.log("Opening modal for slug:", slug);

    // Load the base modal structure
    fetch(`/mapper/modal/`)
        .then(response => response.text())
        .then(html => {
            if (!document.getElementById("crudModal")) {
                document.body.insertAdjacentHTML("beforeend", html);
            }
            $("#crudModal").modal("show");

            return fetch(`/mapper/valor-records/?slug=${slug}`);
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            populateModalContent(data);
        })
        .catch(error => {
            console.error(`Error loading modal: ${error.message}`);
        });
}

// Function to populate modal fields (without injecting HTML)
function populateModalContent(data) {
    let modalTitle = document.getElementById("modalTitle");
    if (modalTitle) {
        modalTitle.textContent = `Record for ${data.name} ${data.record_type}`;
        modalTitle.dataset.slug = data.slug; // Store slug for submission
    }

    let modalLink = document.getElementById("modalLink");
    if (modalLink) {
        modalLink.href = `/detail/${data.slug}/`;
        modalLink.textContent = `View detailed record for ${data.slug}`;
        modalLink.target = "_blank";
        modalLink.onclick = function() {
            window.location.href = modalLink.href;
        };
    }

    // ✅ **Populate existing fields**
    document.getElementById("dedication").textContent = data.dedication ?? "Unknown";

    let editToggle = document.getElementById("editToggle");
    if (editToggle) {
        editToggle.addEventListener("change", function() {
            toggleEditMode(this.checked);
        });
    }
}

// Function to enable/disable editing
function toggleEditMode(isEditable) {
    document.querySelectorAll("#modalContent table td").forEach(cell => {
        cell.contentEditable = isEditable;
        cell.style.backgroundColor = isEditable ? "#f8f9fa" : "";
    });

    let saveButton = document.getElementById("saveChangesBtn");
    if (saveButton) {
        saveButton.style.display = isEditable ? "block" : "none";
    }
}

document.getElementById("saveChangesBtn").addEventListener("click", function() {
    let formData = new FormData();
    let csrfToken = getCSRFToken();
    let slug = document.getElementById("modalTitle").dataset.slug;
    let dedication = document.getElementById("dedication").textContent.trim();

    if (!csrfToken || !slug || dedication === "") {
        console.error("Missing required fields!", { csrfToken, slug, dedication });
        alert("Error: CSRF token, slug, and dedication are required.");
        return;
    }

    formData.append("csrfmiddlewaretoken", csrfToken);
    formData.append("slug", slug);
    formData.append("dedication", dedication);

    console.log("Submitting changes:", [...formData]); // Debugging output

    fetch(`/mapper/valor-records/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCSRFToken(),
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        if (result.success) {
            alert("Dedication updated successfully!");
            $("#crudModal").modal("hide");
        } else {
            console.error("Form validation errors:", result.errors);
            alert("Error updating dedication: " + JSON.stringify(result.errors));
        }
    })
    .catch(error => console.error("Error updating dedication:", error));
});

// Function to retrieve CSRF token from the page
function getCSRFToken() {
    let csrfTokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
    return csrfTokenInput ? csrfTokenInput.value : "";
}
