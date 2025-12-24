package ntg.project.ZakahCalculator.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZakahCompanyRecordRequest {

    @NotBlank(message = "This field can't be Empty")
    private BigDecimal cashEquivalents;

    @NotBlank(message = "This field can't be Empty")
    private BigDecimal accountsReceivable;

    @NotBlank(message = "This field can't be Empty")
    private BigDecimal inventory;

    @NotBlank(message = "This field can't be Empty")
    private BigDecimal investment;
    @NotBlank(message = "This field can't be Empty")
    private BigDecimal accountsPayable;
    @NotBlank(message = "This field can't be Empty")
    private BigDecimal shortTermLiability;
    @NotBlank(message = "This field can't be Empty")
    private BigDecimal accruedExpenses;
    @NotBlank(message = "This field can't be Empty")
    private BigDecimal yearly_long_term_liabilities;

    @NotBlank(message = "This field can't be Empty")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate balance_sheet_date;

    @NotBlank(message = "This field can't be Empty")
    private BigDecimal goldPrice;

    @NotBlank(message = "This field can't be Empty")
    private Long userId;

    public BigDecimal getCashEquivalents() {
        return cashEquivalents;
    }

    public void setCashEquivalents(BigDecimal cashEquivalents) {
        this.cashEquivalents = cashEquivalents;
    }

    public BigDecimal getAccountsReceivable() {
        return accountsReceivable;
    }

    public void setAccountsReceivable(BigDecimal accountsReceivable) {
        this.accountsReceivable = accountsReceivable;
    }

    public BigDecimal getInventory() {
        return inventory;
    }

    public void setInventory(BigDecimal inventory) {
        this.inventory = inventory;
    }

    public BigDecimal getAccountsPayable() {
        return accountsPayable;
    }

    public void setAccountsPayable(BigDecimal accountsPayable) {
        this.accountsPayable = accountsPayable;
    }

    public BigDecimal getInvestment() {
        return investment;
    }

    public void setInvestment(BigDecimal investment) {
        this.investment = investment;
    }

    public BigDecimal getShortTermLiability() {
        return shortTermLiability;
    }

    public void setShortTermLiability(BigDecimal shortTermLiability) {
        this.shortTermLiability = shortTermLiability;
    }

    public BigDecimal getAccruedExpenses() {
        return accruedExpenses;
    }

    public void setAccruedExpenses(BigDecimal accruedExpenses) {
        this.accruedExpenses = accruedExpenses;
    }

    public BigDecimal getYearly_long_term_liabilities() {
        return yearly_long_term_liabilities;
    }

    public void setYearly_long_term_liabilities(BigDecimal yearly_long_term_liabilities) {
        this.yearly_long_term_liabilities = yearly_long_term_liabilities;
    }

    public LocalDate getBalance_sheet_date() {
        return balance_sheet_date;
    }

    public void setBalance_sheet_date(LocalDate balance_sheet_date) {
        this.balance_sheet_date = balance_sheet_date;
    }

    public BigDecimal getGoldPrice() {
        return goldPrice;
    }

    public void setGoldPrice(BigDecimal goldPrice) {
        this.goldPrice = goldPrice;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
