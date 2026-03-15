import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { PackageSummary } from '../../interfaces/package-summary.interface';

@Component({
  selector: 'app-single-package-card',
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './single-package-card.component.html',
  styleUrl: './single-package-card.component.css',
})
export class SinglePackageCard {
  @Input() pkg!: PackageSummary;
  @Input() isHovered = false;
  @Input() isDependency = false;
  @Output() hoverStart = new EventEmitter<void>();
  @Output() hoverEnd = new EventEmitter<void>();

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