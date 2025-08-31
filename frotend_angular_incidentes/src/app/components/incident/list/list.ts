// src/app/components/incident/list/list.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/envimonmet';
import { Incident } from '../../../models/incident.model';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class ListComponent implements OnInit, AfterViewInit {
  @ViewChild('editModal', { static: false }) editModal!: ElementRef<HTMLElement>;
  @ViewChild('detailModal') detailModal!: ElementRef;
 
  
  loading = false;
  error: string = '';
  incidentes: Incident[] = [];
  incidentesFiltrados: Incident[] = [];
  filtro = '';
  tipoFiltro = '';
  editForm: FormGroup;
  currentIncidente: Incident | null = null;
  currentDetailIncidente: Incident | null = null;

  private modal: any;
  private detailModalInstance: any;
  private http = inject(HttpClient);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  // Solo un formulario para crear/editar
  incidentForm = this.formBuilder.group({
    tipo: ['', Validators.required],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    ciudad: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    nivel_gravedad: ['medio', Validators.required],
    imagen: ['']
  });

  constructor() {
    this.editForm = this.formBuilder.group({
      tipo: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      ciudad: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      nivel_gravedad: ['', Validators.required],
      estado: ['', Validators.required],
      imagen: ['']
    });
  }

  ngOnInit() {
    this.cargarIncidentes();
  }

  ngAfterViewInit() {
    if (this.editModal && this.editModal.nativeElement) {
      this.modal = new bootstrap.Modal(this.editModal.nativeElement);
    }
    
    if (this.detailModal && this.detailModal.nativeElement) {
      this.detailModalInstance = new bootstrap.Modal(this.detailModal.nativeElement);
    }
  }

  cargarIncidentes() {
    this.loading = true;
    this.http.get<Incident[]>(`${environment.apiUrl}/api/incidentes`)
      .subscribe({
        next: (incidentes) => {
          this.incidentes = incidentes;
          this.incidentesFiltrados = [...incidentes];
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar los incidentes';
          this.loading = false;
        }
      });
  }

  aplicarFiltros() {
    if (!this.incidentes) return;
  
    this.incidentesFiltrados = this.incidentes.filter(incidente => {
      const matchesTipo = !this.tipoFiltro || incidente.tipo === this.tipoFiltro;
      const matchesTexto = !this.filtro || 
        incidente.direccion?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        incidente.descripcion?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        incidente.ciudad?.toLowerCase().includes(this.filtro.toLowerCase());
      
      return matchesTipo && matchesTexto;
    });
  }

  getGravedadClass(gravedad?: string): string {
    if (!gravedad) return '';
    
    switch (gravedad.toLowerCase()) {
      case 'alto':
        return 'gravedad-alto';
      case 'medio':
        return 'gravedad-medio';
      case 'bajo':
        return 'gravedad-bajo';
      default:
        return '';
    }
  }
  verDetalles(incidente: Incident) {
    if (!this.detailModalInstance) {
      console.error('Modal de detalles no inicializado');
      return;
    }

    this.currentDetailIncidente = incidente;
    
    try {
      this.detailModalInstance.show();
    } catch (error) {
      console.error('Error al mostrar modal:', error);
    }
  }

    // Método para abrir el modal de creación
  abrirModalNuevo() {
    // Resetear el formulario
    this.incidentForm.reset({
      tipo: '',
      direccion: '',
      ciudad: '',
      descripcion: '',
      nivel_gravedad: 'medio',
      imagen: ''
    });
    // Limpiar el incidente actual
    this.currentIncidente = null;
    // Mostrar modal
    this.modal?.show();
  }

  crearIncidente() {
    if (this.incidentForm.valid) {
      const nuevoIncidente: Incident = {
        tipo: this.incidentForm.value.tipo || '',
        direccion: this.incidentForm.value.direccion || '',
        ciudad: this.incidentForm.value.ciudad || '',
        descripcion: this.incidentForm.value.descripcion || '',
        nivel_gravedad: this.incidentForm.value.nivel_gravedad || 'medio',
        imagen: this.incidentForm.value.imagen ?? '',
        estado: 'activo'
      };

      this.http.post<Incident>(`${environment.apiUrl}/api/incidentes`, nuevoIncidente)
        .subscribe({
          next: (response) => {
            this.incidentes = [...this.incidentes, response];
            this.incidentesFiltrados = [...this.incidentesFiltrados, response];
            this.aplicarFiltros();
            
            this.incidentForm.reset({
              tipo: '',
              direccion: '',
              ciudad: '',
              descripcion: '',
              nivel_gravedad: 'medio',
              imagen: ''
            });
            
            this.modal?.hide();
            alert('Incidente creado exitosamente');
          },
          error: (error) => {
            console.error('Error al crear el incidente:', error);
            alert('Error al crear el incidente. Por favor, inténtelo de nuevo.');
          }
        });
    } else {
      alert('Por favor, complete todos los campos obligatorios');
    }
  }
  
  editarIncidente(incidente: Incident) {
    // Guardar el incidente actual
    this.currentIncidente = { ...incidente };
    // Poblar el formulario con los datos del incidente
    this.incidentForm.patchValue({
      tipo: incidente.tipo || '',
      direccion: incidente.direccion || '',
      ciudad: incidente.ciudad || '',
      descripcion: incidente.descripcion || '',
      nivel_gravedad: incidente.nivel_gravedad || 'medio',
      imagen: incidente.imagen ?? ''
    });
    // Mostrar modal
    this.modal?.show();
  }

  onSubmit() {
    if (this.incidentForm.valid) {
      const incidenteData = {
        tipo: this.incidentForm.value.tipo || '',
        direccion: this.incidentForm.value.direccion || '',
        ciudad: this.incidentForm.value.ciudad || '',
        descripcion: this.incidentForm.value.descripcion || '',
        nivel_gravedad: this.incidentForm.value.nivel_gravedad || 'medio',
        imagen: this.incidentForm.value.imagen ?? '',
        estado: 'activo'
      };

      if (this.currentIncidente) {
        // Edición
        this.http.put<Incident>(
          `${environment.apiUrl}/api/incidentes/${this.currentIncidente._id}`,
          incidenteData
        ).subscribe({
          next: () => {
            const index = this.incidentes.findIndex(i => i?._id === this.currentIncidente?._id);
            if (index !== -1) {
              this.incidentes[index] = { ...this.currentIncidente, ...incidenteData };
              this.incidentesFiltrados[index] = { ...this.currentIncidente, ...incidenteData };
              this.aplicarFiltros();
            }
            Swal.fire({
              title: 'Éxito',
              text: 'Incidente actualizado correctamente',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.onModalClose();
          },
          error: (error) => {
            console.error('Error al actualizar:', error);
            Swal.fire({
              title: 'Error',
              text: 'Error al actualizar el incidente',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      } else {
        // Creación
        this.http.post<Incident>(
          `${environment.apiUrl}/api/incidentes`,
          incidenteData
        ).subscribe({
          next: (response) => {
            this.incidentes = [...this.incidentes, response];
            this.incidentesFiltrados = [...this.incidentesFiltrados, response];
            this.aplicarFiltros();
            Swal.fire({
              title: 'Éxito',
              text: 'Incidente creado exitosamente',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.onModalClose();
          },
          error: (error) => {
            console.error('Error al crear:', error);
            Swal.fire({
              title: 'Error',
              text: 'Error al crear el incidente',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos obligatorios',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  onModalClose() {
    // Resetear el formulario
    this.incidentForm.reset();
    // Limpiar el incidente actual
    this.currentIncidente = null;
    this.currentDetailIncidente = null;
    // Ocultar modal
    this.modal?.hide();
    this.detailModalInstance?.hide();
  }

  eliminarIncidente(incidente: Incident) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete<void>(`${environment.apiUrl}/api/incidentes/${incidente._id}`)
          .subscribe({
            next: () => {
              this.incidentes = this.incidentes.filter(i => i?._id !== incidente._id);
              this.aplicarFiltros();
              Swal.fire({
                title: 'Éxito',
                text: 'Incidente eliminado correctamente',
                icon: 'success',
                confirmButtonText: 'OK'
              });
            },
            error: (error) => {
              console.error('Error al eliminar:', error);
              Swal.fire({
                title: 'Error',
                text: 'Error al eliminar el incidente',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
      }
    });
  }
  
}
