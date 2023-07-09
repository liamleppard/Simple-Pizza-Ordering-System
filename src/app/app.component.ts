import { Component, ChangeDetectionStrategy } from '@angular/core';

export interface Offer {
  title: string;
  description: string;
  price: number | string;
  disabled?: boolean;
}

export interface Topping {
  toppings?: string;
  small?: number | string;
  medium?: number | string;
  large?: number | string;
  extraLarge?: number | string;
  bold?: boolean;
}

let ELEMENT_DATA: Topping[] = [
  { small: 'Small ($5)', medium: 'Medium ($7)', large: 'Large ($8)', extraLarge: 'Extra Large ($9)' },
  { toppings: 'Vegetable Options', bold: true },
  { toppings: 'Tomatoes', small: 1, medium: 1, large: 1, extraLarge: 1 },
  { toppings: 'Onions', small: 0.50, medium: 0.50, large: 0.50, extraLarge: 0.50 },
  { toppings: 'Bell Peppers', small: 1, medium: 1, large: 1, extraLarge: 1 },
  { toppings: 'Mushrooms', small: 1.20, medium: 1.20, large: 1.20, extraLarge: 1.20 },
  { toppings: 'Pineapple', small: 3, medium: 3, large: 3, extraLarge: 3 },
  { toppings: 'Non Vegetable Options', bold: true },
  { toppings: 'Sausage', small: 1, medium: 1, large: 1, extraLarge: 1 },
  { toppings: 'Pepperoni', small: 2, medium: 2, large: 2, extraLarge: 2 },
  { toppings: 'Barbecue Chicken', small: 3, medium: 3, large: 3, extraLarge: 3 },
  {},
  { toppings: 'Total', bold: true },
  { toppings: 'Offer' },
  { large: 'Value' },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  displayedColumns: string[] = ['toppings', 'small', 'medium', 'large', 'extraLarge'];
  dataSource = ELEMENT_DATA;
  selectedCells = new Set<string>();
  selectedOffer = '';
  offers: Offer[] = [
    { title: 'Offer 1', description: '1 medium pizza with 2 toppings', price: '$5' },
    { title: ' ̶O̶f̶f̶e̶r̶ ̶2̶', description: ' ̶2̶ ̶m̶e̶d̶i̶u̶m̶ ̶p̶i̶z̶z̶a̶s̶ ̶w̶i̶t̶h̶ ̶4̶ ̶t̶o̶p̶p̶i̶n̶g̶s̶ ̶e̶a̶c̶h̶ Disabled due to inconsistency with design(no way of purchasing multiple of the same pizza size)', price: '$̶9̶', disabled: true },
    { title: 'Offer 3', description: '1 large pizza with 4 toppings (pepperoni and barbecue chicken count as 2 toppings) for 50% off', price: '50% off' }
  ];

  clickedTopping(toppingName: string, size: string, price: number): void {
    if (!toppingName || !size || !price || toppingName === 'Offer') {
      return;
    }
    if (this.isSelected(toppingName, size, price)) {
      this.selectedCells.delete(JSON.stringify({ toppingName, size, price }));
    } else {
      this.selectedCells.add(JSON.stringify({ toppingName, size, price }));
    }
  }

  calculateTotal(): number {
    let total = 0;
    let initialPizzaCosts = 0;
    let newCost = 0;
    let selectedPizzas = new Set<string>();

    for (let selectedCell of this.selectedCells) {
      if (JSON.parse(selectedCell).size === 'small') {
        selectedPizzas.add('small');
      }
      if (JSON.parse(selectedCell).size === 'medium') {
        selectedPizzas.add('medium');
      }
      if (JSON.parse(selectedCell).size === 'large') {
        selectedPizzas.add('large');
      }
      if (JSON.parse(selectedCell).size === 'extraLarge') {
        selectedPizzas.add('extraLarge');
      }
      total += +JSON.parse(selectedCell).price
    }

    for (let selectedPizza of selectedPizzas) {
      if (selectedPizza === 'small') {
        initialPizzaCosts += 5;
      }
      if (selectedPizza === 'medium') {
        initialPizzaCosts += 7;
      }
      if (selectedPizza === 'large') {
        initialPizzaCosts += 8;
      }
      if (selectedPizza === 'extraLarge') {
        initialPizzaCosts += 9;
      }
    }

    newCost = this.onSaleOffer1(this.selectedCells, selectedPizzas) || this.onSaleOffer3(this.selectedCells, selectedPizzas);
    ELEMENT_DATA[ELEMENT_DATA.length - 1].large = newCost ? newCost : total + initialPizzaCosts;
    if (newCost) {
      ELEMENT_DATA[ELEMENT_DATA.length - 1].extraLarge = total + initialPizzaCosts;
      ELEMENT_DATA[ELEMENT_DATA.length - 2].extraLarge = 'Old Price';
    } else {
      ELEMENT_DATA[ELEMENT_DATA.length - 1].extraLarge = '';
      ELEMENT_DATA[ELEMENT_DATA.length - 2].extraLarge = '';
    }

    return newCost ? newCost : total + initialPizzaCosts;
  }

  onSaleOffer1(selectedCells: Set<string>, selectedPizzas: Set<string>): number {
    if (selectedPizzas.has('medium') && selectedCells.size === 2) {
      const selected = selectedCells.values();
      if (JSON.parse(selected.next().value).size === 'medium' && JSON.parse(selected.next().value).size === 'medium') {
        ELEMENT_DATA[ELEMENT_DATA.length - 2].large = 'Offer 1';
        return 5;
      }
    }
    ELEMENT_DATA[ELEMENT_DATA.length - 2].large = '';
    return 0;
  }

  onSaleOffer3(selectedCells: Set<string>, selectedPizzas: Set<string>): number {
    let selectedCellsSize = selectedCells.size;
    if (selectedPizzas.has('large')) {
      let totalCost = 8;
      for (let selectedCell of selectedCells) {
        if (JSON.parse(selectedCell).size != 'large') {
          return 0;
        } else {
          if (JSON.parse(selectedCell).toppingName === 'Barbecue Chicken' || JSON.parse(selectedCell).toppingName === 'Pepperoni') {
            selectedCellsSize += 1;
          }
          totalCost += +JSON.parse(selectedCell).price;
        }
      }
      if (selectedCellsSize === 4) {
        ELEMENT_DATA[ELEMENT_DATA.length - 2].large = 'Offer 3';
        return totalCost / 2;
      }
    }
    ELEMENT_DATA[ELEMENT_DATA.length - 2].large = '';
    return 0;
  }

  isSelected(toppingName: string, size: string, price: number): boolean {
    return this.selectedCells.has(JSON.stringify({ toppingName, size, price }));
  }

  order(): void {
    alert(`Order sent! Total cost is ${ELEMENT_DATA[ELEMENT_DATA.length - 1].large}!`);
  }

  isDisabled(): boolean {
    if (ELEMENT_DATA[ELEMENT_DATA.length - 1].large) {
      return false;
    };
    return true;
  }
}