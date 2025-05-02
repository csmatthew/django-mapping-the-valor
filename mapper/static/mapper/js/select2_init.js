$(document).ready(function () {
    // Initialize Select2 globally for elements with the "js-example-tags" class
    $(".js-example-tags").select2({
        allowClear: true,
        dropdownParent: $('#addEntryModal'), // Ensure dropdown is appended to the modal
    });
});