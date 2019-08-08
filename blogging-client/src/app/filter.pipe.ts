import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any, searchText: string): any {
        if(!items) return [];
        if(!searchText) return items;
        searchText = searchText.toLowerCase();
        let x = searchText.split(" ");
        for(var i=0; i<x.length; i++) {
            console.log(x[i]);
        }
        return items.filter( user => {
        return user.userName.toLowerCase().includes(searchText)
        || user.firstName.toLowerCase().includes(searchText)
        || user.lastName.toLowerCase().includes(searchText);
        });
    
    }
}

