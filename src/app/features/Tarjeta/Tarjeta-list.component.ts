import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { AuthService } from 'src/app/core/services/auth.service';

import { TarjetaService } from 'src/app/core/services/Tarjeta.service';

import {
    Tarjeta,
    CreateTarjetaRequest,
    UpdateTarjetaRequest
} from 'src/app/shared/models/Tarjeta.model';

@Component({
    selector: 'app-tarjeta-crud',
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
        TagModule
    ],
    templateUrl: './Tarjeta-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class TarjetaListComponent implements OnInit {

    @ViewChild('dt') dt!: Table;

    tarjetas = signal<Tarjeta[]>([]);

    selectedTarjetas: Tarjeta[] = [];

    tarjeta!: any;

    tarjetaDialog: boolean = false;

    submitted: boolean = false;

    loading: boolean = false;

    constructor(
        private tarjetaService: TarjetaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public authService: AuthService
    ) {}

    ngOnInit() {
        this.loadTarjetas();
    }

    loadTarjetas() {
        this.loading = true;

        this.tarjetaService
            .getTarjetas({ page: 1, limit: 100 })
            .subscribe({
                next: (data: Tarjeta[]) => {

                    console.log('Tarjetas recibidas:', data);

                    this.tarjetas.set(data);

                    this.loading = false;
                },

                error: (err: any) => {

                    console.error('Error al cargar tarjetas:', err);

                    this.loading = false;

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudieron cargar las tarjetas'
                    });
                }
            });
    }

    onGlobalFilter(event: Event) {

        this.dt.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    openNew() {

        this.tarjeta = {
            id_tarjeta: '',
            id: '',
            numero_tarjeta: '',
            tipo_tarjeta: '',
            fecha_vencimiento: '',
            cvv: '',
            estado: true,
            id_cuenta: '',
            fecha_creacion: new Date().toISOString()
        };

        this.submitted = false;

        this.tarjetaDialog = true;
    }

    editTarjeta(tarjeta: Tarjeta) {

        this.tarjeta = {
            ...tarjeta,
            cvv: ''
        };

        this.tarjetaDialog = true;
    }

    deleteTarjeta(tarjeta: Tarjeta) {

        this.confirmationService.confirm({

            message: `¿Seguro que deseas eliminar la tarjeta "${tarjeta.numero_tarjeta}"?`,

            header: 'Confirmar',

            icon: 'pi pi-exclamation-triangle',

            accept: () => {

                this.tarjetaService
                    .deleteTarjeta(
                        tarjeta.id_cuenta,
                        tarjeta.id_tarjeta
                    )
                    .subscribe({

                        next: () => {

                            this.tarjetas.set(
                                this.tarjetas().filter(
                                    (t) =>
                                        t.id_tarjeta !== tarjeta.id_tarjeta
                                )
                            );

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Eliminada',
                                detail: 'Tarjeta eliminada correctamente'
                            });
                        }
                    });
            }
        });
    }

    deleteSelectedTarjetas() {

        this.confirmationService.confirm({

            message: '¿Eliminar las tarjetas seleccionadas?',

            header: 'Confirmar',

            icon: 'pi pi-exclamation-triangle',

            accept: () => {

                const ids = this.selectedTarjetas.map(
                    (t) => t.id_tarjeta
                );

                this.tarjetas.set(
                    this.tarjetas().filter(
                        (t) => !ids.includes(t.id_tarjeta)
                    )
                );

                this.selectedTarjetas = [];

                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Tarjetas eliminadas'
                });
            }
        });
    }

    hideDialog() {

        this.tarjetaDialog = false;

        this.submitted = false;
    }

    saveTarjeta() {

        this.submitted = true;

        if (!this.tarjeta.numero_tarjeta?.trim()) return;

        if (!this.tarjeta.tipo_tarjeta?.trim()) return;

        if (!this.tarjeta.fecha_vencimiento) return;

        if (!this.tarjeta.id_cuenta?.trim()) return;

        if (this.tarjeta.id_tarjeta) {

            const updateReq: UpdateTarjetaRequest = {

                numero_tarjeta: this.tarjeta.numero_tarjeta,

                tipo_tarjeta: this.tarjeta.tipo_tarjeta,

                fecha_vencimiento: this.tarjeta.fecha_vencimiento,

                cvv: this.tarjeta.cvv,

                estado: this.tarjeta.estado,

                id_cuenta: this.tarjeta.id_cuenta
            };

            this.tarjetaService
                .updateTarjeta(
                    this.tarjeta.id_cuenta,
                    this.tarjeta.id_tarjeta,
                    updateReq
                )
                .subscribe({

                    next: () => {

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Actualizada',
                            detail: 'Tarjeta actualizada correctamente'
                        });

                        this.loadTarjetas();

                        this.tarjetaDialog = false;
                    }
                });

        } else {

            const createReq: CreateTarjetaRequest = {

                numero_tarjeta: this.tarjeta.numero_tarjeta,

                tipo_tarjeta: this.tarjeta.tipo_tarjeta,

                fecha_vencimiento: this.tarjeta.fecha_vencimiento,

                cvv: this.tarjeta.cvv,

                estado: this.tarjeta.estado,

                id_cuenta: this.tarjeta.id_cuenta
            };

            this.tarjetaService
                .createTarjeta(createReq)
                .subscribe({

                    next: () => {

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Creada',
                            detail: 'Tarjeta creada exitosamente'
                        });

                        this.loadTarjetas();

                        this.tarjetaDialog = false;
                    }
                });
        }
    }

    exportCSV() {

        this.dt.exportCSV();
    }
}