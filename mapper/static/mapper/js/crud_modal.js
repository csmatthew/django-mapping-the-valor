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
            return fetch(`/mapper/valor-records/?slug=${slug}`);
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            let modalTitle = document.getElementById("modalTitle");
            if (modalTitle) {
                // Inject the JSON data into the modal title
                modalTitle.textContent = `Record for ${data.name} ${data.record_type}`;
            }
            let modalLink = document.getElementById("modalLink");
            if (modalLink) {
                modalLink.href = `/detail/${data.slug}/`;  // Assign the correct URL
                modalLink.textContent = `View detailed record for ${data.name} ${data.record_type}`;
                modalLink.target = "_blank";  // Open in a new tab (optional)
                modalLink.onclick = function() {
                    window.location.href = modalLink.href;
                };
            }
            let modalContent = document.getElementById("modalContent");
            if (modalContent) {
                // Inject the JSON data into the modal fields
                modalContent.innerHTML = `
                    <table class="table table-bordered table-striped">
                        <tr>
                            <th>Record Name</th>
                            <td>${data.name} ${data.record_type}</td>
                        </tr>
                        <tr>
                            <th>Deanery</th>
                            <td>${data.deanery}</td>
                        </tr>
                        <tr>
                            <th>Dedication</th>
                            <td>${data.dedication ?? "Unknown"}</td>
                        </tr>
                        <tr>
                            <th>Valuation</th>
                            <td>${data.valuation ?? "Not provided"}</td>
                        </tr>
                        <tr>
                            <th>Coordinates</th>
                            <td>${data.latitude}, ${data.longitude}</td>
                        </tr>
                    </table>
                `;
            }
        })
        .catch(error => {
            console.error(`Error loading modal: ${error.message}`);
        });
}