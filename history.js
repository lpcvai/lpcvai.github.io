// Function to load CSV and display as a table
function loadCSV(filePath) {
  fetch(filePath)
      .then(response => response.text())
      .then(data => {
          displayCSV(data);
      })
      .catch(error => {
          console.error("Error loading CSV:", error);
          document.getElementById('table-container').innerHTML = '<p style="color:red;">Failed to load data: ' + error.message + '</p>';
      });
}

// Function to convert CSV text to HTML table
function displayCSV(data) {
  const rows = data.split('\n');
  let tableHTML = '<table id="leaderboard" class="w3-table w3-bordered display">';
 
  rows.forEach((row, index) => {
      const cols = row.split(',');
      tableHTML += '<tr>';
      
      // Add <th> for header row, <td> for data rows
      cols.forEach(col => {
          tableHTML += index === 0 ? `<th>${col}</th>` : `<td>${col}</td>`;
      });

      tableHTML += '</tr>';
  });

  tableHTML += '</table>';
  document.getElementById('table-container').innerHTML = tableHTML;

  $('#leaderboard').DataTable({
    paging: false,
    searching: false,  
    order: []
  });
}

// Event listener for dropdown selection
document.getElementById('csv-select').addEventListener('change', function() {
  const selectedCSV = this.value;
  loadCSV(selectedCSV);  // Load the selected CSV file
});

// Load the first CSV by default when the page loads
window.onload = function() {
  const defaultCSV = document.getElementById('csv-select').value;
  loadCSV(defaultCSV);  // Load the default CSV
};
