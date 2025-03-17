import { Injectable } from '@angular/core';
import { TransactionValue } from './types';

interface Section {
  title: string;
  hidden: boolean;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WizardService {

  sections: Section[] = [];
  lastTransactionValue: TransactionValue | null = null;

  constructor() {
    this.sections = [
      {
        title: 'Basic Info',
        hidden: false,
        completed: false
      },
      {
        title: 'Business Info',
        hidden: true,
        completed: false
      },
      {
        title: 'Documents',
        hidden: true,
        completed: false
      },
      {
        title: 'Preview',
        hidden: true,
        completed: false
      }
    ]
  }

  get selectedSection() {
    return this.sections.find(section => !section.hidden)!;
  }

  get selectedSectionIndex() {
    return this.sections.indexOf(this.selectedSection);
  }

  moveToNextSection() {
    const nextSection = this.sections.find((section, sIndex) => (sIndex == this.selectedSectionIndex + 1))!;
    this.navToSection(this.sections.indexOf(nextSection));
  }

  moveToPrevSection() {
    const prevSection = this.sections.find((section, sIndex) => (sIndex == this.selectedSectionIndex - 1))!;
    this.navToSection(this.sections.indexOf(prevSection));
  }

  navToSection(sectionIndex: number) {
    this.selectedSection.hidden = true;
    const section = this.sections.find((section, sIndex) => sIndex == sectionIndex)!;
    section.hidden = false;
  }

  markSectionAsCompleted(section: Section) {
    section.completed = true;
  }

}
