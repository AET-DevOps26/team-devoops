package tum.devoops.memberservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import tum.devoops.memberservice.model.BadRequestResponse;
import tum.devoops.memberservice.model.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(NotFoundException ex) {
        return new ErrorResponse().message(ex.getMessage());
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleForbidden(ForbiddenException ex) {
        return new ErrorResponse().message(ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public BadRequestResponse handleBadRequest(BadRequestException ex) {
        return new BadRequestResponse().message(ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleConflict(ConflictException ex) {
        return new ErrorResponse().message(ex.getMessage());
    }

    // Kept for backwards compatibility with call sites that still signal a conflict via the
    // built-in IllegalStateException instead of the dedicated ConflictException.
    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleIllegalState(IllegalStateException ex) {
        return new ErrorResponse().message(ex.getMessage());
    }

    // Without this handler, a failed @Valid check on a request body (e.g. a missing
    // required field) falls through to Spring's default resolver, which sets the 400
    // status but writes no response body at all.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public BadRequestResponse handleValidation(MethodArgumentNotValidException ex) {
        BadRequestResponse response = new BadRequestResponse().message("Validation failed");
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            response.addErrorsItem(new ErrorResponse(
                    fieldError.getField() + ": " + fieldError.getDefaultMessage()));
        }
        return response;
    }
}
