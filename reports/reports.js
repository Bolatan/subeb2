window.onload = function() {
    fetchAuditReports();
    // Fetch reports for all other surveys
    fetchAndRender('silnat', 'silnatReportsTable', renderSilnatReportRow);
    fetchAndRender('silat_1.2', 'silat1_2ReportsTable', renderSilat1_2ReportRow);
    fetchAndRender('silat_1.3', 'silat1_3ReportsTable', renderSilat1_3ReportRow);
    fetchAndRender('silat_1.4', 'silat1_4ReportsTable', renderSilat1_4ReportRow);
    fetchAndRender('tcmats', 'tcmatsReportsTable', renderTcmatsReportRow);
    fetchAndRender('lori', 'loriReportsTable', renderLoriReportRow);
    fetchAndRender('voices', 'voicesReportsTable', renderVoicesReportRow);
};

function fetchAuditReports() {
    const tableBody = document.getElementById('auditReportsTable');
    if (!tableBody) {
        console.error('Audit reports table body not found.');
        return;
    }
    tableBody.innerHTML = '<tr><td colspan="9">Loading reports...</td></tr>';
    try {
        const saved = localStorage.getItem('auditData');
        const audits = saved ? JSON.parse(saved) : [];
        renderAuditReports(audits);
    } catch (error) {
        console.error('Error fetching audit reports from localStorage:', error);
        tableBody.innerHTML = '<tr><td colspan="9" style="color:red;">Could not load reports from local storage.</td></tr>';
    }
}

function renderAuditReports(audits) {
    const tableBody = document.getElementById('auditReportsTable');
    if (!audits || audits.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="9">No audit reports found.</td></tr>';
        return;
    }
    tableBody.innerHTML = '';
    audits.forEach(audit => {
        const row = document.createElement('tr');
        const photosHtml = audit.photos && audit.photos.length > 0
            ? audit.photos.map(photo => `<a href="${photo.data}" target="_blank"><img src="${photo.data}" alt="photo" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin: 2px;"></a>`).join('')
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

// Generic fetch and render function for other surveys
function fetchAndRender(surveyName, tableBodyId, renderRowFunction) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) {
        console.error(`${surveyName} reports table body not found.`);
        return;
    }
    const colSpan = tableBody.parentElement.querySelector('thead tr').childElementCount;
    tableBody.innerHTML = `<tr><td colspan="${colSpan}">Loading reports...</td></tr>`;

    try {
        const storageKey = `${surveyName}Data`;
        const saved = localStorage.getItem(storageKey);
        const data = saved ? JSON.parse(saved) : [];

        if (!data || data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="${colSpan}">No ${surveyName.replace(/_/g, ' ')} reports found.</td></tr>`;
            return;
        }
        tableBody.innerHTML = ''; // Clear loading message
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = renderRowFunction(item);
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(`Error fetching ${surveyName} reports from localStorage:`, error);
        tableBody.innerHTML = `<tr><td colspan="${colSpan}" style="color:red;">Could not load ${surveyName.replace(/_/g, ' ')} reports.</td></tr>`;
    }
}

// --- Row render functions for each survey type ---

function renderSilnatReportRow(item) {
    const institutionName = item.section_b?.institution_name_common || 'N/A';
    const lgea = item.section_b?.local_gov_common || 'N/A';
    const type = item.institution_type?.replace(/_/g, ' ') || 'N/A';
    const respondent = item.section_a?.head_teacher_name || item.section_a?.education_secretary_name || 'N/A';
    const date = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
    return `
        <td>${institutionName}</td>
        <td>${lgea}</td>
        <td style="text-transform: capitalize;">${type}</td>
        <td>${respondent}</td>
        <td>${date}</td>
    `;
}

function renderSilat1_2ReportRow(item) {
    const institutionName = item.section_b?.school_name || 'N/A';
    const lgea = item.section_b?.local_gov_educ_auth || 'N/A';
    const respondent = item.section_a?.head_teacher_name || 'N/A';
    const date = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
    return `
        <td>${institutionName}</td>
        <td>${lgea}</td>
        <td>${respondent}</td>
        <td>${date}</td>
    `;
}

function renderSilat1_3ReportRow(item) {
    const institutionName = item.section_b?.school_name || 'N/A';
    const lgea = item.section_b?.lgea || 'N/A';
    const respondent = item.section_a?.head_teacher_name || 'N/A';
    const date = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
    return `
        <td>${institutionName}</td>
        <td>${lgea}</td>
        <td>${respondent}</td>
        <td>${date}</td>
    `;
}

function renderSilat1_4ReportRow(item) {
    const lgea = item.section_b?.lgea_name || 'N/A';
    const respondent = item.section_a?.education_secretary_name || 'Education Secretary';
    const date = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
    return `
        <td>${lgea}</td>
        <td>${respondent}</td>
        <td>${date}</td>
    `;
}


function renderTcmatsReportRow(item) {
    const teacherName = item.teacherName || 'N/A';
    const school = item.school || 'N/A';
    const lgea = item.lgea || 'N/A';
    const subject = item.subject || 'N/A';
    const className = item.class || 'N/A';
    const date = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
    return `
        <td>${teacherName}</td>
        <td>${school}</td>
        <td>${lgea}</td>
        <td>${subject}</td>
        <td>${className}</td>
        <td>${date}</td>
    `;
}

function renderLoriReportRow(item) {
    const assessor = item.assessorName || 'N/A';
    const teacher = item.teacherName || 'N/A';
    const school = item.school || 'N/A';
    const subject = item.subject || 'N/A';
    const rating = item.rating || 'N/A';
    const date = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
    return `
        <td>${assessor}</td>
        <td>${teacher}</td>
        <td>${school}</td>
        <td>${subject}</td>
        <td>${rating}</td>
        <td>${date}</td>
    `;
}

function renderVoicesReportRow(item) {
    const learnerName = item.learnerName || 'N/A';
    const school = item.school || 'N/A';
    const className = item.class || 'N/A';
    const opinion = (item.opinion || '').substring(0, 50) + ( (item.opinion || '').length > 50 ? '...' : '');
    const date = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A';
    return `
        <td>${learnerName}</td>
        <td>${school}</td>
        <td>${className}</td>
        <td>${opinion}</td>
        <td>${date}</td>
    `;
}
