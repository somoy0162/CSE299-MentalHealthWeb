import { RouterModule, Routes } from '@angular/router';
import { HomeLayoutComponent } from './Common/layout/base-layout/home-layout.component';
import { LoginLayoutComponent } from './Common/layout/base-layout/login-layout.component';
import { AuthGuard } from './Common/auth/auth.guard';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '',
        component: LoginLayoutComponent,
        children: [
            { path: 'login', title: 'Counseling Center', loadComponent: () => import('./Pages/login/login.component').then((c) => c.LoginComponent) },
            { path: 'forgot-password', loadComponent: () => import('./Pages/forgot-password/forgot-password.component').then((c) => c.ForgotPasswordComponent) },
            { path: 'reset-password', loadComponent: () => import('./Pages/reset-password/reset-password.component').then((c) => c.ResetPasswordComponent) },
            { path: 'reset-password/:id', loadComponent: () => import('./Pages/reset-password/reset-password.component').then((c) => c.ResetPasswordComponent) },
            { path: 'register', loadComponent: () => import('./Pages/register/register.component').then((c) => c.RegisterComponent) },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        component: HomeLayoutComponent,
        children: [
            {
                path: 'settings',
                loadComponent: () => import('./Pages/settings/settings.component').then((c) => c.SettingsComponent),
                children: [
                    { path: '', redirectTo: 'user', pathMatch: 'full' },
                    { path: 'permission', loadComponent: () => import('./Pages/setting-setup-permission/setting-setup-permission.component').then((c) => c.SettingSetupPermissionComponent) },
                    { path: 'user', loadComponent: () => import('./Pages/setting-setup-user/setting-setup-user.component').then((c) => c.SettingSetupUserComponent) }
                ]
            },
            { path: 'dashboard', loadComponent: () => import('./Pages/dashboard/dashboard.component').then((c) => c.DashboardComponent) },
            { path: 'appointment-booking', loadComponent: () => import('./Pages/appointment-booking/appointment-booking.component').then((c) => c.AppointmentBookingComponent) },
            { path: 'account-manager', loadComponent: () => import('./Pages/account-manager/account-manager.component').then((c) => c.AccountManagerComponent) },
            { path: 'counselor-directory', loadComponent: () => import('./Pages/counselor-directory/counselor-directory.component').then((c) => c.CounselorDirectoryComponent) },
            { path: 'session-history', loadComponent: () => import('./Pages/session-history/session-history.component').then((c) => c.SessionHistoryComponent) },
            { path: 'resource-library', loadComponent: () => import('./Pages/resource-library/resource-library.component').then((c) => c.ResourceLibraryComponent) },
            { path: 'feedback-rating', loadComponent: () => import('./Pages/feedback-rating/feedback-rating.component').then((c) => c.FeedbackRatingComponent) },
            { path: 'emergency-assistance', loadComponent: () => import('./Pages/emergency-assistance/emergency-assistance.component').then((c) => c.EmergencyAssistanceComponent) },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

        ]
    }
];


