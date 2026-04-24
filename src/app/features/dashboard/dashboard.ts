import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TopCategoriesWidgetComponent } from './components/bestsellingwidget';
import { NotificationsWidget } from './components/notificationswidget';
import { RecentBooksWidgetComponent } from './components/recentbookswidget';
import { StatsWidget } from './components/statswidget';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    StatsWidget,
    RecentBooksWidgetComponent,
    TopCategoriesWidgetComponent,
    NotificationsWidget,
  ],
  templateUrl: './dashboard.html'
})
export class Dashboard {}
