import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WizardService } from 'src/app/core/wizard.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  paramValue: string = "";
  avatarImage: string = "";
  errorMessage: string = "";
  requestFailed: boolean = false;
  isRequestSuccessful: boolean = false;

  constructor(public wizardService: WizardService, private http: HttpClient, private router: Router, private route: ActivatedRoute, private location: Location) {
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
        postal_address: new FormControl(null, [])

      }),
      documents: new FormGroup({
        uploaded_documents: new FormControl(null, [])
      })
    });
    this.getCountries();
  }

  getFormGroup(name: string): FormGroup {
    return this.form.get(name) as FormGroup;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (!params["product"]) {
        this.router.navigate([], {
          queryParams: { product: "Uniwallet Integration" },
          queryParamsHandling: "merge"
        });
      } else {
        this.paramValue = params["product"];
      }
    });
  }

  getCountries() {
    this.http.get('assets/files/countries.json')
      .subscribe({
        next: (res: any) => {
          this.countries = res;
        }
      })
  }

  onRequestStatus(status: any) {
    const businessInfo = this.form.get("businessInfo")?.value || {};
    if (businessInfo.logo) {
      const uploadedFile = businessInfo.logo;
      this.avatarImage = URL.createObjectURL(uploadedFile);
    }
    
    if (status?.responseCode == "200") {
      this.isRequestSuccessful = true;
    } else {
      this.requestFailed = true;
      this.isRequestSuccessful = false;
      this.errorMessage = status?.data?.message;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.error("Error: ", status?.responseMessage);
    }
  }

  goBackHome() {
    this.location.back();
  }
}
