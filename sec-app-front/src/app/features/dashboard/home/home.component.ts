import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { CommunicationService } from '../../../core/services/communication.service';
import { InternalNotice, ShiftIncident } from '../../../core/models/communication.model';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, BaseChartDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private commsService = inject(CommunicationService);

  fechaActual = new Date();
  currentUser = this.authService.currentUser;
  currentShift = signal<string>('Cargando...');

  // --- Listas para el muro de comunicación (Pinned and Capped to top 3) ---
  allNotices = signal<InternalNotice[]>([]);
  allIncidents = signal<ShiftIncident[]>([]);

  recentNotices = computed(() => {
    return [...this.allNotices()]
      .sort((a, b) => {
        if (a.isUrgent === b.isUrgent) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.isUrgent ? -1 : 1;
      })
      .slice(0, 3);
  });

  recentIncidents = computed(() => {
    return [...this.allIncidents()]
      .sort((a, b) => {
        const sevOrder: any = { 'High': 0, 'Medium': 1, 'Low': 2 };
        const orderA = sevOrder[a.severity] ?? 3;
        const orderB = sevOrder[b.severity] ?? 3;

        if (orderA === orderB) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return orderA - orderB;
      })
      .slice(0, 3);
  });

  // --- Gráfico de Cobertura (Doughnut) ---
  public coverageChartData: ChartData<'doughnut'> = {
    labels: ['Cubiertos', 'Pendientes'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#1a4f8b', '#e9ecef'],
      hoverBackgroundColor: ['#133a66', '#dee2e6'],
      borderWidth: 0
    }]
  };
  public coverageChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      datalabels: { display: false }
    }
  };

  // --- Gráfico de Rangos (Pie) ---
  public ranksChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#1a4f8b', '#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#ffc107', '#198754', '#20c997', '#0dcaf0'] }]
  };
  public ranksChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, font: { size: 11 } } },
      datalabels: { display: false }
    }
  };

  // --- Gráfico de Disponibilidad (Bar) ---
  public availabilityChartData: ChartData<'bar'> = {
    labels: ['Estado del Personal'],
    datasets: [
      { data: [0], label: 'En Servicio', backgroundColor: '#1a4f8b', borderRadius: 6 },
      { data: [0], label: 'En Reserva', backgroundColor: '#198754', borderRadius: 6 },
      { data: [0], label: 'Total', backgroundColor: '#6c757d', borderRadius: 6 }
    ]
  };
  public availabilityChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 30 } },
    scales: {
      y: { beginAtZero: true, grid: { display: false }, ticks: { display: true } },
      x: { grid: { display: false } }
    },
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true } },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'top',
        formatter: (value) => value,
        font: { weight: 'bold', size: 12 },
        color: '#1a4f8b',
        clip: false
      },
      tooltip: {
        callbacks: { label: (context) => ` ${context.dataset.label}: ${context.raw}` }
      }
    }
  };

  totalAgents = signal<number>(0);
  coveredPercentage = signal<number>(0);

  ngOnInit(): void {
    this.determineShift();
    this.loadDashboardData();
    this.loadCommunications();
  }

  private loadDashboardData() {
    this.dashboardService.getCoverageStats().subscribe(stats => {
      this.totalAgents.set(stats.totalAgents);
      const pending = stats.totalPosts - stats.coveredPosts;
      this.coverageChartData.datasets[0].data = [stats.coveredPosts, pending > 0 ? pending : 0];
      this.coveredPercentage.set(stats.totalPosts > 0 ? Math.round((stats.coveredPosts / stats.totalPosts) * 100) : 0);

      const onDuty = stats.activeAgents;
      const reserve = stats.totalAgents - onDuty;
      this.availabilityChartData.datasets[0].data = [onDuty];
      this.availabilityChartData.datasets[1].data = [reserve];
      this.availabilityChartData.datasets[2].data = [stats.totalAgents];

      this.coverageChartData = { ...this.coverageChartData };
      this.availabilityChartData = { ...this.availabilityChartData };
    });

    this.dashboardService.getRankDistribution().subscribe(data => {
      this.ranksChartData.labels = data.map(r => r.rankName);
      this.ranksChartData.datasets[0].data = data.map(r => r.count);
      this.ranksChartData = { ...this.ranksChartData };
    });
  }

  private loadCommunications() {
    this.commsService.getActiveNotices().subscribe(data => this.allNotices.set(data));
    this.commsService.getRecentIncidents().subscribe(data => this.allIncidents.set(data));
  }

  private determineShift() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) this.currentShift.set('Mañana');
    else if (hour >= 14 && hour < 22) this.currentShift.set('Tarde');
    else this.currentShift.set('Noche');
  }
}
