import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SinglePackage } from '../../interfaces/single-package';

@Component({
  selector: 'app-single-package-card',
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './single-package-card.component.html',
  styleUrl: './single-package-card.component.css',
})
export class SinglePackageCard {
  @Input() pkg!: SinglePackage;
  get scope() {
    return this.pkg.id.includes('/') ? this.pkg.id.split('/')[0] : null;
  }

  get name() {
    return this.pkg.id.includes('/') ? this.pkg.id.split('/')[1] : this.pkg.id;
  }

  get formattedDownloads() {
    const n = this.pkg.weeklyDownloads;
    return n >= 1000 ? Math.floor(n / 1000) + 'K' : n.toString();
  }
}