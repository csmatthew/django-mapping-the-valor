// crud_modal.js

function openCrudModal(slug) {
    fetch(`/mapper/modal/${slug}/`)
        .then(response => response.text())
        .then(html => {
            const modalElement = document.getElementById("crudModal");
            modalElement.querySelector("#modalContent").innerHTML = html;
            // Set modal title based on authentication
            if (window.isUserAuthenticated) {
                modalElement.querySelector(".modal-title").textContent = "Edit Record";
            } else {
                modalElement.querySelector(".modal-title").textContent = "View Record";
            }
            modalElement.dataset.slug = slug;
            new bootstrap.Modal(modalElement).show();

            document.getElementById('saveRecordBtn').onclick = function () {
                saveRecord(slug);
            };

            const deleteBtn = document.getElementById('deleteRecordBtn');
            if (deleteBtn) {
                deleteBtn.style.display = '';
                deleteBtn.onclick = function () {
                    if (confirm("Are you sure you want to delete this record?")) {
                        deleteRecord(slug);
                    }
                };
            }

            // After loading modal HTML in openCrudModal
            if (!window.isUserAuthenticated) {
                document.getElementById('saveRecordBtn').style.display = 'none';
                const deleteBtn = document.getElementById('deleteRecordBtn');
                if (deleteBtn) deleteBtn.style.display = 'none';
            }
        });
}

function openCreateModal(initialData = {}) {
    fetch('/mapper/modal/create/')
        .then(response => response.text())
        .then(html => {
            const modalElement = document.getElementById("crudModal");
            modalElement.querySelector("#modalContent").innerHTML = html;
            modalElement.querySelector(".modal-title").textContent = "Add New Record";
            modalElement.dataset.slug = "";

            if (initialData.latitude && initialData.longitude) {
                const latInput = modalElement.querySelector('[name="latitude"]');
                const lngInput = modalElement.querySelector('[name="longitude"]');
                if (latInput) latInput.value = initialData.latitude;
                if (lngInput) lngInput.value = initialData.longitude;
            }

            new bootstrap.Modal(modalElement).show();

            document.getElementById('saveRecordBtn').onclick = function () {
                saveRecord("");
            };

            const deleteBtn = document.getElementById('deleteRecordBtn');
            if (deleteBtn) {
                deleteBtn.style.display = 'none';
            }
        });
}

function saveRecord(slug) {
    console.log(`🟠 Starting saveRecord - Slug: ${slug}`);

    const modalElement = document.getElementById("crudModal");
    const form = modalElement.querySelector('form');
    const formData = new FormData(form);
    let url = slug ? `/mapper/modal/${slug}/update/` : '/mapper/add-record/';

    console.log("🟠 Sending request to:", url);

    fetch(url, {
        method: 'POST',
        headers: { "X-CSRFToken": getCsrfToken() },
        body: formData,
    })
    .then(response => {
        console.log("🟢 Response received:", response);
        return response.json();
    })
    .then(data => {
        console.log("🟢 Parsed JSON:", data);

        if (data.success) {
            console.log("✅ Record saved successfully:", data.record);
            bootstrap.Modal.getInstance(modalElement).hide();

            if (!slug) {
                console.log("🟢 Adding new marker for:", data.record.name);
                addNewMarker(data.record);  // 🔥 Ensure marker is added dynamically
            } else {
                console.log(`🟢 Updating marker for slug: ${slug} -> ${data.record.slug}`);
                data.record.old_slug = slug;  // Store old slug before updating
                updateMarkerPopup(data.record);  // 🔥 Ensure marker updates properly
            }
        } else {
            console.error("🔴 Validation errors:", data.errors);
            alert('Please correct the form errors.');
        }
    })
    .catch(error => console.error("🔴 Error saving record:", error));
}

function deleteRecord(slug) {
    fetch(`/mapper/modal/${slug}/delete/`, {
        method: 'POST',
        headers: { "X-CSRFToken": getCsrfToken() },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const modalElement = document.getElementById("crudModal");
            bootstrap.Modal.getInstance(modalElement).hide();
            removeMarker(slug);  // 🔥 Ensure marker is removed instantly
        } else {
            alert('Failed to delete record.');
        }
    });
}

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
