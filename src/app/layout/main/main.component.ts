import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { WizardService } from 'src/app/core/wizard.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
  @ViewChild("topSection") topSection!: ElementRef;

  form: FormGroup;
  searchForm!: FormGroup;
  countries: Country[] = [];

  requestId: any;
  product: string = "";
  avatarImage: string = "";
  errorMessage: string = "";
  requestFailed: boolean = false;
  isRequestSuccessful: boolean = false;

  isLoadingProducts: boolean = false;
  displayProducts: boolean = true;
  filteredProducts: any[] = [];
  allProducts: any[] = [];
  selectedProduct: any;

  searchItem: string = "";

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
        trade_name: new FormControl('', []),
        country_of_operation: new FormControl(null, [Validators.required]),
        company_type: new FormControl(null, [Validators.required]),
        categories: new FormControl(null, [Validators.required]),
        digital_address: new FormControl(null, [Validators.required]),
        postal_address: new FormControl(null, [Validators.required]),
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
      const itcProduct = params["product"];

      if (itcProduct === undefined) {
        this.displayProducts = true;
        this.product = "";
      } else {
        this.displayProducts = false;
        this.product = itcProduct;
      }
    });
    this.checkRouteParams();
    this.fetchProducts();
    
    this.searchForm = new FormGroup({
      searchItem: new FormControl("")
    })
  }

  async fetchProducts(): Promise<any> {
    const headers = new HttpHeaders({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-api-key": environment.MERCHANT_CATALOGUE_API_KEY,
    });
    try {
      this.isLoadingProducts = true;
      this.http.get<any>(`${environment.MERCHANT_CATALOGUE_API_URL}/products`, { headers }).subscribe({
        next: (res: any) => {
          this.allProducts = res.data.data;
          this.filteredProducts = [...this.allProducts];
          
          const matched = this.allProducts.find(p => p.name === this.product);
          if (this.product && !matched) {
            this.goBackToProducts();
          } else {
            this.selectedProduct = matched;
          }
          this.isLoadingProducts = false;
        }
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
      this.isLoadingProducts = false;
    }
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
    this.router.navigate([], {
      queryParams: { product: product.name },
      queryParamsHandling: "merge",
    }).then(() => {
      this.displayProducts = false;
    });
  }

  onSearch() {
    const value = this.searchForm.get("searchItem")?.value || "";
    const searchValue = value.trim().toLowerCase();

    if (searchValue) {
      this.filteredProducts = this.allProducts.filter(p =>
        p.name.toLowerCase().includes(searchValue)
      );
    } else {
      this.filteredProducts = [...this.allProducts];
    }
  }

  goBackToProducts() {
    this.router.navigate([], {
      queryParams: { product: null },
      queryParamsHandling: "merge",
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
      console.error("Error: ", status?.responseMessage);
      this.topSection.nativeElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  goBackHome() {
    this.location.back();
  }

  checkRouteParams() {
    this.requestId = this.route.snapshot.firstChild?.paramMap.get("id");
    
    if (this.requestId) {
      this.populateForm(this.requestId);
    }
    if (this.product) {
      this.displayProducts = false;
    }
  }

  async fetchMerchantData(id: string): Promise<any> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "transflowId": environment.BACKOFFICE_TRANSFLOW_ID,
      "apiKey": environment.BACKOFFICE_MERCHANT_ONBOARDING_API_KEY,
      "merchantProductId": environment.MERCHANT_PRODUCT_ID,
    });
  
    try {
      const response = await this.http
        .get<any>(`${environment.MERCHANT_ONBOARDING_API_URL}/request/${id}/`, { headers })
        .toPromise();
      
      return response?.data;
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      return null;
    }
  }

  async populateForm(id: string) {
    const entry = await this.fetchMerchantData(id);
    if (!entry) return;
  
    const merchant = entry.merchantData[0];
    const country = this.countries.find((c: any) => c.code === merchant.code);
    const dial_code = country?.dial_code || "+233";
    const msisdn = merchant.basicInfo.phoneNumber.replace(dial_code, "").trim();
  
    const averageMap: any = {
      1: "growing",
      2: "established",
      3: "matured"
    };

    const cleanedDocuments = merchant.documents.map((doc: any) => ({
      ...doc,
      url: decodeURIComponent(doc.url),
    }));
    
    this.form.patchValue({
      basicInfo: {
        surname: merchant.basicInfo.surname,
        othernames: merchant.basicInfo.otherNames,
        email: merchant.basicInfo.email,
        dial_code: dial_code,
        msisdn: msisdn,
        support_contact: false
      },
      businessInfo: {
        averageMonthlyTransValue: averageMap[merchant.tier],
        logo: merchant.companyLogo,
        business_name: merchant.companyName,
        trade_name: merchant.tradeName,
        country_of_operation: country?.name || merchant.country,
        company_type: merchant.typeOfCompany,
        categories: merchant.companyCategories,
        digital_address: "",
        postal_address: ""
      },
      documents: {
        uploaded_documents: cleanedDocuments
      }
    });
  }
}
