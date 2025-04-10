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
  selectedCategories: string[] = [];
  documentsArray: { code: string; category: any; file_name: any; url: any; }[] = [];

  constructor(public wizardService: WizardService, private router: Router, private http: HttpClient) {
    this.s3Client = new S3Client({
      region: environment.AWS_REGION
    });
  }
  
  ngOnInit(): void {
    this.basicInfo = this.form.get("basicInfo")?.value || {};
    this.businessInfo = this.form.get("businessInfo")?.value || {};
    this.documents = this.form.get("documents.uploaded_documents")?.value || {};
    
    this.documentsArray = Object.keys(this.documents).map(key => ({
      category: this.documents[key].categoryValue,
      file_name: this.documents[key].name,
      url: this.documents[key].url,
      code: key
    }));
    
    const logo = this.businessInfo.logo;
    if (logo) {
      if (logo instanceof Blob) {
        this.avatarImage = URL.createObjectURL(logo);
      } else {
        this.avatarImage = logo;
      }
    }
    if (this.businessInfo.categories?.length) {
      this.selectedCategories = this.businessInfo.categories.map((c: { label: string; }) => c.label).join(", ");
    }
  }

  navigateToPrivacyPolicy(event: Event) {
    event.preventDefault();
    this.router.navigate(["/privacy-policy"]);
  }

  getTier(value: string): string {
    return value === "growing" ? "1" : value === "established" ? "2" : value === "matured" ? "3" : "0";
  }

  async onSubmitForm() {
    this.submitted = true;
    if (!this.isChecked) return;
    
    const uploadedDocs = this.documentsArray || [];
    const s3_base_url = environment.MERCHANT_ONBOARDING_S3_URL;
    
    try {
      this.isSubmittingForm = true;
      const s3Documents = await Promise.all(
        uploadedDocs.map(async (doc: { url: string; file_name: string; code: any; }) => {
          const file = await this.convertBlobUrlToFile(doc.url, doc.file_name);
          return { code: doc.code, file: file };
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

      const encodedDocuments = formattedDocuments.map((doc) => {
        try {
          const encodedUrl = encodeURI(doc.url);
          return { ...doc, url: encodedUrl };
        } catch (error) {
          return { ...doc, encodedUrl: null };
        }
      });
      
      const payload = {
        merchantData: [
          {
            companyName: this.businessInfo.business_name || "",
            tradeName: this.businessInfo.trade_name || "",
            country: this.businessInfo.country_code,
            code: this.businessInfo.country_code,
            companyLogo: this.businessInfo.logo ? URL.createObjectURL(this.businessInfo.logo) : "",
            typeOfCompany: this.businessInfo.company_type || "",
            companyCategories: this.businessInfo.categories.map((c: any) => c.name) || [],
            tier: this.businessInfo.averageMonthlyTransValue.name,
            basicInfo: {
              surname: this.basicInfo.surname,
              otherNames: this.basicInfo.othernames,
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
            taxIdentificationNumber: this.businessInfo.tin,
            documents: encodedDocuments,
          },
        ],
        callbackUrl: this.basicInfo.email
      };
      
      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        "transflowId": environment.TRANSFLOW_ID,
        "apiKey": environment.MERCHANT_ONBOARDING_API_KEY,
        "merchantProductId": environment.MERCHANT_PRODUCT_ID,
      });
      
      const response = await this.http.post<any>(`${environment.MERCHANT_ONBOARDING_API_URL}/source/${superMerchantId}/merchant/request`, JSON.stringify(payload), { headers }).toPromise();
      this.requestStatus.emit(response);
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

  onLogoError(event: Event) {
    (event.target as HTMLImageElement).src = "assets/images/merchant.png";
  }
}
