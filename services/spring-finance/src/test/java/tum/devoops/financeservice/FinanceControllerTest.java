package tum.devoops.financeservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor;
import org.springframework.test.web.servlet.MockMvc;
import tum.devoops.financeservice.config.SecurityConfig;
import tum.devoops.financeservice.controller.FinanceController;
import tum.devoops.financeservice.model.Balance;
import tum.devoops.financeservice.model.Transaction;
import tum.devoops.financeservice.model.TransactionCreate;
import tum.devoops.financeservice.model.TransactionPartialUpdate;
import tum.devoops.financeservice.service.TransactionService;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FinanceController.class)
@Import(SecurityConfig.class)
class FinanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TransactionService transactionService;

    private static final UUID REQUESTER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final UUID MEMBER_ID    = UUID.fromString("00000000-0000-0000-0000-000000000002");
    private static final UUID TX_ID        = UUID.fromString("00000000-0000-0000-0000-000000000003");

    private JwtRequestPostProcessor memberJwt() {
        return jwt().jwt(j -> j.subject(REQUESTER_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_member"));
    }

    private JwtRequestPostProcessor adminJwt() {
        return jwt().jwt(j -> j.subject(REQUESTER_ID.toString()))
                .authorities(new SimpleGrantedAuthority("ROLE_admin"));
    }

    private Transaction sampleTransaction() {
        return new Transaction(TX_ID, MEMBER_ID.toString(), REQUESTER_ID.toString(),
                500, OffsetDateTime.now(), "Membership fee", null);
    }

    // ── POST /finance/transactions ─────────────────────────────────────────────

    @Test
    void createTransaction_unauthenticated_returns401() throws Exception {
        mockMvc.perform(post("/finance/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new TransactionCreate(MEMBER_ID.toString(), 500, "Membership fee"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void createTransaction_noMatchingRole_returns403() throws Exception {
        mockMvc.perform(post("/finance/transactions")
                        .with(jwt().jwt(j -> j.subject(REQUESTER_ID.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new TransactionCreate(MEMBER_ID.toString(), 500, "Membership fee"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void createTransaction_asMember_returns201() throws Exception {
        Transaction tx = sampleTransaction();
        when(transactionService.createTransaction(any(), eq(REQUESTER_ID), eq(false))).thenReturn(tx);

        mockMvc.perform(post("/finance/transactions")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new TransactionCreate(MEMBER_ID.toString(), 500, "Membership fee"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(TX_ID.toString()));
    }

    @Test
    void createTransaction_asAdmin_returns201() throws Exception {
        Transaction tx = sampleTransaction();
        when(transactionService.createTransaction(any(), eq(REQUESTER_ID), eq(true))).thenReturn(tx);

        mockMvc.perform(post("/finance/transactions")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new TransactionCreate(MEMBER_ID.toString(), 500, "Membership fee"))))
                .andExpect(status().isCreated());
    }

    @Test
    void createTransaction_missingBody_returns400() throws Exception {
        mockMvc.perform(post("/finance/transactions")
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // ── GET /finance/transactions ──────────────────────────────────────────────

    @Test
    void getAllTransactions_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/finance/transactions"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAllTransactions_asMember_returns200() throws Exception {
        when(transactionService.getAllTransactions(REQUESTER_ID, false))
                .thenReturn(List.of(sampleTransaction()));

        mockMvc.perform(get("/finance/transactions").with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(TX_ID.toString()));
    }

    @Test
    void getAllTransactions_asAdmin_returns200() throws Exception {
        when(transactionService.getAllTransactions(REQUESTER_ID, true)).thenReturn(List.of());

        mockMvc.perform(get("/finance/transactions").with(adminJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // ── GET /finance/transactions/{id} ────────────────────────────────────────

    @Test
    void getTransaction_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/finance/transactions/{id}", TX_ID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getTransaction_asMember_returns200() throws Exception {
        Transaction tx = sampleTransaction();
        when(transactionService.getTransaction(TX_ID, REQUESTER_ID, false)).thenReturn(tx);

        mockMvc.perform(get("/finance/transactions/{id}", TX_ID).with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(TX_ID.toString()));
    }

    @Test
    void getTransaction_asAdmin_returns200() throws Exception {
        Transaction tx = sampleTransaction();
        when(transactionService.getTransaction(TX_ID, REQUESTER_ID, true)).thenReturn(tx);

        mockMvc.perform(get("/finance/transactions/{id}", TX_ID).with(adminJwt()))
                .andExpect(status().isOk());
    }

    // ── DELETE /finance/transactions/{id} ─────────────────────────────────────

    @Test
    void deleteTransaction_unauthenticated_returns401() throws Exception {
        mockMvc.perform(delete("/finance/transactions/{id}", TX_ID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deleteTransaction_asMember_returns204() throws Exception {
        doNothing().when(transactionService).deleteTransaction(TX_ID, REQUESTER_ID, false);

        mockMvc.perform(delete("/finance/transactions/{id}", TX_ID).with(memberJwt()))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteTransaction_asAdmin_returns204() throws Exception {
        doNothing().when(transactionService).deleteTransaction(TX_ID, REQUESTER_ID, true);

        mockMvc.perform(delete("/finance/transactions/{id}", TX_ID).with(adminJwt()))
                .andExpect(status().isNoContent());
    }

    // ── PATCH /finance/transactions/{id} ──────────────────────────────────────

    @Test
    void updateTransaction_unauthenticated_returns401() throws Exception {
        mockMvc.perform(patch("/finance/transactions/{id}", TX_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateTransaction_asMember_returns200() throws Exception {
        Transaction tx = sampleTransaction();
        when(transactionService.updateTransaction(eq(TX_ID), any(), eq(REQUESTER_ID), eq(false)))
                .thenReturn(tx);

        mockMvc.perform(patch("/finance/transactions/{id}", TX_ID)
                        .with(memberJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new TransactionPartialUpdate().title("Updated"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(TX_ID.toString()));
    }

    @Test
    void updateTransaction_asAdmin_returns200() throws Exception {
        Transaction tx = sampleTransaction();
        when(transactionService.updateTransaction(eq(TX_ID), any(), eq(REQUESTER_ID), eq(true)))
                .thenReturn(tx);

        mockMvc.perform(patch("/finance/transactions/{id}", TX_ID)
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new TransactionPartialUpdate().amountCents(999))))
                .andExpect(status().isOk());
    }

    // ── GET /finance/balances ─────────────────────────────────────────────────

    @Test
    void getAllBalances_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/finance/balances"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAllBalances_asMember_returns200() throws Exception {
        when(transactionService.getAllBalances(REQUESTER_ID, false))
                .thenReturn(List.of(new Balance(MEMBER_ID.toString(), 200)));

        mockMvc.perform(get("/finance/balances").with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].balance_cents").value(200));
    }

    @Test
    void getAllBalances_asAdmin_returns200() throws Exception {
        when(transactionService.getAllBalances(REQUESTER_ID, true)).thenReturn(List.of());

        mockMvc.perform(get("/finance/balances").with(adminJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    // ── GET /finance/balances/{member_id} ────────────────────────────────────

    @Test
    void getMemberBalance_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/finance/balances/{memberId}", MEMBER_ID))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getMemberBalance_asMember_returns200() throws Exception {
        Balance balance = new Balance(MEMBER_ID.toString(), 500);
        when(transactionService.getMemberBalance(MEMBER_ID, REQUESTER_ID, false)).thenReturn(balance);

        mockMvc.perform(get("/finance/balances/{memberId}", MEMBER_ID).with(memberJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance_cents").value(500));
    }

    @Test
    void getMemberBalance_asAdmin_returns200() throws Exception {
        Balance balance = new Balance(MEMBER_ID.toString(), 300);
        when(transactionService.getMemberBalance(MEMBER_ID, REQUESTER_ID, true)).thenReturn(balance);

        mockMvc.perform(get("/finance/balances/{memberId}", MEMBER_ID).with(adminJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance_cents").value(300));
    }
}
