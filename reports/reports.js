window.onload = function() {
    fetchAuditReports();
};

function fetchAuditReports() {
    const tableBody = document.getElementById('auditReportsTable');
    if (!tableBody) {
        console.error('Audit reports table body not found.');
        return;
    }

    // Start with a loading message
    tableBody.innerHTML = '<tr><td colspan="9">Loading reports...</td></tr>';

    fetch('/api/audits')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(audits => {
            renderAuditReports(audits);
        })
        .catch(error => {
            console.error('Error fetching audit reports:', error);
            tableBody.innerHTML = '<tr><td colspan="9" style="color:red;">Could not load reports. Please try again later.</td></tr>';
        });
}

function renderAuditReports(audits) {
    const tableBody = document.getElementById('auditReportsTable');
    if (!audits || audits.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9">No audit reports found.</td></tr>';
        return;
    }

    // Clear loading message
    tableBody.innerHTML = '';

    audits.forEach(audit => {
        const row = document.createElement('tr');

        const photosHtml = audit.photos && audit.photos.length > 0
            ? audit.photos.map(photo => `<a href="/api/photo/${encodeURIComponent(photo)}" target="_blank"><img src="/api/photo/${encodeURIComponent(photo)}" alt="photo" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin: 2px;"></a>`).join('')
            : 'No photos';

        row.innerHTML = `
            <td>${audit.schoolName || ''}</td>
            <td>${audit.localGov || ''}</td>
            <td>${new Date(audit.timestamp).toLocaleString() || ''}</td>
            <td>${audit.principalName || ''}</td>
            <td>${audit.totalTeachers || 0}</td>
            <td>${audit.totalStudents || 0}</td>
            <td>${audit.facilityCondition || ''}</td>
            <td>${audit.additionalNotes || ''}</td>
            <td>${photosHtml}</td>
        `;
        tableBody.appendChild(row);
    });
}
