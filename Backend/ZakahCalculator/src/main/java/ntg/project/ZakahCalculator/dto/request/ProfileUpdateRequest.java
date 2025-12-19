package ntg.project.ZakahCalculator.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

    @Size(min = 1, max = 25, message = "VALIDATION.UPDATE_PROFILE.FIRSTNAME.SIZE")
    private String firstName;

    @Size(min = 1, max = 25, message = "VALIDATION.UPDATE_PROFILE.LASTNAME.SIZE")
    private String lastName;
}
