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
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { BancoService } from 'src/app/core/services/Banco.service';
import { Banco, CreateBancoRequest, UpdateBancoRequest } from 'src/app/shared/models/Banco.model';

@Component({
    selector: 'app-Banco-crud',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, RippleModule, DialogModule, InputTextModule, ConfirmDialogModule, ToastModule, IconFieldModule, InputIconModule],
    templateUrl: './Banco-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class BancoListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    bancos = signal<Banco[]>([]);
    selectedBancos: Banco[] = [];
    banco!: Banco;
    bancoDialog: boolean = false;
    submitted: boolean = false;
    loading: boolean = false;

    constructor(
        private bancoService: BancoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public authService: AuthService
    ) {}

    ngOnInit() {
        this.loadBancos();
    }

    loadBancos() {
        this.loading = true;
        this.bancoService.getBancos({ page: 1, limit: 100 }).subscribe({
            next: (data: Banco[]) => {
                console.log('Bancos recibidos:', data);
                this.bancos.set(data);
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Error al cargar bancos:', err);
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los bancos' });
            }
        });
    }

    onGlobalFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.banco = {
            id_banco: '',
            nit: '',
            direccion: '',
            telefono: '',
            correo_contacto: '',
            id: '',
            nombre: '',
            fecha_creacion: new Date().toISOString()
        };
        this.submitted = false;
        this.bancoDialog = true;
    }

    editBanco(banco: Banco) {
        this.banco = { ...banco };
        this.bancoDialog = true;
    }

    deleteBanco(banco: Banco) {
        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar el banco "${banco.nombre}"?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.bancoService.deleteBanco(banco.id_banco).subscribe({
                    next: () => {
                        this.bancos.set(this.bancos().filter((b) => b.id_banco !== banco.id_banco));
                        this.messageService.add({ severity: 'success', summary: 'Eliminada', detail: 'Banco eliminado correctamente' });
                    }
                });
            }
        });
    }

    deleteSelectedBancos() {
        this.confirmationService.confirm({
            message: '¿Eliminar los bancos seleccionadao?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedBancos.map((b: { id_banco: any }) => b.id_banco);
                this.bancos.set(this.bancos().filter((b: { id_banco: any }) => !ids.includes(b.id_banco)));
                this.selectedBancos = [];
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Bancos eliminados' });
            }
        });
    }

    hideDialog() {
        this.bancoDialog = false;
        this.submitted = false;
    }

    saveBanco() {
        this.submitted = true;
        if (!this.banco.nombre?.trim()) return;
        if (this.banco.id_banco) {
            const updateReq: UpdateBancoRequest = {
                nombre: this.banco.nombre
            };
            this.bancoService.updateBanco(this.banco.id_banco, updateReq).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Banco actualizado correctamente' });
                    this.loadBancos();
                    this.bancoDialog = false;
                }
            });
        } else {
            const createReq: CreateBancoRequest = {
                nombre: this.banco.nombre,
                nit: this.banco.nit,
                direccion: this.banco.direccion,
                telefono: this.banco.telefono,
                correo_contacto: this.banco.correo_contacto
            };
            this.bancoService.createBanco(createReq).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Creada', detail: 'Banco creado exitosamente' });
                    this.loadBancos();
                    this.bancoDialog = false;
                }
            });
        }
    }

    exportCSV() {
        this.dt.exportCSV();
    }
}
