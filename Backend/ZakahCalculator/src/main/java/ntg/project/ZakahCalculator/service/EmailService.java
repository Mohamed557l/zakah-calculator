package ntg.project.ZakahCalculator.service;

import ntg.project.ZakahCalculator.entity.util.OtpType;

import java.util.concurrent.CompletableFuture;

public interface EmailService {
    CompletableFuture<String> sendEmail(
            String to,
            String fullName,
            OtpType otpType,
            String activationCode);
}
