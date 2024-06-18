let chart; // Declare a variable to hold the chart instance

function processCsvData(data) {
    const playerStats = {};
    const eloColumns = Object.keys(data[0]).slice(10); // Adjust as needed based on your data structure
    const elos = {};

    // Initialize ELO arrays for each player
    eloColumns.forEach(col => {
        elos[col] = [];
    });

    // Extract ELO ratings for each player from each row and only save if it has changed
    data.forEach(row => {
        eloColumns.forEach(col => {
            if (row[col] !== null && row[col] !== undefined) {
                const currentElo = row[col];
                const previousElo = elos[col].length ? elos[col][elos[col].length - 1] : null;
                if (currentElo !== previousElo) {
                    elos[col].push(currentElo);
                }
            }
        });
    });

    data.forEach(match => {
        const homePlayer = match['Hazai játékos'];
        const awayPlayer = match['Vendég játékos'];
        const homeGoals = parseFloat(match['Hazai gól']) || 0;
        const awayGoals = parseFloat(match['Vendég gól']) || 0;
        const goalDifference = homeGoals - awayGoals;

        if (!playerStats[homePlayer]) {
            playerStats[homePlayer] = {
                totalMatches: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                goalDifference: 0,
                eloGained: elos[homePlayer] ? elos[homePlayer][elos[homePlayer].length - 1] : 0,
                eloHistory: elos[homePlayer] || [],
                matches: []
            };
        }

        if (!playerStats[awayPlayer]) {
            playerStats[awayPlayer] = {
                totalMatches: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                goalDifference: 0,
                eloGained: elos[awayPlayer] ? elos[awayPlayer][elos[awayPlayer].length - 1] : 0,
                eloHistory: elos[awayPlayer] || [],
                matches: []
            };
        }

        playerStats[homePlayer].totalMatches += 1;
        playerStats[awayPlayer].totalMatches += 1;

        playerStats[homePlayer].goalDifference += goalDifference;
        playerStats[awayPlayer].goalDifference -= goalDifference;

        playerStats[homePlayer].matches.push(match);
        playerStats[awayPlayer].matches.push(match);

        if (homeGoals > awayGoals) {
            playerStats[homePlayer].wins += 1;
            playerStats[awayPlayer].losses += 1;
        } else if (homeGoals < awayGoals) {
            playerStats[homePlayer].losses += 1;
            playerStats[awayPlayer].wins += 1;
        } else {
            playerStats[homePlayer].draws += 1;
            playerStats[awayPlayer].draws += 1;
        }
    });

    return playerStats;
}

function createChart(playerName, playerStats) {
    const ctx = document.getElementById('eloChart').getContext('2d');

    // Destroy the existing chart instance if it exists
    if (chart) {
        chart.destroy();
    }

    const eloHistory = playerStats[playerName].eloHistory;
    const matchLabels = playerStats[playerName].matches.map(match => {
        const homePlayer = match['Hazai játékos'];
        const awayPlayer = match['Vendég játékos'];
        const homeGoals = match['Hazai gól'];
        const awayGoals = match['Vendég gól'];
        return `${homePlayer} ${homeGoals} - ${awayGoals} ${awayPlayer}`;
    });

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: eloHistory.map((_, index) => index + 1),
            datasets: [{
                label: 'ELO',
                data: eloHistory,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Match Number'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'ELO Rating'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const labelIndex = context.dataIndex;
                            const matchLabel = matchLabels[labelIndex];
                            return `${matchLabel}: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}

fetch('stats.csv')
    .then(response => response.text())
    .then(csvText => {
        const parsedData = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
        }).data;

        const playerStats = processCsvData(parsedData);

        const playerSelect = document.getElementById('playerSelect');
        for (const player in playerStats) {
            if(player !== 'null') {            
            const option = document.createElement('option');
            option.value = player;
            option.textContent = player;
            playerSelect.appendChild(option);
                                  }
        }

        playerSelect.addEventListener('change', function() {
            const playerName = this.value;
            if (playerName && playerStats[playerName]) {
                const stats = playerStats[playerName];
                document.getElementById('statsContainer').style.display = 'block';
                document.getElementById('playerName').innerText = playerName;
                document.getElementById('totalMatches').innerText = stats.totalMatches;
                document.getElementById('wins').innerText = stats.wins;
                document.getElementById('losses').innerText = stats.losses;
                document.getElementById('draws').innerText = stats.draws;
                document.getElementById('goalDifference').innerText = stats.goalDifference;
                document.getElementById('eloGained').innerText = stats.eloGained;

                const matchesTableBody = document.getElementById('matchesTable').querySelector('tbody');
                matchesTableBody.innerHTML = '';
                stats.matches.forEach(match => {
                    const row = document.createElement('tr');
                    let resultClass = 'draw';
                    if (match['Hazai játékos'] === playerName) {
                        if (match['Hazai gól'] > match['Vendég gól']) {
                            resultClass = 'win';
                        } else if (match['Hazai gól'] < match['Vendég gól']) {
                            resultClass = 'loss';
                        }
                    } else if (match['Vendég játékos'] === playerName) {
                        if (match['Hazai gól'] > match['Vendég gól']) {
                            resultClass = 'loss';
                        } else if (match['Hazai gól'] < match['Vendég gól']) {
                            resultClass = 'win';
                        }
                    }

                    row.className = resultClass;
                    row.innerHTML = `
                        <td>${match['Hazai játékos']}</td>
                        <td>${match['Vendég játékos']}</td>
                        <td>${match['Hazai gól']}</td>
                        <td>${match['Vendég gól']}</td>
                        <td>${match['Bajnoki / Playoff']}</td>
                    `;
                    matchesTableBody.appendChild(row);
                });

                createChart(playerName, playerStats);
            } else {
                document.getElementById('statsContainer').style.display = 'none';
            }
        });
    })
    .catch(error => console.error('Error loading CSV data:', error));
