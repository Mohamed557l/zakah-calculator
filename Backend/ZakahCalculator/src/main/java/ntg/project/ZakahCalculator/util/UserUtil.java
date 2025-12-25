package ntg.project.ZakahCalculator.util;

import lombok.RequiredArgsConstructor;
import ntg.project.ZakahCalculator.entity.User;
import ntg.project.ZakahCalculator.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class UserUtil {
    private final UserRepository userRepository;

    public Long getAuthenticatedUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
        return user.getId();
    }
}
