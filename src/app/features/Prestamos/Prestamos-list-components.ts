import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { PrestamoService } from 'src/app/core/services/Prestamos.service';
import { Prestamo, CreatePrestamoRequest, UpdatePrestamoRequest } from 'src/app/shared/models/Prestamos.model';

@Component({
    selector: 'app-prestamos-crud',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        RippleModule,
        DialogModule,
        InputTextModule,
        ConfirmDialogModule,
        ToastModule,
        IconFieldModule,
        InputIconModule,
        CheckboxModule
    ],
    templateUrl: './Prestamos-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class PrestamosListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    prestamos: Prestamo[] = [];
    selectedPrestamos: Prestamo[] = [];

    prestamo: Prestamo = {
        id_prestamo: '',
        monto: 0,
        interes: 0,
        cuotas: 0,
        estado: 'Activo',
        fecha_inicio: '',
        fecha_fin: '',
        id_cliente: '',
        id_cuenta: '',
        fecha_creacion: ''
    };

    prestamoDialog: boolean = false;
    submitted: boolean = false;
    loading: boolean = false;

    constructor(
        private prestamoService: PrestamoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.loadPrestamos();
    }

    loadPrestamos() {
        this.loading = true;

        this.prestamoService.getPrestamos({ page: 1, limit: 10 }, {}).subscribe({
            next: (data) => {
                this.prestamos = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onGlobalFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.prestamo = {
            id_prestamo: '',
            monto: 0,
            interes: 0,
            cuotas: 0,
            estado: 'Activo',
            fecha_inicio: '',
            fecha_fin: '',
            id_cliente: '',
            id_cuenta: '',
            fecha_creacion: ''
        };

        this.submitted = false;
        this.prestamoDialog = true;
    }

    editPrestamo(prestamo: Prestamo) {
        this.prestamo = { ...prestamo };
        this.prestamoDialog = true;
    }

    deletePrestamo(prestamo: Prestamo) {
        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar el préstamo?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {
                this.prestamoService.deletePrestamo(prestamo.id_prestamo).subscribe({
                    next: () => {
                        this.prestamos = this.prestamos.filter(
                            (p) => p.id_prestamo !== prestamo.id_prestamo
                        );

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Préstamo eliminado correctamente'
                        });
                    }
                });
            }
        });
    }

    hideDialog() {
        this.prestamoDialog = false;
        this.submitted = false;
    }

    savePrestamo() {
        this.submitted = true;

        if (!this.prestamo.monto) return;

        if (this.prestamo.id_prestamo) {
            const updateReq: UpdatePrestamoRequest = {
                monto: this.prestamo.monto,
                interes: this.prestamo.interes,
                cuotas: this.prestamo.cuotas,
                estado: this.prestamo.estado,
                fecha_inicio: this.prestamo.fecha_inicio,
                fecha_fin: this.prestamo.fecha_fin
            };

            this.prestamoService
                .updatePrestamo(this.prestamo.id_prestamo, updateReq)
                .subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Actualizado',
                            detail: 'Préstamo actualizado correctamente'
                        });

                        this.loadPrestamos();
                        this.prestamoDialog = false;
                    }
                });
        } else {
            const createReq: CreatePrestamoRequest = {
                monto: this.prestamo.monto,
                interes: this.prestamo.interes,
                cuotas: this.prestamo.cuotas,
                estado: this.prestamo.estado,
                fecha_inicio: this.prestamo.fecha_inicio,
                fecha_fin: this.prestamo.fecha_fin,
                id_cliente: this.prestamo.id_cliente,
                id_cuenta: this.prestamo.id_cuenta
            };

            this.prestamoService.createPrestamo(createReq).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Creado',
                        detail: 'Préstamo creado correctamente'
                    });

                    this.loadPrestamos();
                    this.prestamoDialog = false;
                }
            });
        }
    }

    exportCSV() {
        this.dt.exportCSV();
    }
}