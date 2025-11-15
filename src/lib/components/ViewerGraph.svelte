<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  // Importation de Chart.js
  import { Chart, registerables } from 'chart.js';
  // Importation de l'adaptateur de temps Day.js
  import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm.js';
  // Importation de Day.js pour le formatage (et le français)
  import dayjs from 'dayjs';
  import 'dayjs/locale/fr';
  
  // Définir la locale en français pour les tooltips
  dayjs.locale('fr');

  // Enregistrer tous les composants de Chart.js (échelles,
  // contrôleurs, etc.)
  Chart.register(...registerables);

  type ViewerRecord = {
    count: number;
    timestamp: number;
  };

  let canvasElement: HTMLCanvasElement;
  let chart: Chart | null = null;

  onMount(() => {
    // Ne s'exécute que côté client
    fetchDataAndCreateChart();
  });

  onDestroy(() => {
    // Détruire l'instance du graphique pour éviter les fuites de mémoire
    if (chart) {
      chart.destroy();
    }
  });

  /**
   * Récupère les données de l'API et initialise le graphique
   */
  async function fetchDataAndCreateChart() {
    try {
      const response = await fetch('/api/stats/viewer-history');
      if (!response.ok) {
        throw new Error('Impossible de charger l\'historique des spectateurs');
      }
      const apiData: ViewerRecord[] = await response.json();

      // Formater les données pour Chart.js (x, y)
      const chartData = apiData.map(record => ({
        x: record.timestamp,
        y: record.count
      }));      
      const maxViewers = chartData.length > 0 
        ? Math.max(...chartData.map(d => d.y)) 
        : 0;
      
      // 2. Définir le haut de l'axe Y (au moins 5, ou max + 1)
      //    (J'ai mis un minimum de 5 pour que le graphique ne soit pas 
      //    tout plat s'il n'y a que 0 ou 1 spectateur)
      const yAxisMax = Math.max(5, Math.ceil(maxViewers) + 1);

      // Créer le graphique
      createChart(chartData,yAxisMax);
      
    } catch (err) {
      console.error(err);
      // Afficher une erreur dans le canvas ? (Optionnel)
    }
  }

  /**
   * Crée et configure l'instance de Chart.js
   */
  function createChart(data: {x: number, y: number}[],yAxisMax:number) {
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;
    
    // Dégradé violet pour le remplissage
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)'); // Violet (de 'purple-500' de Tailwind)
    gradient.addColorStop(1, 'rgba(41, 0, 51, 0.0)'); // Transparent

    // Définir la plage de 24h
    const now = Date.now();
    const last24H = now - 24 * 60 * 60 * 1000;

    chart = new Chart(ctx, {
      type: 'line', // Graphique en ligne
      data: {
        datasets: [{
          label: 'Spectateurs',
          data: data,
          
          // --- STYLE DE LA COURBE ---
          fill: true, // Activer le remplissage de l'aire
          backgroundColor: gradient, // Remplissage violet
          borderColor: 'rgba(209, 160, 255, 1)', // Ligne violette plus claire
          borderWidth: 2,
          tension: 0.4, // Pour les "courbes arrondies"
          pointRadius: 0, // Cache les points de données
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Cacher la légende "Spectateurs"
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          // --- AXE X (Temps) ---
          x: {
            type: 'time',
            // Forcer l'affichage des 24 dernières heures
            min: last24H,
            max: now,
            
            // Masquer la grille
            grid: {
              display: false,
            },
            
            // Configurer les "ticks" (étiquettes)
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: "'Inter', sans-serif"
              },
              // Forcer l'affichage par heure
              major: {
                enabled: true,
              },
            },
            
            // Formater l'affichage : "14h", "15h"
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'H[h]' // Format Day.js pour "14h"
              },
              tooltipFormat: 'll HH:mm' // Format du tooltip (ex: 15 nov. 2025 14:05)
            }
          },
          
          // --- AXE Y (Spectateurs) ---
          y: {
            beginAtZero: true,
            max: yAxisMax,
            
            // Masquer la grille
            grid: {
              display: false,
            },
            
            // Configurer les "ticks" (étiquettes)
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
              font: {
                family: "'Inter', sans-serif"
              },
              // Optionnel: n'afficher que des entiers
              precision: 0,
            }
          }
        }
      }
    });
  }
</script>

<!-- 
  Le conteneur du graphique
  Il respecte votre style 'content-box'
-->
<div class="chart-container">
  <div class="chart-wrapper">
    <canvas bind:this={canvasElement}></canvas>
  </div>
</div>

<style>
  .chart-container {
    /* Style global (blanc transparent) */
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    margin: 2rem 0; /* Marge verticale, 0 horizontale */
    
    /* Définir une hauteur pour le graphique */
    height: 350px;
    width: 90%;
    
    /* Polices par défaut */
    font-family: 'Inter', sans-serif;
    color: white;
  }

  .chart-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>