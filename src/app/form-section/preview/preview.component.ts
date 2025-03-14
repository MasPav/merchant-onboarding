import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { environment } from "src/environments/environment";
import { WizardService } from "src/app/core/wizard.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  private s3Client!: S3Client;
  private bucketName = "merchant-onboarding-app";

  @Input() form!: FormGroup;
  @Input() countries: any[] = [];
  @Output() requestStatus: EventEmitter<any> = new EventEmitter();

  basicInfo: any;
  documents: any;
  businessInfo: any;
  avatarImage: string = "";
  isChecked: boolean = false;
  submitted: boolean = false;
  isSubmittingForm: boolean = false;

  constructor(public wizardService: WizardService, private router: Router, private http: HttpClient) {
    this.s3Client = new S3Client({
      region: environment.AWS_REGION,
      credentials: {
        accessKeyId: environment.AWS_ACCESS_KEY,
        secretAccessKey: environment.AWS_SECRET
      }
    });
  }

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

  async onSubmitForm() {
    this.submitted = true;
    if (!this.isChecked) return;
    
    const uploadedDocs = this.documents || [];
    const s3_base_url = environment.MERCHANT_ONBOARDING_S3_URL;
    
    try {
      this.isSubmittingForm = true;
      const s3Documents = await Promise.all(
        uploadedDocs.map(async (doc: { url: string; file_name: string; category_name: any; }) => {
          const file = await this.convertBlobUrlToFile(doc.url, doc.file_name);
          return { code: doc.category_name, file: file };
        })
      );
      
      const uploadPromises = s3Documents.map(async (doc) => {
        const filePath = `Documents/${doc.file.name}`;
        const fileArrayBuffer = await doc.file.arrayBuffer();

        const command = new PutObjectCommand({ ACL: "public-read", Bucket: this.bucketName, Key: filePath, Body: new Uint8Array(fileArrayBuffer), ContentType: doc.file.type });
        await this.s3Client.send(command);
        
        return { code: doc.code, url: `${s3_base_url}/${filePath}` };
      });

      const superMerchantId = environment.MERCHANT_ID;
      const formattedDocuments = await Promise.all(uploadPromises);
      
      const payload = {
        merchantData: [
          {
            companyName: this.businessInfo.business_name || "",
            tradeName: this.businessInfo.trade_name || "",
            alias: "ITCM",
            country: this.businessInfo.country_code,
            code: this.businessInfo.country_code,
            companyLogo: this.businessInfo.logo ? URL.createObjectURL(this.businessInfo.logo) : "",
            typeOfCompany: this.businessInfo.company_type || "",
            companyCategories: [this.businessInfo.categories.name],
            companyRegistrationNumber: "CS360712025",
            vatRegistrationNumber: "C0001234567",
            dateOfIncorporation: "2025-03-01",
            dateOfCommencement: "2025-03-07",
            taxIdentificationNumber: "TIN0012345678",
            basicInfo: {
              surname: this.basicInfo.surname,
              otherNames: this.businessInfo.trade_name || "",
              email: this.basicInfo.email,
              phoneNumber: `${this.basicInfo.dial_code}${this.basicInfo.msisdn}`,
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
                businessType: this.businessInfo.company_type || "",
                officeCity: "East Legon",
                officeRegion: "GA001",
                officePhone: "233 302123456",
                officeMobile: "233 302123456",
                officeDistrict: "AWMD3167",
              },
            ],
            documents: formattedDocuments,
          },
        ],
        callbackUrl: this.basicInfo.email
      };

      const dummyPayload = {
        "merchantData": [
            {
                "companyName": "Technology Solutions",
                "tradeName": "TechSol",
                "alias": "ITCM",
                "country": "GH",
                "code": "GH",
                "companyLogo": "blob:http://localhost:53381/1759205c-3da4-4c0f-a588-cc21a211c842",
                "typeOfCompany": "Partnership",
                "companyCategories": [
                    "voucher"
                ],
                "companyRegistrationNumber": "CS360712025",
                "vatRegistrationNumber": "C0001234567",
                "dateOfIncorporation": "2025-03-01",
                "dateOfCommencement": "2025-03-07",
                "taxIdentificationNumber": "TIN0012345678",
                "basicInfo": {
                    "surname": "Doe",
                    "otherNames": "TechSol",
                    "email": "doe.john@gmail.com",
                    "phoneNumber": "+233240000000"
                },
                "contacts": [
                    {
                        "contactTypeId": "43cd2673-6238-46ae-a62d-69d6ba608728",
                        "email": "doe.john@gmail.com",
                        "phone": "+233240000000"
                    }
                ],
                "officeAddress": [
                    {
                        "officeAddress": "22-000-9090",
                        "officeOwnership": "owned",
                        "officeAddressDuration": "5 years",
                        "officePostalAddress": "",
                        "businessType": "Partnership",
                        "officeCity": "East Legon",
                        "officeRegion": "GA001",
                        "officePhone": "233 302123456",
                        "officeMobile": "233 302123456",
                        "officeDistrict": "AWMD3167"
                    }
                ],
                "documents": [
                    {
                        "code": "ghana_card",
                        "url": "https://merchant-onboarding-app.s3.eu-west-1.amazonaws.com/Documents/certification.pdf"
                    },
                    {
                        "code": "operation_license",
                        "url": "https://merchant-onboarding-app.s3.eu-west-1.amazonaws.com/Documents/certification.pdf"
                    },
                    {
                        "code": "ownership_structure",
                        "url": "https://merchant-onboarding-app.s3.eu-west-1.amazonaws.com/Documents/certification.pdf"
                    },
                    {
                        "code": "regulator_license",
                        "url": "https://merchant-onboarding-app.s3.eu-west-1.amazonaws.com/Documents/certification.pdf"
                    }
                ]
            }
        ],
        "callbackUrl": "doe.john@gmail.com"
      };
      
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "transflowId": environment.TRANSFLOW_ID,
        "apiKey": environment.MERCHANT_ONBOARDING_API_KEY,
        "merchantProductId": environment.MERCHANT_PRODUCT_ID,
        "Access-Control-Allow-Origin": "*",
      });
      
      this.http.post<any>(`${environment.MERCHANT_ONBOARDING_API_URL}/source/${superMerchantId}/merchant/request`, JSON.stringify(dummyPayload), { headers }).subscribe({
        next: (res: any) => {
          this.requestStatus.emit(res);
        }
      });
    } catch (error) {
      console.error("Error in Form Submission:", error);
    } finally {
      this.isSubmittingForm = false;
    }
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

  async convertBlobUrlToFile(blobUrl: string, fileName: string): Promise<File> {
    try {
      const response = await fetch(blobUrl);
      if (!response.ok) throw new Error(`Failed to fetch blob: ${response.statusText}`);

      const blob = await response.blob();
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error("Error converting Blob URL:", error);
      throw error;
    }
  }
}
