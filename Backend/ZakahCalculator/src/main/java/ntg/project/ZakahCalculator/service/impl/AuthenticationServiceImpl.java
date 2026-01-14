package ntg.project.ZakahCalculator.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ntg.project.ZakahCalculator.dto.request.*;
import ntg.project.ZakahCalculator.dto.response.AuthenticationResponse;
import ntg.project.ZakahCalculator.dto.response.ForgetPasswordResponse;
import ntg.project.ZakahCalculator.dto.response.ResetPasswordResponse;
import ntg.project.ZakahCalculator.dto.response.VerifyPasswordOtpResponse;
import ntg.project.ZakahCalculator.entity.User;
import ntg.project.ZakahCalculator.entity.util.OtpType;
import ntg.project.ZakahCalculator.exception.BusinessException;
import ntg.project.ZakahCalculator.exception.ErrorCode;
import ntg.project.ZakahCalculator.mapper.AuthenticationMapper;
import ntg.project.ZakahCalculator.mapper.UserMapper;
import ntg.project.ZakahCalculator.repository.UserRepository;
import ntg.project.ZakahCalculator.security.JwtService;
import ntg.project.ZakahCalculator.service.AuthenticationService;
import ntg.project.ZakahCalculator.service.OtpService;
import ntg.project.ZakahCalculator.service.RoleService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final OtpService otpService;

    private final UserMapper userMapper;
    private final AuthenticationMapper authenticationMapper;

    /* ================= LOGIN ================= */

    @Override
    public AuthenticationResponse login(AuthenticationRequest request) {

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase(),
                        request.getPassword()
                )
        );

        User user = (User) auth.getPrincipal();

        if (!user.isVerified()) {
            otpService.sendOrResend(user.getEmail(), OtpType.EMAIL_VERIFICATION);
            throw new BusinessException(ErrorCode.ACCOUNT_NOT_VERIFIED);
        }

        return generateTokens(user);
    }

    /* ================= REGISTER ================= */

    @Override
    @Transactional
    public void register(RegistrationRequest request) {

        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(List.of(roleService.findByName(request.getUserType())));

        User savedUser = userRepository.save(user);

        otpService.sendOrResend(savedUser.getEmail(), OtpType.EMAIL_VERIFICATION);

        log.info("User registered successfully: {}", savedUser.getEmail());
    }

    /* ================= VERIFY ACCOUNT ================= */

    @Override
    @Transactional
    public AuthenticationResponse verifyAccount(VerifyAccountRequest request) {

        User user = getByEmail(request.getEmail().toLowerCase());

        otpService.verifyOtp(user, request.getOtpCode(), OtpType.EMAIL_VERIFICATION);

        user.setVerified(true);
        userRepository.save(user);

        return generateTokens(user);
    }

    /* ================= REFRESH TOKEN ================= */

    @Override
    public AuthenticationResponse refreshToken(RefreshRequest request) {

        String email = jwtService.extractUsernameFromToken(request.getRefreshToken());

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        String newAccessToken = jwtService.refreshAccessToken(request.getRefreshToken());

        return authenticationMapper.toResponse(
                newAccessToken,
                request.getRefreshToken(),
                user
        );
    }

    /* ================= FORGET PASSWORD ================= */

    @Override
    @Transactional
    public ForgetPasswordResponse forgetPassword(ForgetPasswordRequest request) {

        User user = getByEmail(request.getEmail().toLowerCase());

        otpService.sendOrResend(user.getEmail(), OtpType.PASSWORD_RESET);

        return userMapper.toForgotPasswordResponse(user);
    }

    /* ================= VERIFY RESET OTP ================= */

    @Override
    @Transactional
    public VerifyPasswordOtpResponse verifyPasswordOtp(VerifyOtpRequest request) {

        User user = getByEmail(request.getEmail().toLowerCase());

        return otpService.verifyPasswordResetOtp(user, request.getOtp());
    }

    /* ================= RESET PASSWORD ================= */

    @Override
    @Transactional
    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        User user = otpService.getUserByResetToken(request.getResetToken());

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.CHANGE_PASSWORD_MISMATCH);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return userMapper.toResetPasswordResponse(user);
    }

    /* ================= RESEND VERIFY OTP ================= */

    @Override
    public void resendAccountVerificationOtp(ResendOtpRequest request) {
        otpService.sendOrResend(request.getEmail().toLowerCase(), OtpType.EMAIL_VERIFICATION);
    }

    @Override
    public void resendPasswordVerificationOtp(ResendOtpRequest request) {
        otpService.sendOrResend(request.getEmail().toLowerCase(), OtpType.PASSWORD_RESET);
    }

    /* ================= HELPERS ================= */

    private AuthenticationResponse generateTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user.getUsername());
        String refreshToken = jwtService.generateRefreshToken(user.getUsername());
        return authenticationMapper.toResponse(accessToken, refreshToken, user);
    }

    private User getByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }
}
