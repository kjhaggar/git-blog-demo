import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any, searchText: string): any {
    if(!items) return [];
    if(!searchText) return items;
searchText = searchText.toLowerCase();
return items.filter( user => {
      return user.userName.toLowerCase().includes(searchText)
      || user.firstName.toLowerCase().includes(searchText)
      || user.lastName.toLowerCase().includes(searchText);
    });
   }

// transform(items: any, searchText?: string, propertyName?: string, propertyName2?: string): any {
//   if (searchText === undefined) {
//       return items;
//   } else {
//       let filteredData = items.filter(obj => obj[propertyName].toLowerCase().includes(searchText.toLowerCase()));
//       if (propertyName2) {
//           filteredData = filteredData.concat(items.filter(obj => obj[propertyName2].toLowerCase().includes(searchText.toLowerCase())));
//       }
//       return filteredData;
//   }
// }
}