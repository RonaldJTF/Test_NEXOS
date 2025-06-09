package co.com.nexos.inventorysystem.services.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import co.com.nexos.inventorysystem.services.exception.NexosException;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.*;

public class Methods {
    /**
     * Returns a Pageable object according to the page number (pageNo), page size (pageSize),
     * the field to sort by (sortField), and the sort direction (sortDirection).
     * Note: The sort direction can be, for example, ASC or DESC. The sortField must be a valid
     * attribute of the class of the object being sorted.
     */
    public static Pageable pageable(Integer pageNo, Integer pageSize, String sortField, String sortDirection) {
        int page = pageNo - 1;
        Sort sort = Sort.Direction.ASC.name().equalsIgnoreCase(sortDirection) ? Sort.by(new String[]{sortField}).ascending() : Sort.by(new String[]{sortField}).descending();
        if (page < 0) {
            page = 0;
        }
        return PageRequest.of(page, pageSize, sort);
    }

    /**
     * Retrieves the name of the method from which this method is called,
     * along with its parameters and their types.
     */
    public static String getCurrentMethodName(Class<?> clazz) {
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        if (stackTrace.length >= 3) {
            StackTraceElement element = stackTrace[2];
            String methodName = element.getMethodName();
            String methodParameters = getParameterNames(clazz, methodName);
            return methodName.concat(" (").concat(methodParameters).concat(") ");
        }
        return "Unknown";
    }

    /**
     * Allows obtaining the parameters of a method in a given class.
     */
    public static String getParameterNames(Class<?> clazz, String methodName) {
        try {
            Method[] methods = clazz.getDeclaredMethods();
            for (Method method : methods) {
                if (method.getName().equals(methodName)) {
                    Parameter[] parameters = method.getParameters();
                    StringBuilder parameterNames = new StringBuilder();
                    for (Parameter parameter : parameters) {
                        parameterNames.append(parameter.getType().getSimpleName() + " " + parameter.getName()).append(", ");
                    }
                    if (parameterNames.length() > 0) {
                        parameterNames.setLength(parameterNames.length() - 2); // Eliminar la última coma y espacio
                    }
                    return parameterNames.toString();
                }
            }
            return "Unknown";
        } catch (Exception e) {
            return "Unknown";
        }
    }

    /**
     * Returns a ResponseEntity based on the presence of an ID and the contents of the provided object.
     * If the id is null, it is assumed that the response is a list query.
     * In that case, if the list is empty, it returns a  204 No Content response.
     * If the id is not null, it is assumed that the response is for a specific item.
     * In that case, if the list is empty, it returns a 404 Not Found response.
     * Otherwise, it returns the first item in the list with a 200 OK status.
     * @param id the ID used to determine whether the response is for a specific item or a list
     * @param objeto an object expected to be a List<?>, which is either the result of a list or a single-item query
     * @return a ResponseEntity with the appropriate HTTP status and body based on the input
     */
    public static ResponseEntity<?> getResponseAccordingToId(Long id, Object objeto) {
        if (id == null) {
            if (((List<?>) objeto).isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        } else {
            if (((List<?>) objeto).isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            objeto = ((List<?>) objeto).get(0);
        }
        return new ResponseEntity<>(objeto, HttpStatus.OK);
    }

    /**
     * Handles exceptions of type NexosException and returns appropriate HTTP responses.
     * Args:
     * - e: NexosException containing the error code and message.
     * Returns: A ResponseEntity containing error details and the corresponding HTTP status.
     * Notes:
     * 1. If the exception code is 404, returns an empty body with HTTP 404 (Not Found).
     * 2. If the exception code is null, returns an internal server error with code and message.
     * 3. For other codes, tries to resolve to a valid HttpStatus and responds accordingly.
     * 4. The response body includes:
     *    - isException (boolean): Always true.
     *    - code (int): The exception error code.
     *    - message (String): A human-readable error message.
     */
    public static ResponseEntity<?> handleException(NexosException e) {
        if (404 == e.getCode()) {
            return new ResponseEntity<>(new HashMap<>(), HttpStatus.NOT_FOUND);
        } else {
            Map<String, Object> responseError = new HashMap<>();
            responseError.put("isException", true);
            responseError.put("code", e.getCode());
            responseError.put("message", e.getMessage());
            return null == e.getCode() 
                ? new ResponseEntity<>(responseError, HttpStatus.INTERNAL_SERVER_ERROR) 
                : new ResponseEntity<>(responseError, (HttpStatus) Objects.requireNonNull(HttpStatus.resolve(e.getCode())));
        }
    }
}
