package ntg.project.ZakahCalculator.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ForgetPasswordRequest {
    @NotBlank(message = "VALIDATION.REGISTRATION.USERNAME.NOT_BLANK")
    @Size(min = 1, max = 40, message = "VALIDATION.REGISTRATION.USERNAME.SIZE")
    private String email;
}
