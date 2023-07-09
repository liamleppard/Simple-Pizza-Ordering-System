import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('calculateTotal', () => {
    it('should calculate the total correctly when no offers are applied', () => {
      component.selectedCells = new Set<string>([
        JSON.stringify({ toppingName: 'Tomatoes', size: 'small', price: 1 }),
        JSON.stringify({ toppingName: 'Onions', size: 'medium', price: 0.5 }),
      ]);
      const total = component.calculateTotal();
      expect(total).toEqual(1 + 0.5 + 5 + 7);
    });

    it('should apply Offer 1 correctly', () => {
      component.selectedCells = new Set<string>([
        JSON.stringify({ toppingName: 'Tomatoes', size: 'medium', price: 1 }),
        JSON.stringify({ toppingName: 'Onions', size: 'medium', price: 0.5 }),
      ]);
      const total = component.calculateTotal();
      expect(total).toEqual(5);
    });

    it('should apply Offer 3 correctly', () => {
      component.selectedCells = new Set<string>([
        JSON.stringify({ toppingName: 'Tomatoes', size: 'large', price: 1 }),
        JSON.stringify({ toppingName: 'Onions', size: 'large', price: 0.5 }),
        JSON.stringify({ toppingName: 'Pepperoni', size: 'large', price: 2 }),
      ]);
      const total = component.calculateTotal();
      expect(total).toEqual((8 + 1 + 0.5 + 2) / 2);
    });
  });

  describe('isSelected', () => {
    it('should return true if the cell is selected', () => {
      const selectedCell = JSON.stringify({ toppingName: 'Tomatoes', size: 'small', price: 1 });
      component.selectedCells = new Set<string>([selectedCell]);
      const isSelected = component.isSelected('Tomatoes', 'small', 1);
      expect(isSelected).toBe(true);
    });

    it('should return false if the cell is not selected', () => {
      const selectedCell = JSON.stringify({ toppingName: 'Tomatoes', size: 'small', price: 1 });
      component.selectedCells = new Set<string>([selectedCell]);
      const isSelected = component.isSelected('Onions', 'small', 1);
      expect(isSelected).toBe(false);
    });
  });
});