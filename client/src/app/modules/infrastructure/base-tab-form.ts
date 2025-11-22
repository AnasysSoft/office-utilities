import { BehaviorSubject } from "rxjs";
import { baseForm } from "./base-form";
import { CommonModule } from "@angular/common";
import { Component, Input, ViewChild, viewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TabList } from "primeng/tabs";

export interface TabModel {
    index: number,   
	id: any,
	icon: string,
	title: string,
	component: any,
	isCurrent: boolean,
	disabled?: boolean,

}

@Component({
  selector: '',
  template: '<div>base</div>',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class BaseTabForm extends baseForm {

    tabList: (TabModel)[] = [];

    private _activeTab: any;
    get activeTab(): any {
        return this._activeTab;
    }

    set activeTab(value: any) {
        this._activeTab = value; 
		this.onTabChange(value);
    } 

	onTabChange(tabId: any) {
		
	}

	override ngOnInit(): void {
		this.activeTab = this.tabList?.find(t => t.isCurrent)?.id;
		super.ngOnInit();
	}


	get isFirstTab(): boolean {
		return this.activeTab === this.tabList[0]?.id;
	}

	get isLastTab(): boolean {
		return this.activeTab === this.tabList[this.tabList.length - 1]?.id;
	}

	goToPreviousTab(): void {
		const ctIndex = this.tabList?.find(t => t.isCurrent)?.index ?? 0
		if (ctIndex > 0) {
			this.activeTab = this.tabList[ctIndex-1]?.id;
		}
	}

	goToNextTab(): void {
		const ctIndex = this.tabList?.find(t => t.isCurrent)?.index ?? 0
		if (ctIndex < this.tabList.length - 1) {
			this.activeTab = this.tabList[ctIndex+1]?.id;
		}
	}

}