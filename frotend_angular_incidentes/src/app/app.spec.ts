import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from './app';
import { NavbarComponent } from './components/shared/navbar/navbar';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';

describe('AppComponent', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterTestingModule,
        NavbarComponent
      ],
      providers: [
        provideHttpClient(),
        provideZoneChangeDetection({ eventCoalescing: true })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('debería crear la aplicación correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería contener el componente navbar', () => {
    const navbar = compiled.querySelector('app-navbar');
    expect(navbar).toBeTruthy();
  });

  it('debería contener un router-outlet', () => {
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('debería tener la estructura principal correcta', () => {
    const mainContent = compiled.querySelector('.main-content');
    expect(mainContent).toBeTruthy();
    
    if (mainContent) {
      const routerOutlet = mainContent.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    }
  });
});
