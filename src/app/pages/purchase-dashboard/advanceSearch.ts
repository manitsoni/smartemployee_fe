import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'advanceSearch',
    pure: false
})
export class AdvanceSearchPipe implements PipeTransform {

    transform(purchaseList: any[], search: any): any {
        if (!purchaseList || purchaseList.length === 0) return purchaseList;
        if (!search || !search.selectedUser && !search.selectedVendor && !search.selectedCompany) return purchaseList;
        return purchaseList.filter((data) => {
            return (!search.selectedUser || data.UserName.includes(search.selectedUser)) &&
                (!search.selectedCompany || data.CompanyName.includes(search.selectedCompany)) &&
                (!search.selectedVendor || data.VendorName.includes(search.selectedVendor));
        })

    }

}