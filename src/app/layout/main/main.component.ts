import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WizardService } from 'src/app/core/wizard.service';

export interface Country {
  "name": string;
  "flag": string;
  "code": string;
  "dial_code": string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  form: FormGroup;
  countries: Country[] = [];

  constructor(public wizardService: WizardService, private http: HttpClient) {
    this.form = new FormGroup({
      basicInfo: new FormGroup({
        surname: new FormControl('', [Validators.required]),
        othernames: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        dial_code: new FormControl('+233', [Validators.required]),
        msisdn: new FormControl('', [Validators.required]),
        support_contact: new FormControl(false),
      }),
      businessInfo: new FormGroup({
        averageMonthlyTransValue: new FormControl('', [Validators.required]),
        logo: new FormControl('', [Validators.required]),
        business_name: new FormControl('', [Validators.required]),
        trade_name: new FormControl('', [Validators.required]),
        country_of_operation: new FormControl(null, [Validators.required]),
        company_type: new FormControl(null, [Validators.required]),
        categories: new FormControl(null, [Validators.required]),
        digital_address: new FormControl(null, [Validators.required]),
        postal_address: new FormControl(null, []),
        registration_number: new FormControl(null, []),
        tin: new FormControl(null, []),
        date_of_incorporation: new FormControl(null, []),

      }),
      documents: new FormGroup({
        regulator_licence: new FormControl(null, []),
        operation_licence: new FormControl(null, []),
      })
    });
    this.getCountries();
  }

  getFormGroup(name: string): FormGroup {
    return this.form.get(name) as FormGroup;
  }

  ngOnInit() {
  }

  getCountries() {
    this.http.get('assets/files/countries.json')
      .subscribe({
        next: (res: any) => {
          this.countries = res;
        }
      })
  }

}
