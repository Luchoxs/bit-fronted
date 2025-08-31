import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Incident } from '../../../models/incident.model';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let httpMock: any;

  const mockIncidentes: Incident[] = [
    {
      _id: '1',
      tipo: 'Accidente',
      direccion: 'Calle Falsa 123',
      ciudad: 'Bogotá',
      descripcion: 'Accidente de tránsito',
      nivel_gravedad: 'alto',
      estado: 'Reportado',
      fecha_hora: new Date(),
      imagen: ''
    },
    {
      _id: '2',
      tipo: 'Desvío',
      direccion: 'Avenida Siempre Viva 456',
      ciudad: 'Medellín',
      descripcion: 'Desvío por obras',
      nivel_gravedad: 'medio',
      estado: 'En proceso',
      fecha_hora: new Date(),
      imagen: ''
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ListComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Prueba de creación del componente
  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Prueba de inicialización del formulario
  it('debería inicializar el formulario con valores por defecto', () => {
    expect(component.incidentForm.get('tipo')?.value).toBe('');
    expect(component.incidentForm.get('nivel_gravedad')?.value).toBe('medio');
  });

  // Prueba de validación de formulario
  it('debería marcar el formulario como inválido cuando está vacío', () => {
    expect(component.incidentForm.valid).toBeFalse();
    
    // Rellenar los campos requeridos
    component.incidentForm.patchValue({
      tipo: 'Accidente',
      direccion: 'Calle 123',
      ciudad: 'Bogotá',
      descripcion: 'Descripción del incidente',
      nivel_gravedad: 'medio'
    });
    
    expect(component.incidentForm.valid).toBeTrue();
  });

  // Prueba de clase de gravedad
  it('debería devolver la clase correcta según el nivel de gravedad', () => {
    expect(component.getGravedadClass('alto')).toBe('gravedad-alto');
    expect(component.getGravedadClass('medio')).toBe('gravedad-medio');
    expect(component.getGravedadClass('bajo')).toBe('gravedad-bajo');
  });

  // Prueba de filtrado de incidentes
  it('debería filtrar los incidentes por tipo', () => {
    component.incidentes = [...mockIncidentes];
    component.tipoFiltro = 'Accidente';
    
    component.aplicarFiltros();
    
    expect(component.incidentesFiltrados.length).toBe(1);
    expect(component.incidentesFiltrados[0].tipo).toBe('Accidente');
  });

  // Prueba de búsqueda de incidentes
  it('debería buscar incidentes por texto', () => {
    component.incidentes = [...mockIncidentes];
    component.filtro = 'Bogotá';
    
    component.aplicarFiltros();
    
    expect(component.incidentesFiltrados.length).toBe(1);
    expect(component.incidentesFiltrados[0].ciudad).toBe('Bogotá');
  });
});
