package ntg.project.ZakahCalculator.service;


import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import ntg.project.ZakahCalculator.dto.request.*;
import ntg.project.ZakahCalculator.dto.response.AuthenticationResponse;
import ntg.project.ZakahCalculator.dto.response.ResetPasswordResponse;

public interface AuthenticationService {
    AuthenticationResponse login(AuthenticationRequest request);

    void register(RegistrationRequest request);

    AuthenticationResponse refreshToken(RefreshRequest request);

    ResetPasswordResponse forgetPassword(ForgetPasswordRequest request) throws MessagingException;


    // TODO -> (Wait frontend)
    @Transactional
    ResetPasswordResponse resetPassword(ResetPasswordRequest request);
}
