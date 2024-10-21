import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { LicenseManager } from '@ag-grid-enterprise/core';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

LicenseManager.setLicenseKey("Using_this_{AG_Grid}_Enterprise_key_{AG-051659}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Nineyard_Solutions_LLC}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{Nineyard}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{Nineyard}_need_to_be_licensed___{Nineyard}_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{14_February_2025}____[v3]_[01]_MTczOTQ5MTIwMDAwMA==a0584eb7766bcdb0c212fbc75628e13e");

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
