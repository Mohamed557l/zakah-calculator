package ntg.project.ZakahCalculator.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class DeleteAccountResponse {
    private String message;
    private LocalDate deletedAt;
    private LocalDate restoreUntil;
}
