document.addEventListener('DOMContentLoaded', function () {
   
    fetch('/api/tickers')
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById('tickerData');
        tableBody.innerHTML = ''; 
        data.forEach((ticker, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${ticker.name}</td>
            <td>${ticker.last}</td>
            <td>${ticker.buy} / ${ticker.sell}</td>
            <td>${(ticker.sell - ticker.buy).toFixed(2)}</td>
            <td>${(ticker.sell - ticker.buy) * ticker.volume}</td>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error('Error fetching tickers:', error);
      });
  });
  