import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-accounts',
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class AccountsComponent implements OnInit{
  accounts: any;
  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.http.get("/gateway/ACCOUNT-SERVICE/accounts")
      .subscribe({
        next : data => {
          this.accounts = data;
        },
        error : err => {
          console.log(err);
        }
      })
  }

}

