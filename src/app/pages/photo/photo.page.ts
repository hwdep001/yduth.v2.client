import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {

  public photo: string;

  constructor(
    private router: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.photo = this.router.snapshot.paramMap.get('photo');
  }

  closePhoto(): void {
  }
}
