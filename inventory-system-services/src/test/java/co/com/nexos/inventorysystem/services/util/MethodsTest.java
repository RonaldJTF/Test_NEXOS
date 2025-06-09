package co.com.nexos.inventorysystem.services.util;

import co.com.nexos.inventorysystem.services.exception.NexosException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class MethodsTest {

    @Test
    void getResponseAccordingToId_nullId_emptyList_returnsNoContent() {
        ResponseEntity<?> response = Methods.getResponseAccordingToId(null, List.of());
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void getResponseAccordingToId_nullId_nonEmptyList_returnsOkWithList() {
        List<String> list = List.of("item1", "item2");
        ResponseEntity<?> response = Methods.getResponseAccordingToId(null, list);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(list, response.getBody());
    }

    @Test
    void getResponseAccordingToId_withId_emptyList_returnsNotFound() {
        ResponseEntity<?> response = Methods.getResponseAccordingToId(123L, List.of());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getResponseAccordingToId_withId_nonEmptyList_returnsFirstItem() {
        List<String> list = List.of("item1", "item2");
        ResponseEntity<?> response = Methods.getResponseAccordingToId(123L, list);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("item1", response.getBody());
    }

    @Test
    void handleException_code404_returnsNotFound() {
        NexosException exception = new NexosException("Not Found", 404);
        ResponseEntity<?> response = Methods.handleException(exception);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(((Map<?, ?>) response.getBody()).isEmpty());
    }

    @SuppressWarnings("unchecked")
    @Test
    void handleException_customCode_returnsExpectedStatus() {
        NexosException exception = new NexosException("Forbidden", 403);
        ResponseEntity<?> response = Methods.handleException(exception);
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());

        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(true, body.get("isException"));
        assertEquals("Forbidden", body.get("message"));
        assertEquals(403, body.get("code"));
    }
}
