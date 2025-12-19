package ntg.project.ZakahCalculator.service;

import ntg.project.ZakahCalculator.dto.request.ChangePasswordRequest;
import ntg.project.ZakahCalculator.dto.request.ProfileUpdateRequest;
import ntg.project.ZakahCalculator.dto.response.DeleteAccountResponse;
import ntg.project.ZakahCalculator.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

public interface UserService extends UserDetailsService {

    void changePassword(ChangePasswordRequest request, Long userId);
    void updateProfileInfo(ProfileUpdateRequest request, Long userId);
    User findById(Long id);
    DeleteAccountResponse softDeleteUser(Long userId);
    void restoreUser(Long userId);
}
