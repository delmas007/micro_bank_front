import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-customers',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class CustomersComponent implements OnInit{

  customers : any;
  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.http.get("/gateway/CUSTOMER-SERVICE/customers")
      .subscribe({
        next : data => {
          console.log(data)
          this.customers = data;
        },
        error : err => {
          console.log(err);
        }
      })
  }

}
