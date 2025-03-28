import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WizardService } from 'src/app/core/wizard.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

type averageMonthlyTransCategories = 'growing' | 'established' | 'matured';

@Component({
  selector: 'app-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.css']
})
export class BusinessInfoComponent implements OnInit {

  @Input() form!: FormGroup;
  @Input() countries: any[] = [];

  averageMonthlyTransCategory!: averageMonthlyTransCategories;
  isTaglistLoading: boolean = false;
  avatarImage: string = '';
  
  companyTypes = ["Sole Proprietorship", "Partnership", "Limited Liability", "Corporation", "Private Company", " Holding Company", "Joint-stock Company", "Statutory corporation", "Small Business", "Foreign corporation", "Subsidiary", "Investment company"];
  productTags = ['Vouchers', 'Agents'];

  constructor(public wizardService: WizardService, private http: HttpClient) {}

  ngOnInit() {
    const control = this.form.get("averageMonthlyTransValue");
    if (control?.value) {
      this.averageMonthlyTransCategory = control?.value;
    }
    
    const logo = this.form.get("logo")?.value;
    if (logo) {
      if (logo instanceof Blob) {
        this.avatarImage = URL.createObjectURL(logo);
      } else if (typeof logo === "string") {
        this.avatarImage = logo;
      }
    }

    this.form.get("country_of_operation")?.valueChanges.subscribe((selectedCountry) => {
      const country = this.countries.find((c) => c.name === selectedCountry);
      if (country) {
        if (!this.form.contains("country_code")) {
          this.form.addControl("country_code", new FormControl(country.code));
        } else {
          this.form.get("country_code")?.setValue(country.code);
        }
      }
    });
    this.fetchTags();
  }

  setAverageMonthlyTrans(category: averageMonthlyTransCategories) {
    this.averageMonthlyTransCategory = category;
    const tinValue = this.form.get("tin")?.value;
    this.form.patchValue({averageMonthlyTransValue: category});

    this.form.removeControl("tin");
    this.form.removeControl("registration_number");
    this.form.removeControl("date_of_incorporation");

    if (category === "matured") {
      this.addControls(tinValue);
    } else if (category === "established") {
      this.form.addControl("tin", new FormControl(tinValue || null, Validators.required));
    }

    this.form.get("tin")?.updateValueAndValidity();

    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  onNavNext() {
    const isValid = this.validateForm();
    if(isValid) {
      this.wizardService.markSectionAsCompleted(this.wizardService.selectedSection);
      this.wizardService.moveToNextSection();
    }
  }


  validateForm(): boolean {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsDirty();
      this.form.get(key)?.markAsTouched();
    });
    return this.form.valid
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarImage = reader.result as string;
        this.getFormControl("logo").setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  private addControls(tinValue?: any) {
    this.form.addControl("tin", new FormControl(tinValue || null, Validators.required));
    this.form.addControl("registration_number", new FormControl(null, Validators.required));
    this.form.addControl("date_of_incorporation", new FormControl(null, Validators.required));

    this.form.updateValueAndValidity();
  }

  fetchTags() {
    this.isTaglistLoading = true;
    try {
      const url = `${environment.MERCHANT_CATALOGUE_API_URL}/tags?type=merchants`;
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "x-api-key": `${environment.MERCHANT_CATALOGUE_API_KEY}`
      });

      return this.http.get(url, { headers }).subscribe({
        next: (res: any) => {
          this.productTags = res.data;

          const rawCategories = this.form.get("categories")?.value;

          if (Array.isArray(rawCategories) && typeof rawCategories[0] === "string") {
            const normalized = rawCategories
              .map(code => this.productTags.find((tag: any) => tag.name === code))
              .filter(Boolean);

            this.form.get("categories")?.setValue(normalized);
          }
        },
        error: () => {},
      });
    } catch (e: any) {
      console.error("Error:", e);
      return e;
    } finally {
      this.isTaglistLoading = false;
    }
  }

  onLogoError(event: Event) {
    (event.target as HTMLImageElement).src = "assets/images/merchant.png";
  }
}
