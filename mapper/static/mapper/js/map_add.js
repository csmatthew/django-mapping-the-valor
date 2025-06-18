document.addEventListener('DOMContentLoaded', function () {
    const addRecordBtn = document.getElementById('add-record-btn');
    let isAddingRecord = false;
    const mapContainer = document.getElementById('map-container');
    const mapOverlay = document.getElementById('map-overlay');
    const crudModal = document.getElementById('crudModal');
    const mapBackgroundOverlay = document.getElementById('map-background-overlay');

    function enterAddMode() {
        isAddingRecord = true;
        map.getContainer().style.cursor = 'crosshair';
        addRecordBtn.classList.add('active');
        mapContainer.classList.add('map-editing-border');
        const mapBackgroundOverlay = document.getElementById('map-background-overlay');
        if (mapBackgroundOverlay) mapBackgroundOverlay.classList.add('visible'); // Show overlay
        addRecordBtn.disabled = false;
    }

    function exitAddMode() {
        isAddingRecord = false;
        map.getContainer().style.cursor = '';
        addRecordBtn.classList.remove('active');
        mapContainer.classList.remove('map-editing-border');
        const mapBackgroundOverlay = document.getElementById('map-background-overlay');
        if (mapBackgroundOverlay) mapBackgroundOverlay.classList.remove('visible'); // Hide overlay
        addRecordBtn.disabled = false;
    }

    if (addRecordBtn) {
        addRecordBtn.addEventListener('click', () => {
            if (!isAddingRecord) {
                enterAddMode();
            } else {
                exitAddMode();
            }
        });
    }

    map.on('click', function (e) {
        if (isAddingRecord) {
            openCreateModal({
                latitude: e.latlng.lat.toFixed(6),
                longitude: e.latlng.lng.toFixed(6)
            });
        }
    });

    document.addEventListener('keydown', function (e) {
        if (isAddingRecord && e.key === 'Escape') {
            exitAddMode();
        }
    });

    if (crudModal) {
        crudModal.addEventListener('hidden.bs.modal', function () {
            exitAddMode();
        });
    }
});