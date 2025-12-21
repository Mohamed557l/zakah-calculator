package ntg.project.ZakahCalculator.mapper;

import ntg.project.ZakahCalculator.dto.response.VerifyOtpResponse;
import ntg.project.ZakahCalculator.entity.OtpCode;
import ntg.project.ZakahCalculator.entity.User;
import ntg.project.ZakahCalculator.entity.util.OtpType;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class OtpCodeMapper {

    public OtpCode toEntity(User user, String code, OtpType type) {
        if (user == null || code == null || type == null) return null;
        OtpCode otp = new OtpCode();
        otp.setUser(user);
        otp.setCode(code);
        otp.setType(type);
        otp.setUsed(false);
        otp.setResetToken(null);
        otp.setCreatedAt(LocalDateTime.now());
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        return otp;
    }

    public VerifyOtpResponse toVerifyOtpResponse(OtpCode otpCode) {
        if (otpCode == null) return null;
        return VerifyOtpResponse.builder()
                .message("OTP verified successfully")
                .resetToken(otpCode.getResetToken())
                .build();
    }
}
