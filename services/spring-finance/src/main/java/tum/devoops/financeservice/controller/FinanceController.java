package tum.devoops.financeservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;
import tum.devoops.financeservice.api.FinanceApi;
import tum.devoops.financeservice.model.Balance;
import tum.devoops.financeservice.model.Transaction;
import tum.devoops.financeservice.model.TransactionCreate;
import tum.devoops.financeservice.model.TransactionPartialUpdate;
import tum.devoops.financeservice.service.TransactionService;

import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasAnyRole('admin', 'member')")
public class FinanceController implements FinanceApi {

    @Autowired
    TransactionService transactionService;

    @Override
    public ResponseEntity<Transaction> createTransaction(TransactionCreate transactionCreate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        Transaction created = transactionService.createTransaction(transactionCreate, requesterId, isAdmin);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Override
    public ResponseEntity<Void> deleteTransaction(UUID transactionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        transactionService.deleteTransaction(transactionId, requesterId, isAdmin);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(transactionService.getAllTransactions(requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Transaction> getTransaction(UUID transactionId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(transactionService.getTransaction(transactionId, requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Transaction> updateTransaction(UUID transactionId, TransactionPartialUpdate transactionPartialUpdate) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(transactionService.updateTransaction(transactionId, transactionPartialUpdate, requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<List<Balance>> getAllBalances() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(transactionService.getAllBalances(requesterId, isAdmin));
    }

    @Override
    public ResponseEntity<Balance> getMemberBalance(UUID memberId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID requesterId = extractRequesterId(auth);
        boolean isAdmin = extractIsAdmin(auth);
        return ResponseEntity.ok(transactionService.getMemberBalance(memberId, requesterId, isAdmin));
    }

    private UUID extractRequesterId(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        return UUID.fromString(jwt.getSubject());
    }

    private boolean extractIsAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_admin".equals(a.getAuthority()));
    }
}
