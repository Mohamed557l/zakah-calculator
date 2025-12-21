package ntg.project.ZakahCalculator.mapper;

import ntg.project.ZakahCalculator.dto.response.AuthenticationResponse;
import ntg.project.ZakahCalculator.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationMapper {

    private final UserMapper userMapper;

    public AuthenticationMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public AuthenticationResponse toResponse(String accessToken, String refreshToken, User user) {
        AuthenticationResponse response = new AuthenticationResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUserResponse(userMapper.toResponse(user));
        return response;
    }
}
