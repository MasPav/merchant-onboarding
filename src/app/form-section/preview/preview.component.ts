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

  constructor(public wizardService: WizardService, private router: Router) { }

  averageMonthlyTransMap: { [key: string]: string } = {
    growing: "Under GHS 5,000",
    established: "GHS 5,000 - GHS 15,000",
    matured: "Above GHS 15,000"
  };
  
  ngOnInit(): void {
    this.basicInfo = this.form.get("basicInfo")?.value || {};
    this.businessInfo = this.form.get("businessInfo")?.value || {};
    this.documents = this.form.get("uploaded_documents")?.value || {};
    
    if (this.businessInfo.logo) {
      const uploadedFile = this.businessInfo.logo;
      this.avatarImage = URL.createObjectURL(uploadedFile);
    }
    console.log(this.documents)
  }

  navigateToPrivacyPolicy(event: Event) {
    event.preventDefault();
    this.router.navigate(["/privacy-policy"]);
  }
}
