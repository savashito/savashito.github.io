document.getElementById('harvestForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const harvestType = document.getElementById('harvest-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
  
    if (!harvestType || !startDate || !endDate) {
      alert('Please fill out all fields.');
      return;
    }
  
    alert(`Harvest Type: ${harvestType}\nStart Date: ${startDate}\nEnd Date: ${endDate}`);
  });
  