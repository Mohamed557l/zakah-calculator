export interface IuserRegisteration {
    name: string;
    email: string;
    password?: string; // اختياري عند الإرسال للسيرفر إذا كنت ستستخدم تأكيد كلمة المرور فقط محلياً
    confirmPassword?: string;
    persona: 'individual' | 'company'; // نوع الحساب
    termsAccepted: boolean;
}

export interface IuserLogin {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    message: string;
}

export interface IForgotPassword {
    email: string;
}

export interface IForgotPasswordResponse {
    message: string;
    success: boolean;
}   