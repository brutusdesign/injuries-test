// script.js
document.addEventListener("DOMContentLoaded", function () {
  const dataSets = {
    initiation: {
      label: 'Young Athletes',
      data: {
        shoulder: 15.1,
        elbow: 7.3,
        wrist: 13.2,
        back: 3.7,
        hip: 5.6,
        knee: 9.4,
        ankle: 11.3,
        foot: 6.1,
        muscle_injuries: 20.7,
        bone_edema_fracture: 0
      }
    },
    high_competition: {
      label: 'High Competition',
      data: {
        shoulder: 29.8,
        elbow: 22.0,
        wrist: 33.7,
        back: 14.2,
        hip: 15.5,
        knee: 28.5,
        ankle: 31.1,
        foot: 11.6,
        muscle_injuries: 16.8,
        bone_edema_fracture: 10.3
      }
    },
    professionals: {
      label: 'Professionals',
      data: {
        shoulder: 92.5,
        elbow: 51.8,
        wrist: 77.7,
        back: 85.1,
        hip: 33.2,
        knee: 59.2,
        ankle: 74.0,
        foot: 22.3,
        muscle_injuries: 88.9,
        bone_edema_fracture: 25.9
      }
    },
    veterans: {
      label: 'Veterans',
      data: {
        shoulder: 61.3,
        elbow: 63.6,
        wrist: 31.8,
        back: 41.3,
        hip: 17.0,
        knee: 60.2,
        ankle: 30.6,
        foot: 27.2,
        muscle_injuries: 23.8,
        bone_edema_fracture: 0
      }
    }
  };

  const levels = Object.keys(dataSets);
  let selected = [levels[0]];

  // Colores para cada nivel
  const COLORS = [
    '#004d40',
    '#00796b',
    '#c5e1a9',
    '#a5d6a7'
  ];

  // Construir botones
  const btnContainer = document.getElementById('buttons');
  levels.forEach(key => {
    const btn = document.createElement('button');
    btn.textContent = dataSets[key].label;
    btn.dataset.level = key;
    btn.classList.add('active');
    btn.addEventListener('click', () => {
      if (selected.includes(key) && selected.length === 1) return;
      if (selected.includes(key)) {
        selected = selected.filter(l => l !== key);
      } else {
        selected.push(key);
      }
      updateButtons();
      updateChart();
      updateRecommendation();
    });
    btnContainer.appendChild(btn);
  });

  function updateButtons() {
    btnContainer.querySelectorAll('button').forEach(btn => {
      btn.classList.toggle('active', selected.includes(btn.dataset.level));
    });
  }

  // Preparar gráfico
  const ctx = document.getElementById('riskChart').getContext('2d');
  let riskChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: value => value + '%'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: context => context.parsed.y + '%'
          }
        },
        legend: {
          position: 'top'
        }
      }
    }
  });

  function updateChart() {
    const areas = Object.keys(dataSets.initiation.data);
    riskChart.data.labels = areas.map(a => a.replace(/_/g,' '));
    riskChart.data.datasets = selected.map((lvl, i) => ({
      label: dataSets[lvl].label,
      data: areas.map(a => dataSets[lvl].data[a] || 0),
      backgroundColor: COLORS[i % COLORS.length]
    }));
    riskChart.update();
  }

  function updateRecommendation() {
    const recEl = document.getElementById('recommendation');
    if (selected.length !== 1) {
      recEl.textContent = '';
      return;
    }
    const idx = levels.indexOf(selected[0]);
    if (idx < levels.length - 1) {
      const next = levels[idx + 1];
      let maxDiff = -Infinity, maxArea = '';
      Object.keys(dataSets.initiation.data).forEach(a => {
        const diff = (dataSets[next].data[a] || 0) - (dataSets[selected[0]].data[a] || 0);
        if (diff > maxDiff) {
          maxDiff = diff;
          maxArea = a;
        }
      });
      recEl.textContent = `En ${dataSets[selected[0]].label}, el mayor salto a ${dataSets[next].label}: ${maxArea.replace(/_/g,' ')} (+${maxDiff.toFixed(1)}%).`;
    } else {
      recEl.textContent = `Estás en el nivel más alto (${dataSets[selected[0]].label}). ¡Sigue así!`;
    }
  }

  // Init
  updateButtons();
  updateChart();
  updateRecommendation();
});
