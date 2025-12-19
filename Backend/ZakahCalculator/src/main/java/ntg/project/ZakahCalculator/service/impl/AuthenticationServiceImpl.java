package ntg.project.ZakahCalculator.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ntg.project.ZakahCalculator.dto.request.*;
import ntg.project.ZakahCalculator.dto.response.AuthenticationResponse;
import ntg.project.ZakahCalculator.dto.response.ResetPasswordResponse;
import ntg.project.ZakahCalculator.entity.OtpCode;
import ntg.project.ZakahCalculator.entity.User;
import ntg.project.ZakahCalculator.entity.util.OtpType;
import ntg.project.ZakahCalculator.exception.BusinessException;
import ntg.project.ZakahCalculator.exception.ErrorCode;
import ntg.project.ZakahCalculator.mapper.UserMapper;
import ntg.project.ZakahCalculator.repository.OtpCodeRepository;
import ntg.project.ZakahCalculator.repository.UserRepository;
import ntg.project.ZakahCalculator.security.JwtService;
import ntg.project.ZakahCalculator.service.AuthenticationService;
import ntg.project.ZakahCalculator.service.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final OtpCodeRepository otpCodeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthenticationResponse login(AuthenticationRequest request) {
        final Authentication auth = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                ));
        final User user = (User) auth.getPrincipal();
        final String token = this.jwtService.generateAccessToken(user.getUsername());
        final String refreshToken = this.jwtService.generateRefreshToken(user.getUsername());
        final String tokenType = "Bearer";

        // TODO Adding UserResponseDTO To This Return (Waiting For Mappers)
        return AuthenticationResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .userResponse(null)
                .build();
    }

    @Override
    @Transactional
    public void register(RegistrationRequest request) {
        checkEmail(request.getEmail());
        checkPasswords(request.getPassword(), request.getConfirmPassword());

        // TODO Waiting For Mappers
        // TODO WAITING FOR VERIFY ACCOUNT TO MAKE AUTHENTICATION RESPONSE
//        final User user = this.userMapper.toUser(request);
//        log.debug("Saving User {}", user);
//        this.userRepository.save(user);
    }

    @Override
    public AuthenticationResponse refreshToken(RefreshRequest request) {
        final String newAccessToken = this.jwtService.refreshAccessToken(request.getRefreshToken());
        final String tokenType = "Bearer";


        // TODO Adding UserResponseDTO To This Return (Waiting For Mappers)
        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(request.getRefreshToken())
                .userResponse(null)
                .build();
    }

    @Override
    @Transactional
    public ResetPasswordResponse forgetPassword(ForgetPasswordRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        OtpCode token = otpCodeRepository.findByUserIdAndTypeAndUsedFalse(user.getId(), OtpType.PASSWORD_RESET)
                .orElseGet(OtpCode::new);
        token.setCode(generateOtp());
        token.setUser(user);
        token.setUsed(false);
        OtpCode savedNewToken = otpCodeRepository.save(token);
        // Send Email Using @Async
        CompletableFuture<String> emailFuture = emailService.sendEmail(
                user.getUsername(), user.getName(),
                OtpType.PASSWORD_RESET,
                token.getCode());
        emailFuture.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Email failed: {}", ex.getMessage());
            } else {
                log.info("Email succeeded: {}", result);
            }
        });
        return ResetPasswordResponse.builder()
                .message("Otp Sent Successfully")
                .email(savedNewToken.getUser().getUsername())
                .build();
    }

    @Transactional
    @Override
    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
        OtpCode savedToken = otpCodeRepository.findByCodeAndTypeAndUsedFalse(request.getOtp(),OtpType.PASSWORD_RESET)
                .orElseThrow(() -> new BusinessException(ErrorCode.OTP_TOKEN_INVALID));
        if (!savedToken.isValid()) {
            throw new BusinessException(ErrorCode.OTP_TOKEN_INVALID);
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }
        User savedUser = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if (this.passwordEncoder.matches(request.getNewPassword(), savedUser.getPassword())) {
            throw new BusinessException(ErrorCode.CHANGE_PASSWORD_MISMATCH);
        }
        final String encoded = this.passwordEncoder.encode(request.getNewPassword());
        savedUser.setPassword(encoded);
        savedToken.markAsUsed();
        this.userRepository.save(savedUser);
        return ResetPasswordResponse.builder()
                .message("Password Changed Successfully")
                .email(savedUser.getUsername())
                .build();
    }


    private void checkEmail(String email) {
        final boolean usernameExists = this.userRepository.existsByEmail(email);
        if (usernameExists) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
    }


    private void checkPasswords(String password, String confirmPassword) {
        if (password == null || !password.equals(confirmPassword)) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }
    }

    private String generateOtp() {
        return String.format("%06d", (int) (Math.random() * 1000000));
    }
}
