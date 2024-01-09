import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";


@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
    constructor(){
        super();
        this.getAndInitTranslations();
    }

    getAndInitTranslations(){
        this.itemsPerPageLabel = "Résultats";
        this.nextPageLabel = "Page suivante";
        this.previousPageLabel = "Page précédente";
        this.changes.next();
    }

    
}