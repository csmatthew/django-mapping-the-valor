document.addEventListener('DOMContentLoaded', function () {
    console.log('admin.js loaded'); // Debugging statement

    const recordTypeField = document.querySelector('#id_record_type');
    const houseTypeField = document.querySelector('.field-house_type');
    const religiousOrderField = document.querySelector('.field-religious_order');

    console.log('Fields:', { recordTypeField, houseTypeField, religiousOrderField }); // Debugging statement

    if (!recordTypeField || !houseTypeField || !religiousOrderField) {
        console.error('Element not found:', {
            recordTypeField,
            houseTypeField,
            religiousOrderField
        });
        return;
    }

    function toggleFields() {
        console.log('toggleFields called');
        if (recordTypeField.value === 'Monastery') {
            houseTypeField.style.display = '';
            religiousOrderField.style.display = '';
        } else {
            houseTypeField.style.display = 'none';
            religiousOrderField.style.display = 'none';
        }
    }

    toggleFields();
    recordTypeField.addEventListener('change', toggleFields);
});
