// Function to load and display both qualifying and non-qualifying CSVs based on the competition track
function loadCompetitionData(track) {
  let qualifyingPath, nonQualifyingPath;

  // Determine the correct CSV paths based on the selected track
  switch(track) {
      case "2023_Segmentation":
          qualifyingPath = "static/leaderboard/Leaderboard History - 2023 Qualifying.csv";
          nonQualifyingPath = "static/leaderboard/Leaderboard History - 2023 Qualifying*.csv";
          break;
      case "2021_Video":
          qualifyingPath = "static/leaderboard/Leaderboard History - 2021 Video Qualifying.csv";
          nonQualifyingPath = "static/leaderboard/Leaderboard History - 2021 Video Qualifying*.csv";
          break;
      case "2021_FPGA":
          qualifyingPath = "static/leaderboard/Leaderboard History - 2021 FPGA Qualifying.csv";
          nonQualifyingPath = "static/leaderboard/Leaderboard History - 2021 FPGA Qualifying*.csv";
          break;
      case "2020_VID":
          qualifyingPath = "static/leaderboard/Leaderboard History - 2020 VID Qualifying.csv";
          nonQualifyingPath = "static/leaderboard/Leaderboard History - 2020 VID Qualifying*.csv";
          break;
      case "2020_FPGA":
          qualifyingPath = "static/leaderboard/Leaderboard History - 2020 FPGA Qualifying.csv";
          nonQualifyingPath = "static/leaderboard/Leaderboard History - 2020 FPGA Qualifying*.csv";
          break;
      default:
          console.error("Invalid track selected");
          return;
  }

  // Load and display qualifying data
  loadCSV(qualifyingPath, 'qualifying-table-container');

  // Load and display non-qualifying data
  loadCSV(nonQualifyingPath, 'nonqualifying-table-container');
}

// Function to load CSV and display as a table
function loadCSV(filePath, containerId) {
  fetch(filePath)
      .then(response => response.text())
      .then(data => {
          displayCSV(data, containerId);
      })
      .catch(error => {
          console.error("Error loading CSV:", error);
          document.getElementById(containerId).innerHTML = '<p style="color:red;">Failed to load data: ' + error.message + '</p>';
      });
}

// Function to convert CSV text to HTML table and display in specified container
function displayCSV(data, containerId) {
  const rows = data.split('\n');
  let tableHTML = '<table id="leaderboard" class="w3-table w3-bordered display">';

  rows.forEach((row, index) => {
      const cols = row.split(',');
      tableHTML += '<tr>';

      // Add <th> for header row, <td> for data rows
      cols.forEach(col => {
          col = col.trim();
          tableHTML += index === 0 ? `<th>${col}</th>` : `<td>${col}</td>`;
      });

      tableHTML += '</tr>';
  });

  tableHTML += '</table>';
  document.getElementById(containerId).innerHTML = tableHTML;


  $('#leaderboard' + containerId).DataTable({
    paging: true,
    searching: true,
    ordering: true, 
    order: [] 
  });
}

// Event listener for dropdown selection
document.getElementById('csv-select').addEventListener('change', function() {
  const selectedTrack = this.value;
  loadCompetitionData(selectedTrack);  // Load both qualifying and non-qualifying data for the selected track
});

// Load default competition data when the page loads
window.onload = function() {
  const defaultTrack = document.getElementById('csv-select').value;
  loadCompetitionData(defaultTrack);  // Load the default track's competition data
};
