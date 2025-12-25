import { inject, Injector } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const toastr = injector.get(ToastrService);

      // 🔹 حالة 409 - دع الـ component يتعامل معها (خصوصاً لحساب غير مفعل)
      if (error.status.toString().includes('409')) {
        console.log('Interceptor: حالة 409 - ترك component يتعامل معها');
        return throwError(() => error);
      }

      // 🔹 حالة 401 - بيانات تسجيل دخول غير صحيحة
      if (error.status === 401) {
        console.log('Interceptor: حالة 401 - بيانات تسجيل دخول غير صحيحة');
        toastr.error('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'خطأ في تسجيل الدخول');
        return throwError(() => error);
      }

      // 🔹 Validation errors (400)
      if (error.status === 400 && error.error?.validationErrors?.length) {
        const messages = error.error.validationErrors.map((ve: any) => {
          switch (ve.code) {
            case 'VALIDATION.AUTHENTICATION.EMAIL.NOT_BLANK':
              return 'الرجاء إدخال البريد الإلكتروني.';
            case 'VALIDATION.AUTHENTICATION.EMAIL.NOT_FORMAT':
              return 'صيغة البريد الإلكتروني غير صحيحة.';
            case 'VALIDATION.AUTHENTICATION.PASSWORD.NOT_BLANK':
              return 'الرجاء إدخال كلمة المرور.';
            case 'VALIDATION.REGISTRATION.PASSWORD.WEAK':
              return 'كلمة المرور ضعيفة، يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص.';
            case 'VALIDATION.REGISTRATION.CONFIRM_PASSWORD.NOT_BLANK':
              return 'الرجاء تأكيد كلمة المرور.';
            case 'VALIDATION.REGISTRATION.FIRSTNAME.NOT_BLANK':
              return 'الرجاء إدخال الاسم الأول.';
            case 'VALIDATION.REGISTRATION.LASTNAME.NOT_BLANK':
              return 'الرجاء إدخال الاسم الأخير.';
            case 'VALIDATION.REGISTRATION.USERNAME.NOT_BLANK':
              return 'الرجاء إدخال البريد الإلكتروني للتسجيل.';
            case 'VALIDATION.REGISTRATION.USERNAME.NOT_FORMATED':
              return 'صيغة البريد الإلكتروني غير صحيحة.';
            case 'VALIDATION.FORGET_PASSWORD.EMAIL.NOT_BLANK':
              return 'الرجاء إدخال البريد الإلكتروني.';
            case 'VALIDATION.FORGET_PASSWORD.EMAIL.EMAIL_FORMAT':
              return 'صيغة البريد الإلكتروني غير صحيحة.';
            case 'VALIDATION.CHANGE.PASSWORD.NOT_BLANK':
              return 'الرجاء إدخال كلمة المرور الحالية.';
            case 'VALIDATION.REGISTRATION.PASSWORD.SIZE':
              return 'كلمة المرور يجب أن تكون بين 8 و 50 حرفاً.';
            case 'VALIDATION.RESET_PASSWORD.PASSWORD.NOT_BLANK':
              return 'الرجاء إدخال كلمة المرور الجديدة.';
            case 'VALIDATION.RESET_PASSWORD.PASSWORD.WEAK':
              return 'كلمة المرور الجديدة ضعيفة، يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص.';
            case 'VALIDATION.VERIFY_OTP.OTP.NOT_BLANK':
              return 'الرجاء إدخال رمز التحقق.';
            default:
              return ve.message || 'خطأ في الإدخال.';
          }
        });

        toastr.error(messages.join('<br>'), 'أخطاء في الإدخال', {
          enableHtml: true,
          timeOut: 5000
        });
        return throwError(() => error);
      }

      // 🔹 Handle other errors with specific messages
      if (error.error?.message) {
        let userMessage = error.error.message;
        let title = 'خطأ';

        switch (error.status) {
          case 403:
            userMessage = 'ليس لديك صلاحية للوصول لهذا المورد.';
            title = 'صلاحية غير كافية';
            break;
          case 404:
            userMessage = 'المورد المطلوب غير موجود.';
            title = 'غير موجود';
            break;
          case 500:
            userMessage = 'حدث خطأ في الخادم، يرجى المحاولة لاحقًا.';
            title = 'خطأ في الخادم';
            break;
          default:
            if (error.status) {
              title = `خطأ ${error.status}`;
            }
        }

        toastr.error(userMessage, title, {
          timeOut: 4000
        });
        return throwError(() => error);
      }

      // 🔹 Default fallback for unknown errors
      toastr.error(
        'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى لاحقاً.',
        'خطأ غير معروف',
        { timeOut: 4000 }
      );

      console.error('HTTP Error Details:', {
        status: error.status,
        statusText: error.statusText,
        url: req.url,
        method: req.method,
        error: error.error,
        headers: req.headers
      });

      return throwError(() => error);
    })
  );
};
