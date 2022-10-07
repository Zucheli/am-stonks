import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.less'],
})
export class BannerComponent implements OnInit {
  @Input() bigBanner: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
