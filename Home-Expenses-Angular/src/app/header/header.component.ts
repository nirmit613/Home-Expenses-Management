import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() sideNavToggle = new EventEmitter<boolean>();
  public menuButtonStatus: boolean = true;
  constructor() {}
  ngOnInit(): void {}

  public toggleSideNav() {
    this.menuButtonStatus = !this.menuButtonStatus;
    this.sideNavToggle.emit(this.menuButtonStatus);
  }
}
