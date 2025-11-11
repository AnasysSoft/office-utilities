import { Pipe, PipeTransform } from "@angular/core";
import moment from 'jalali-moment';

@Pipe({
    name: 'jdate',
    standalone: true
})
export class JalaliDatePipe implements PipeTransform {
    transform(value: any, cformat: string):any {
        if(!value) return undefined;
        let MomentDate = moment(value, cformat);
        return  MomentDate.locale('fa').format(cformat);
    }
}