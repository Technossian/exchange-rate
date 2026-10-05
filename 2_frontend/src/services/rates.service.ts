import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IApiResponse} from '../models/api.model';

@Injectable({
  providedIn: 'root',
})
export class RatesService {
  private http = inject(HttpClient);
  private apiUrl = '/api/v1/rates';

  getRates(targetCurrency?: string) {
    const url = targetCurrency ? `${this.apiUrl}?target=${targetCurrency}` : this.apiUrl;
    return this.http.get<IApiResponse>(url);
  }
}
