import {computed, inject, Injectable, signal} from '@angular/core';
import {RatesService} from './rates.service';
import {IRate} from '../models/rates.model';
import {IHistoryLog} from '../models/history.model';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private rateService = inject(RatesService);

  // Основные сигналы состояния
  rates = signal<IRate[]>([]);
  history = signal<IHistoryLog[]>([]);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  rubAmount = signal<number | null>(null);
  selectedCurrencyCode = signal<string>('USD');

  // Вычисляемые (computed) сигналы
  selectedCurrency = computed(() =>
    this.rates().find(r => r.code === this.selectedCurrencyCode()) || null
  );

  // Главный расчет: автоматическая конвертация
  convertedAmount = computed(() => {
    const rub = this.rubAmount();
    const currency = this.selectedCurrency();

    if (!rub || !currency) return 0;

    // Формула: (Рубли / Стоимость валюты за номинал) * Номинал
    return (rub / currency.value) * currency.nominal;
  });

  // Загрузка данных
  loadRates(): void {
    this.loading.set(true);
    this.rateService.getRates().subscribe({

      next: (response) => {
        if (response.success) {
          this.rates.set(response.rates);
          this.history.set(response.history);
          this.error.set(null);
        }
      },

      error: (err) => {
        console.error(err);
        this.error.set('Не удалось загрузить курсы валют. Проверьте бэкенд.');
      },
      complete: () => this.loading.set(false)
    });
  }
}
