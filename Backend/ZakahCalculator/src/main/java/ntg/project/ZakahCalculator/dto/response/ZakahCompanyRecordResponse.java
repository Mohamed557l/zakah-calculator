package ntg.project.ZakahCalculator.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Builder
public class ZakahCompanyRecordResponse {
    private Long id;

    // Assets
    private BigDecimal cashEquivalents;
    private BigDecimal accountsReceivable;
    private BigDecimal inventory;
    private BigDecimal investment;

    // Liabilities
    private BigDecimal accountsPayable;
    private BigDecimal shortTermLiability;
    private BigDecimal accruedExpenses;
    private BigDecimal yearlyLongTermLiabilities;

    // Other Info
    private BigDecimal goldPrice;
    private BigDecimal totalZakah;
    private Long userId;
    private LocalDate balanceSheetDate;

    //Get Total Assets
    public BigDecimal getTotalAssets() {
        return cashEquivalents
                .add(accountsReceivable)
                .add(inventory)
                .add(investment);
    }

    //GetTotalLiability
    public BigDecimal getTotalLiabilities() {
        return accountsPayable
                .add(shortTermLiability)
                .add(accruedExpenses)
                .add(yearlyLongTermLiabilities);
    }

    //Get NetZakahBase
    public BigDecimal getNetZakahBase() {
        return getTotalAssets().subtract(getTotalLiabilities());
    }
}
