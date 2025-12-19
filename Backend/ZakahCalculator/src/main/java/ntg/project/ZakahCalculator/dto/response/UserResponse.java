package ntg.project.ZakahCalculator.dto.response;


import lombok.*;

@NoArgsConstructor
@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserResponse {
    private Long userId;
    private String username;
    private String fullName;
}
