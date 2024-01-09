import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})

export class FilterPipe implements PipeTransform {
    /**
     * Pipe filters the list of elements based on the search text provided
     *
     * @param formationsList list of elements to search in
     * @param searchText search string
     * @returns list of elements filtered by search text or []
     */
    transform(snapshotArr: any, searchValue: string) {    
        if (!snapshotArr) {
            return [];
        }
        if (!searchValue) {
            return snapshotArr;
        }
        if (snapshotArr && searchValue) {      
            return snapshotArr.filter((snapshot:any)=> {
                return snapshot.name.toLowerCase().includes(searchValue.toLowerCase());
             });
        }
      }
}