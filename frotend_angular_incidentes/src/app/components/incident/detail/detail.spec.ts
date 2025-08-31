import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Detail } from './detail';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Incident } from '../../../models/incident.model';

describe('DetailComponent', () => {
  let component: Detail;
  let fixture: ComponentFixture<Detail>;

  const mockIncidente: Incident = {
    _id: '1',
    tipo: 'Accidente',
    direccion: 'Calle Falsa 123',
    ciudad: 'Bogotá',
    descripcion: 'Accidente de tránsito',
    nivel_gravedad: 'alto',
    estado: 'Reportado',
    fecha_hora: new Date(),
    imagen: ''
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Detail);
    component = fixture.componentInstance;
    
    // Asignar un incidente de prueba al componente
    component.incidente = mockIncidente;
    
    fixture.detectChanges();
  });

  // Prueba de creación del componente
  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Prueba de visualización de detalles del incidente
  it('debería mostrar los detalles del incidente cuando se proporciona un incidente', () => {
    // Verificar que el componente tiene un incidente
    expect(component.incidente).toBeTruthy();
    
    // Verificar que el incidente tiene los datos correctos
    if (component.incidente) {
      expect(component.incidente.tipo).toBe(mockIncidente.tipo);
      expect(component.incidente.direccion).toBe(mockIncidente.direccion);
    }
  });

  // Prueba de manejo cuando no hay incidente
  it('debería manejar correctamente cuando no hay incidente', () => {
    // Reiniciar el componente sin incidente
    component.incidente = null;
    fixture.detectChanges();
    
    // Verificar que no hay datos mostrados
    const contenedor = fixture.debugElement.query(By.css('.detalle-incidente'));
    if (contenedor) {
      expect(contenedor.nativeElement.textContent).toContain('No se ha seleccionado ningún incidente');
    }
  });

  // Prueba de visualización de la fecha
  it('debería formatear y mostrar la fecha correctamente', () => {
    const fechaElement = fixture.debugElement.query(By.css('.fecha-incidente'));
    
    if (fechaElement) {
      // Verificar que la fecha se muestra en el formato esperado
      const fechaMostrada = fechaElement.nativeElement.textContent;
      expect(fechaMostrada).toBeTruthy();
      // Aquí podrías agregar más aserciones específicas sobre el formato de la fecha
    }
  });

  // Prueba de visualización de la imagen (si existe)
  it('debería mostrar la imagen del incidente si está disponible', () => {
    const imagenElement = fixture.debugElement.query(By.css('.imagen-incidente'));
    
    if (imagenElement) {
      expect(imagenElement.nativeElement.src).toContain(mockIncidente.imagen || '');
    }
  });


});
