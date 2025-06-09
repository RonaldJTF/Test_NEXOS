package co.com.nexos.inventorysystem.services.exception.handler;

import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.util.Methods;
import co.com.nexos.inventorysystem.services.util.Trace;

@Log4j2
@ControllerAdvice
public class DataIntegrityViolationExceptionGlobalHandler {
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ResponseEntity<?> handleException(DataIntegrityViolationException ex) {
        Trace.logError(Methods.class.getName(), Methods.getCurrentMethodName(Methods.class), ex);
        return Methods.handleException(new NexosException(ex.getMessage(), 500));
    }
}