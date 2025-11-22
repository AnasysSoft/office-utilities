import { inject, Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { catchError, Observable, of, tap, throwError } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private platformId = inject(PLATFORM_ID);
    //private userClient = inject(UserRpcClient);
    //private translateClient = inject(TranslateService);

    constructor() { }

    /*get(): Observable<UserInfo> {

        if (isPlatformBrowser(this.platformId)) {
            const usrInfo = new UserData({ userName: 'Anasys@anasys.ir' });
            const request = new UserInfoRequest({ userData: usrInfo });

            return this.userClient.getUserInfo(request).pipe(
                tap((response) => {
                    // Optional: side effects
                }),
                catchError((error) => {
                    console.error('RPC Error:', error);
                    return throwError(() => error);
                    // Or: return of(defaultUserInfo); for fallback
                })
            );
        }
        return of(new UserInfo());

    }*/

    resetUserService(): void {
    }
}