// Fetch the CSV file from a URL (local server or API)
fetch('contests/2020CPVR/Organizer.csv')
  .then(response => response.text())  // Get the response as text
  .then(csvContent => {
    // Split the content into rows
    const rows = csvContent.trim().split('\n');

    // Parse each row
    rows.forEach((row, index) => {
      const columns = row.split(',');  // Split by commas
      console.log(`Row ${index + 1}:`, columns);
    });
  })
  .catch(error => console.error('Error fetching the CSV file:', error));
