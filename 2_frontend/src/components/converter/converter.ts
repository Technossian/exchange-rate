import {Component, inject, OnInit} from '@angular/core';
import {StoreService} from '../../services/store.service';
import {CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-converter',
  imports: [
    DecimalPipe,
    DatePipe,
    CurrencyPipe,
    FormsModule
  ],
  templateUrl: './converter.html',
  styleUrl: './converter.scss',
})
export class Converter implements OnInit {
  // Внедряем наше хранилище сигналов
  protected store = inject(StoreService);

  ngOnInit(): void {
    this.store.loadRates();
  }

  onRubInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    this.store.rubAmount.set(isNaN(value) ? null : value);
  }

  onCurrencyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.store.selectedCurrencyCode.set(select.value);
  }


  // 3. Создаем удобные связки для формы [(ngModel)]
  get rubValue(): number | null {
    return this.store.rubAmount();
  }
  set rubValue(val: number | null) {
    this.store.rubAmount.set(val === null || isNaN(val) ? null : val);
  }

  get currencyValue(): string {
    return this.store.selectedCurrencyCode();
  }
  set currencyValue(val: string) {
    this.store.selectedCurrencyCode.set(val);
    this.store.loadRates();
  }
}
