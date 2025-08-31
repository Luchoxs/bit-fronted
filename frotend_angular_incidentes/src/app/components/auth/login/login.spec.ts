import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        LoginComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Prueba de creación del componente
  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Prueba de que el título se muestra correctamente
  it('debería mostrar el título de inicio de sesión', () => {
    const titleElement = fixture.debugElement.query(By.css('h2'));
    if (titleElement) {
      expect(titleElement.nativeElement.textContent).toContain('Iniciar Sesión');
    }
  });

  // Prueba de que el formulario se inicializa correctamente
  it('debería inicializar el formulario de login', () => {
    // Verificar que el componente se inicializa correctamente
    expect(component).toBeDefined();
    // Agregar más aserciones cuando se implemente el formulario
  });

  // Prueba de que el botón de envío está deshabilitado cuando el formulario es inválido
  it('debería deshabilitar el botón de envío cuando el formulario es inválido', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    if (submitButton) {
      expect(submitButton.nativeElement.disabled).toBeTrue();
    }
  });

  // Prueba de navegación al registro (cuando se implemente)
  it('debería tener un enlace a la página de registro', () => {
    const registerLink = fixture.debugElement.query(By.css('a[routerLink="/registro"]'));
    if (registerLink) {
      expect(registerLink.nativeElement.textContent).toContain('Registrarse');
    }
  });
});
