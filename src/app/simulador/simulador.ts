import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulador.html',
  styleUrls: ['./simulador.css'],
})
export class SimuladorComponent implements AfterViewInit {
  VT = 1000;   // mL de aceite (Triglicéridos)
  VM = 200;    // mL de metanol
  k_app = 0.1; // constante de velocidad aparente (1/h)
  tiempoTotal = 24;
  dt = 0.5;

  grafica: Chart | null = null;
  ecuacionSeleccionada: 'T' | 'E' | 'G' = 'T'; // pestaña activa
  mostrarDesarrollo = false; // 👈 nuevo estado para mostrar/ocultar ecuación

  ngAfterViewInit() {
    this.generarGrafica();
  }

  generarGrafica() {
    const tiempos: number[] = [];
    const aceite: number[] = [];
    const ester: number[] = [];
    const glicerina: number[] = [];

    const T0 = this.VT / 1000; // convertir mL a L

    for (let t = 0; t <= this.tiempoTotal; t += this.dt) {
      const T = T0 * Math.exp(-this.k_app * t); // Aceite
      const E = 3 * T0 * (1 - Math.exp(-this.k_app * t)); // Biodiésel
      const G = T0 * (1 - Math.exp(-this.k_app * t)); // Glicerina

      tiempos.push(t);
      aceite.push(T * 1000);
      ester.push(E * 1000);
      glicerina.push(G * 1000);
    }

    // Si la gráfica ya existe, actualiza sus datos
    if (this.grafica) {
      this.grafica.data.labels = tiempos;
      this.grafica.data.datasets[0].data = aceite;
      this.grafica.data.datasets[1].data = ester;
      this.grafica.data.datasets[2].data = glicerina;
      this.grafica.update();
      return;
    }

    // Crear la gráfica inicial
    this.grafica = new Chart('graficaComponentes', {
      type: 'line',
      data: {
        labels: tiempos,
        datasets: [
          {
            label: '[T](t) Aceite (Triglicéridos)',
            data: aceite,
            borderColor: '#ff6384',
            borderWidth: 2,
            fill: false,
          },
          {
            label: '[E](t) Éster Metílico (Biodiésel)',
            data: ester,
            borderColor: '#36a2eb',
            borderWidth: 2,
            fill: false,
          },
          {
            label: '[G](t) Glicerina',
            data: glicerina,
            borderColor: '#4bc0c0',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Evolución de los Componentes del Biocombustible (mL)',
          },
        },
        scales: {
          x: { title: { display: true, text: 'Tiempo (h)' } },
          y: { title: { display: true, text: 'Volumen (mL)' }, beginAtZero: true },
        },
      },
    });
  }

  seleccionarEcuacion(tipo: 'T' | 'E' | 'G') {
    this.ecuacionSeleccionada = tipo;
    this.mostrarDesarrollo = false; // 👈 se oculta al cambiar ecuación
  }

  
  mostrarT = false;
  mostrarE = false;
  mostrarG = false;

  toggleDesarrollo(tipo: 'T' | 'E' | 'G') {
    if (tipo === 'T') this.mostrarT = !this.mostrarT;
    if (tipo === 'E') this.mostrarE = !this.mostrarE;
    if (tipo === 'G') this.mostrarG = !this.mostrarG;
  }



}


