package tum.devoops.letterservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import tum.devoops.letterservice.model.BadRequestResponse;
import tum.devoops.letterservice.model.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Without this handler, a failed @Valid check on a request body (e.g. an empty subject)
    // falls through to Spring's default resolver, which sets the 400 status but doesn't shape
    // the body to the OpenAPI-documented BadRequestResponse.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BadRequestResponse> handleValidation(MethodArgumentNotValidException ex) {
        BadRequestResponse response = new BadRequestResponse().message("Validation failed");
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            response.addErrorsItem(new ErrorResponse(fieldError.getField() + ": " + fieldError.getDefaultMessage()));
        }
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse().message(ex.getMessage()));
    }

    @ExceptionHandler(MailDeliveryException.class)
    public ResponseEntity<ErrorResponse> handleMailDelivery(MailDeliveryException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse().message(ex.getMessage()));
    }

    @ExceptionHandler(PdfGenerationException.class)
    public ResponseEntity<ErrorResponse> handlePdfGeneration(PdfGenerationException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse().message(ex.getMessage()));
    }
}
