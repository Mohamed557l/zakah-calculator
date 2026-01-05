package ntg.project.ZakahCalculator.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

@Getter
public enum ErrorCode {

    // ===== User / Auth =====
    USER_NOT_FOUND("USER_NOT_FOUND", "user not found with id %s", NOT_FOUND),
    USERNAME_NOT_FOUND("USERNAME_NOT_FOUND", "username not found", NOT_FOUND),

    EMAIL_ALREADY_EXISTS("EMAIL_ALREADY_EXISTS", "email already exists", CONFLICT),
    USER_ALREADY_DELETED("USER_ALREADY_DELETED", "User is already deleted", CONFLICT),
    USER_ALREADY_ACTIVE("USER_ALREADY_ACTIVE", "User is already active", CONFLICT),
    ACCOUNT_NOT_VERIFIED("ACCOUNT_NOT_VERIFIED", "account not verified", CONFLICT),

    ERR_USER_DISABLED("ERR_USER_DISABLED", "user is disabled", CONFLICT),

    BAD_CREDENTIALS("BAD_CREDENTIALS", "Username and / or password is incorrect", UNAUTHORIZED),
    INVALID_CURRENT_PASSWORD("INVALID_CURRENT_PASSWORD", "Current password is invalid", CONFLICT),

    // ===== Password / Validation =====
    CHANGE_PASSWORD_MISMATCH("CHANGE_PASSWORD_MISMATCH", "Current password and new password are the same", BAD_REQUEST),
    PASSWORD_MISMATCH("PASSWORD_MISMATCH", "password don't match", BAD_REQUEST),

    // ===== JWT / Security =====
    JWT_NOT_VALID("JWT_NOT_VALID", "access token not valid", UNAUTHORIZED),

    // ===== OTP =====
    OTP_TOKEN_INVALID("OTP_TOKEN_INVALID", "invalid token, send it again", BAD_REQUEST),
    OTP_TOKEN_EXPIRED("OTP_TOKEN_EXPIRED", "otp is expired", FORBIDDEN),
    FORGET_PASSWORD_SENDING_OTP_FAILED("FORGET_PASSWORD_SENDING_OTP_FAILED","failed to send otp to your account",INTERNAL_SERVER_ERROR),

    // ===== Roles =====
    ROLE_NOT_FOUND("ROLE_NOT_FOUND", "role not found", NOT_FOUND),

    // ===== Upload =====
    MAXIMUM_UPLOAD_SIZE_INVALID(
            "MAXIMUM_UPLOAD_SIZE_INVALID",
            "Maximum upload size is 10MB",
            PAYLOAD_TOO_LARGE
    ),

    // ===== Zakah =====
    ZAKAH_RECORD_NOT_FOUND("ZAKAH_RECORD_NOT_FOUND", "Zakah record not found with id %s", NOT_FOUND),

    INVALID_ZAKAH_DATA("INVALID_ZAKAH_DATA", "Invalid zakah data: %s", BAD_REQUEST),
    INVALID_BALANCE_SHEET_DATE("INVALID_BALANCE_SHEET_DATE", "Invalid balance sheet date: %s", BAD_REQUEST),

    BALANCE_SHEET_DATE_BEFORE_LAST_RECORD(
            "BALANCE_SHEET_DATE_BEFORE_LAST_RECORD",
            "Balance sheet date cannot be before your last record date: %s",
            CONFLICT
    ),

    NEGATIVE_ZAKAH_POOL(
            "NEGATIVE_ZAKAH_POOL",
            "Zakah pool cannot be negative. Your liabilities exceed your assets",
            UNPROCESSABLE_ENTITY
    ),

    GOLD_PRICE_INVALID("GOLD_PRICE_INVALID", "Gold price must be greater than zero", BAD_REQUEST),

    // ===== General =====
    INTERNAL_EXCEPTION("INTERNAL_EXCEPTION", "Internal server error", INTERNAL_SERVER_ERROR);

    private final String code;
    private final String defaultMessage;
    private final HttpStatus status;

    ErrorCode(String code, String defaultMessage, HttpStatus status) {
        this.code = code;
        this.defaultMessage = defaultMessage;
        this.status = status;
    }
}

