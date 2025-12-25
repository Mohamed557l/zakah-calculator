package ntg.project.ZakahCalculator.service.impl;

import lombok.RequiredArgsConstructor;
import ntg.project.ZakahCalculator.dto.request.ChangePasswordRequest;
import ntg.project.ZakahCalculator.dto.request.ProfileUpdateRequest;
import ntg.project.ZakahCalculator.dto.response.DeleteAccountResponse;
import ntg.project.ZakahCalculator.dto.response.ProfileUpdateResponse;
import ntg.project.ZakahCalculator.entity.User;
import ntg.project.ZakahCalculator.exception.BusinessException;
import ntg.project.ZakahCalculator.exception.ErrorCode;
import ntg.project.ZakahCalculator.mapper.UserMapper;
import ntg.project.ZakahCalculator.repository.UserRepository;
import ntg.project.ZakahCalculator.service.UserService;
import ntg.project.ZakahCalculator.util.UserUtil;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserUtil userIDUtility;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmailIgnoreCase(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + username));
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        Long userId = userIDUtility.getAuthenticatedUserId();
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new BusinessException(ErrorCode.PASSWORD_MISMATCH);
        }

        User user = findById(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CURRENT_PASSWORD);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public ProfileUpdateResponse updateProfileInfo(ProfileUpdateRequest request) {
        Long userId = userIDUtility.getAuthenticatedUserId();
        User user = findById(userId);
        userMapper.updateUserFromRequest(request, user);
        User updatedUser = userRepository.save(user);
        return userMapper.userToProfileUpdateResponse(updatedUser);
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public DeleteAccountResponse softDeleteUser() {
        Long userId = userIDUtility.getAuthenticatedUserId();
        User user = findById(userId);

        if (user.isDeleted()) {
            throw new BusinessException(ErrorCode.USER_ALREADY_DELETED);
        }

        LocalDateTime deletedAt = LocalDateTime.now();
        LocalDateTime restoreUntil = deletedAt.plusDays(30);

        // تحديث حالة الحذف في قاعدة البيانات
        userRepository.softDelete(userId, deletedAt);

        // استخدام UserMapper بدلاً من DeleteAccountMapper
        return userMapper.toDeleteAccountResponse(
                deletedAt.toLocalDate(),
                restoreUntil.toLocalDate()
        );
    }

    @Override
    public void restoreUser() {
        Long userId = userIDUtility.getAuthenticatedUserId();
        User user = findById(userId);

        if (!user.isDeleted()) {
            throw new BusinessException(ErrorCode.USER_ALREADY_ACTIVE);
        }

        user.setDeleted(false);
        user.setDeletionDate(null);
        userRepository.save(user);
    }

}
