$(document).ready(function() {
    $('#employee_id').select2();
    $('#asset_id').select2({
        placeholder: "Select Asset",
        allowClear: true
    });
});
