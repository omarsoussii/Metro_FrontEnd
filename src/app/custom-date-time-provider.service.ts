import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CustomDateTimeProviderService  {
  now(): number {
    return Date.now();
  }
}