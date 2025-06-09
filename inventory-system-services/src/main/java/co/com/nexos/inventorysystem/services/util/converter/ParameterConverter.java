package co.com.nexos.inventorysystem.services.util.converter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import co.com.nexos.inventorysystem.services.exception.NexosException;
import lombok.NoArgsConstructor;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;
/**
 * Converts a series of parameters (attribute 'parameters') into an object of the defined class (attribute 'typeVO').
 *
 * Args:
 * Parameters: Map of parameters with keys and values.
 * typeVO: Class of the target object.
 * Delimiter: used to separate values that share the same key (parameter), since a single key
 * can have multiple values.
 *
 * Notes:
 * 1. If any parameter does not match an attribute in the given class, it will be ignored.
 * 2. If none of the parameters match any attributes in the given class, only an instance of the class
 * will be returned with all fields set to null.
 * 3. If an object (Class X) has another object (Class Y) as an attribute, a String value cannot be
 * converted into an instance of that class (Class Y).
 * 4. If an object (Class X - the target class defined in typeVO) has another object (Class Y) as an attribute,
 * and Class Y has an attribute A, then the parameter name should be: classYAttribute.attributeA.
 * Follow this pattern for cascading values (classYAttribute.classZAttribute.attributeB, and so on).
 */
@NoArgsConstructor
public class ParameterConverter {
    private Map<String, String[]>  parameters;
    private Class<?> clazz;
    private String delimiter;
    private final String DEFAULT_DELIMITER = ",";
    private final String REGEX_OF_SEPARATOR_OF_ATTRIBUTE = "\\.";
    private final String SEPARATOR_OF_ATTRIBUTE = ".";

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ParameterConverter (Class<?> clazz){
        this.clazz = clazz;
    }

    public Object converter(Map<String, String[]> parameters) throws NexosException {
        this.parameters = parameters;
        this.delimiter = this.DEFAULT_DELIMITER;
        return this.converterToObject();
    }

    public Object converter(Map<String, String[]> parameters, String delimiter) throws NexosException {
        this.parameters = parameters;
        this.delimiter = delimiter;
        return this.converterToObject();
    }

   private Object converterToObject() throws NexosException {
        Object instanceClass;
        try {
            Class<?> classVO = this.clazz;
            instanceClass = classVO.getDeclaredConstructor().newInstance();

            Map<String, Object> paramMap = new HashMap<>();
            for (Map.Entry<String, String[]> entry : this.parameters.entrySet()) {
                String name = entry.getKey();
                String[] values = entry.getValue();
                String valueString = String.join(delimiter, values);

                if (name.contains(SEPARATOR_OF_ATTRIBUTE)) {
                    addNestedParam(paramMap, name.split(REGEX_OF_SEPARATOR_OF_ATTRIBUTE), valueString);
                } else {
                    paramMap.put(name, valueString);
                }
            }

            String jsonString = objectMapper.writeValueAsString(paramMap);
            instanceClass = objectMapper.readValue(jsonString, classVO);

        } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException | JsonProcessingException e) {
            throw new NexosException(e.getMessage(), 500);
        }
        return instanceClass;
    }

    @SuppressWarnings("unchecked")
    private void addNestedParam(Map<String, Object> map, String[] keys, String value) {
        Map<String, Object> currentMap = map;
        for (int i = 0; i < keys.length - 1; i++) {
            currentMap = (Map<String, Object>) currentMap.computeIfAbsent(keys[i], k -> new HashMap<>());
        }
        currentMap.put(keys[keys.length - 1], value);
    }
}
