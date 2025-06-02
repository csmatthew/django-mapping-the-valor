function openCrudModal(slug) {
    fetch(`/mapper/modal/${slug}/`)
        .then(response => response.text())
        .then(html => {
            const modalElement = document.getElementById("crudModal");
            modalElement.querySelector("#modalContent").innerHTML = html;
            modalElement.querySelector(".modal-title").textContent = "Edit Record";
            modalElement.dataset.slug = slug;
            new bootstrap.Modal(modalElement).show();
            document.getElementById('saveRecordBtn').onclick = function () {
                saveRecord(slug);
            };
            // Show delete button for existing records
            const deleteBtn = document.getElementById('deleteRecordBtn');
            if (deleteBtn) {
                deleteBtn.style.display = '';
                deleteBtn.onclick = function () {
                    if (confirm("Are you sure you want to delete this record?")) {
                        deleteRecord(slug);
                    }
                };
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
            // Pre-fill lat/lng if needed
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
            // Hide delete button for new records
            const deleteBtn = document.getElementById('deleteRecordBtn');
            if (deleteBtn) {
                deleteBtn.style.display = 'none';
            }
        });
}

function saveRecord(slug) {
    const modalElement = document.getElementById("crudModal");
    const form = modalElement.querySelector('form');
    const formData = new FormData(form);
    let url = slug ? `/mapper/modal/${slug}/update/` : '/mapper/add-record/';
    fetch(url, {
        method: 'POST',
        headers: { "X-CSRFToken": getCsrfToken() },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            bootstrap.Modal.getInstance(modalElement).hide();
            // Optionally refresh map or add marker here
        } else {
            alert('Please correct the form errors.');
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
            // Optionally remove marker from map here
        } else {
            alert('Failed to delete record.');
        }
    });
}