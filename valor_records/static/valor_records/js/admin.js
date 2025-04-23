document.addEventListener('DOMContentLoaded', function () {
    const recordTypeField = document.querySelector('#id_record_type');
    const houseTypeField = document.querySelector('.field-house_type');
    const religiousOrderField = document.querySelector('.field-religious_order');

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

    // Initial check
    toggleFields();

    // Add event listener to record type field
    recordTypeField.addEventListener('change', toggleFields);
});
