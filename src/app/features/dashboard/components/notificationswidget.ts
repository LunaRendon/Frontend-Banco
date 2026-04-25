import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificationswidget.html'
})
export class NotificationsWidget {
  notificaciones = [
    'Nuevo cliente registrado',
    'Cuenta creada correctamente',
    'Actualización de datos realizada'
  ];
}