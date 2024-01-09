import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'myfilter',
    pure: false
})

export class MyFilterPipe implements PipeTransform {
    transform(items: any[], callback: any, anotherArg : any): any {
        if (!items || !callback) {
            return items;
        }
        return items.filter(item => callback(item, anotherArg));
    }
}