function openCrudModal(slug) {
    console.log("Opening modal for slug:", slug);

    // Load the base modal structure
    fetch(`/mapper/modal/`)
        .then(response => response.text())
        .then(html => {
            // Inject the base modal structure into the DOM
            if (!document.getElementById("crudModal")) {
                document.body.insertAdjacentHTML("beforeend", html);
            }
            $("#crudModal").modal("show");

            // Fetch and populate the modal content
            return fetch(`/mapper/modal/${slug}/read/`);
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            let modalContent = document.getElementById("modalContent");
            if (modalContent) {
                // Inject the JSON data into the modal fields
                modalContent.innerHTML = `
                    <p><strong>Record Name:</strong> ${data.name}</p>
                    <p><strong>Record Type:</strong> ${data.record_type}</p>
                    <p><strong>Deanery:</strong> ${data.deanery}</p>
                `;
            }
        })
        .catch(error => console.error("Error loading modal:", error));
}