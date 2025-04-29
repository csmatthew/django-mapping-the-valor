$(document).ready(function () {
    // Initialize Select2 globally for elements with the "js-example-tags" class
    $(".js-example-tags").select2({
        placeholder: "Select a Deanery",
        allowClear: true,
        dropdownParent: $('#addEntryModal'), // Ensure dropdown is appended to the modal
    });

    // Reinitialize Select2 when the Bootstrap modal is shown
    $('#addEntryModal').on('shown.bs.modal', function () {
        const deaneryDropdown = $("#entryDeanery");
        if (!deaneryDropdown.hasClass("select2-hidden-accessible")) {
            deaneryDropdown.select2({
                placeholder: "Select a Deanery",
                allowClear: true,
                dropdownParent: $('#addEntryModal'), // Ensure dropdown is appended to the modal
            });
        }
    });
});