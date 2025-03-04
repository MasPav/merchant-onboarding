import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { Component, Input, OnInit } from "@angular/core";
import { WizardService } from "src/app/core/wizard.service";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() countries: any[] = [];

  basicInfo: any;
  documents: any;
  businessInfo: any;
  avatarImage: string = "";
  isChecked: boolean = false;
  submitted: boolean = false;

  constructor(public wizardService: WizardService, private router: Router) { }

  averageMonthlyTransMap: { [key: string]: string } = {
    growing: "Under GHS 5,000",
    established: "GHS 5,000 - GHS 15,000",
    matured: "Above GHS 15,000"
  };
  
  ngOnInit(): void {
    this.basicInfo = this.form.get("basicInfo")?.value || {};
    this.businessInfo = this.form.get("businessInfo")?.value || {};
    this.documents = this.form.get("documents.uploaded_documents")?.value || {};
    if (this.businessInfo.logo) {
      const uploadedFile = this.businessInfo.logo;
      this.avatarImage = URL.createObjectURL(uploadedFile);
    }
  }

  navigateToPrivacyPolicy(event: Event) {
    event.preventDefault();
    this.router.navigate(["/privacy-policy"]);
  }

  onSubmitForm() {
    this.submitted = true;
    if (!this.isChecked) return;

    const payload = {
      merchantData: [
        {
          companyName: this.businessInfo.business_name || "",
          tradeName: this.businessInfo.trade_name || "",
          country: this.businessInfo.country_of_operation || "",
          companyLogo: this.businessInfo.logo ? URL.createObjectURL(this.businessInfo.logo) : "",
          typeOfCompany: this.businessInfo.company_type || "",
          contacts: [
            ...(this.basicInfo.email && this.basicInfo.msisdn
              ? [
                  {
                    email: this.basicInfo.email,
                    phone: `${this.basicInfo.dial_code}${this.basicInfo.msisdn}`,
                  },
                ]
              : []),
            ...(this.basicInfo.support_contact &&
            this.basicInfo.support_email &&
            this.basicInfo.support_msisdn
              ? [
                  {
                    email: this.basicInfo.support_email,
                    phone: `${this.basicInfo.support_dial_code}${this.basicInfo.support_msisdn}`,
                  },
                ]
              : []),
          ],
          officeAddress: [
            {
              officeAddress: this.businessInfo.digital_address || "",
              officePostalAddress: this.businessInfo.postal_address || "",
              businessType: this.businessInfo.categories.label || "",
            },
          ],
          products: [],
        },
      ],
    };
  }

  formatDate(date: string) {
    if (!date || isNaN(Date.parse(date))) {
      return "N/A";
    }
    const newDate = new Date(date);
    const month = newDate.toLocaleDateString('default', {month: 'short'});
    const day = newDate.getDate().toString().padStart(2, '0')
    const year = newDate.getFullYear();
    return `${month} ${day}, ${year}`;
  }
}
