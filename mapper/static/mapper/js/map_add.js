document.addEventListener('DOMContentLoaded', function () {
    const addRecordBtn = document.getElementById('add-record-btn');
    let isAddingRecord = false;

    if (addRecordBtn) {
        addRecordBtn.addEventListener('click', () => {
            isAddingRecord = true;
            map.getContainer().style.cursor = 'crosshair';
            addRecordBtn.disabled = true;
        });
    }

    map.on('click', function (e) {
        if (isAddingRecord) {
            openCreateModal({
                latitude: e.latlng.lat.toFixed(6),
                longitude: e.latlng.lng.toFixed(6)
            });
            map.getContainer().style.cursor = '';
            isAddingRecord = false;
            addRecordBtn.disabled = false;
        }
    });
});