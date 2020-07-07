import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const config = require("../../assets/config.json");

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {
    console.log(config);
   }

  ngOnInit(): void { }

}
