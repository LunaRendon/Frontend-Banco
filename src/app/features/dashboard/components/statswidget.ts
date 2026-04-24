import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BancoService } from 'src/app/core/services/Banco.service';
import { PaginationParams } from 'src/app/core/models/api-response.models';
import { ClienteService } from '@/core/services/Cliente.service';

@Component({
  standalone: true,
  selector: 'app-stats-widget',
  imports: [CommonModule],
  templateUrl: './statswidget.html',
})

export class StatsWidget implements OnInit {
  BancoActivos = 0;
  ClientesActivos=0;

  pagination: PaginationParams = {
    page: 1,
    limit: 9999
  };

  constructor(
    private bancoService: BancoService,
    private clienteService: ClienteService

  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {

    this.bancoService.getBancos(this.pagination).subscribe((res: any[]) => {
      this.BancoActivos = res.length;
    });
    this.clienteService.getClientes( this.pagination).subscribe((res: any[]) => {
      this.ClientesActivos = res.length;
    });
  }
}
