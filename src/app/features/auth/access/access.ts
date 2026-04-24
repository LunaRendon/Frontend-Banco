import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from 'src/app/shared/components/floating-configurator/floating-configurator';


@Component({
  selector: 'app-access',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, AppFloatingConfigurator],
  templateUrl: './access.html'
})
export class Access {
  constructor(private router: Router) {}

  volver(): void {
    this.router.navigate(['/dashboard']);
  }
}
