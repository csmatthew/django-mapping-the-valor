document.addEventListener('DOMContentLoaded', function () {
    const addRecordBtn = document.getElementById('add-record-btn');
    let isAddingRecord = false;
    let isAwaitingLocation = false;
    const mapContainer = document.getElementById('map-container');
    const mapOverlay = document.getElementById('map-overlay');
    const crudModal = document.getElementById('crudModal');
    const mapBackgroundOverlay = document.getElementById('map-background-overlay');

    function enterAddMode() {
        isAddingRecord = true;
        isAwaitingLocation = false;
        map.getContainer().style.cursor = 'crosshair';
        addRecordBtn.classList.add('active');
        mapContainer.classList.add('map-editing-border');
        if (mapOverlay) mapOverlay.classList.remove('d-none'); // Show prompt overlay
        if (mapBackgroundOverlay) mapBackgroundOverlay.classList.add('visible'); // Optional: show grey overlay
        addRecordBtn.disabled = false;
    }

    function exitAddMode() {
        isAddingRecord = false;
        isAwaitingLocation = false;
        map.getContainer().style.cursor = '';
        addRecordBtn.classList.remove('active');
        mapContainer.classList.remove('map-editing-border');
        if (mapOverlay) mapOverlay.classList.add('d-none'); // Hide prompt overlay
        if (mapBackgroundOverlay) mapBackgroundOverlay.classList.remove('visible'); // Optional: hide grey overlay
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
        if (isAddingRecord && !isAwaitingLocation) {
            // First click: indicate to user to now select the location
            isAwaitingLocation = true;
            if (mapOverlay) mapOverlay.textContent = "Click the map to set the record location.";
            return;
        }
        if (isAddingRecord && isAwaitingLocation) {
            // Second click: open modal and exit add mode after modal closes
            openCreateModal({
                latitude: e.latlng.lat.toFixed(6),
                longitude: e.latlng.lng.toFixed(6)
            });
            // Do not exitAddMode() here; let modal close handler do it
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