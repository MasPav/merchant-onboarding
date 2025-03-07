import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { WizardService } from "src/app/core/wizard.service";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() countries: any[] = [];
  @Output() requestStatus: EventEmitter<any> = new EventEmitter();

  basicInfo: any;
  documents: any;
  businessInfo: any;
  avatarImage: string = "";
  isChecked: boolean = false;
  submitted: boolean = false;

  constructor(public wizardService: WizardService, private router: Router, private http: HttpClient) { }

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
    
    const uploadedDocs = this.documents || [];
    const formattedDocuments = uploadedDocs.map((doc: any) => ({
      code: doc.category_name,
      file: doc.url,
    }));

    const payload = {
      merchantData: [
        {
          companyName: this.businessInfo.business_name || "",
          tradeName: this.businessInfo.trade_name || "",
          alias: "ITCM",
          country: this.businessInfo.country_of_operation || "",
          code: "SBVS",
          companyLogo: this.businessInfo.logo ? URL.createObjectURL(this.businessInfo.logo) : "",
          typeOfCompany: this.businessInfo.company_type || "",
          companyCategories: [this.businessInfo.categories],
          companyRegistrationNumber: "CS360712025",
          vatRegistrationNumber: "C0001234567",
          dateOfIncorporation: "2025-03-01",
          dateOfCommencement: "2025-03-07",
          taxIdentificationNumber: "TIN0012345678",
          basicInfo: {
            surname: this.basicInfo.surname
          },
          contacts: [
            ...(this.basicInfo.email && this.basicInfo.msisdn
              ? [
                  {
                    contactTypeId: "43cd2673-6238-46ae-a62d-69d6ba608728",
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
                    contactTypeId: "43cd2673-6238-46ae-a62d-69d6ba608729",
                    email: this.basicInfo.support_email,
                    phone: `${this.basicInfo.support_dial_code}${this.basicInfo.support_msisdn}`,
                  },
                ]
              : []),
          ],
          officeAddress: [
            {
              officeAddress: this.businessInfo.digital_address || "",
              officeOwnership: "owned",
              officeAddressDuration: "5 years",
              officePostalAddress: this.businessInfo.postal_address || "",
              businessType: this.businessInfo.categories.label || "",
              officeCity: "East Legon",
              officeRegion: "GA001",
              officePhone: "030 2123456",
              officeMobile: "030 2123456",
              officeDistrict: "AWMD3167",
            },
          ],
          products: [
            {
              productId: "a1b2c3d4-e5f6-7890-abcd-ef9876543210",
              name: "Digital Savings Account",
              description: "Earn higher interest rates with our zero-balance savings account, accessible 24/7 online.",
              destinationDetails: {
                destinationId: "b9c8d7e6-f5a4-3210-bcde-0987654321ab",
                destinationTypeId: "c8d7e6f5-a4b3-2109-bcde-1098765432dc",
                destinationBranchName: "Virtual Banking Hub",
                destinationAccountNumber: "123456789876",
                receiveStatement: "Y"
              }
            }
          ],
          documents: formattedDocuments,
          verificationForm: [
            {
              code: "privacy_document",
              file: "U29tZSBzYW1wbGUgZGF0YQ=="
            }
          ]
        },
      ],
      callbackUrl: this.basicInfo.email
    };

    try {
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "x-api-key": ""
      });
      
      const response = this.http.post(`${environment.MERCHANT_ONBOARDING_API_URL}/supermerchant`, payload);
      console.log(response)
    } catch (e: any) {}
    this.requestStatus.emit("successful");
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
