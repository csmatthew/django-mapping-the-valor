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
                    </table>
                `;
            }
        })
        .catch(error => {
            console.error(`Error loading modal: ${error.message}`);
        });
}