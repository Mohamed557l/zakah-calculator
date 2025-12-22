import { Component, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.component.html',
  styleUrls: ['./new-pass.component.css'],
  imports: [RouterLink]
})
export class NewPassComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
