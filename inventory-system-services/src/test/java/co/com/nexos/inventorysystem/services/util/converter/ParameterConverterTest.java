package co.com.nexos.inventorysystem.services.util.converter;


import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.util.converter.dummy.SimpleVO;
import co.com.nexos.inventorysystem.services.util.converter.dummy.NestedVO;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.Map;

public class ParameterConverterTest {

    @Test
    void testConvertSimpleVO() throws NexosException {
        Map<String, String[]> params = new HashMap<>();
        params.put("name", new String[]{"Alice"});
        params.put("email", new String[]{"alice@example.com"});

        ParameterConverter converter = new ParameterConverter(SimpleVO.class);
        Object result = converter.converter(params);

        assertNotNull(result);
        assertTrue(result instanceof SimpleVO);

        SimpleVO vo = (SimpleVO) result;
        assertEquals("Alice", vo.getName());
        assertEquals("alice@example.com", vo.getEmail());
    }

    @Test
    void testConvertNestedVO() throws NexosException {
        Map<String, String[]> params = new HashMap<>();
        params.put("id", new String[]{"123"});
        params.put("inner.value", new String[]{"nested value"});

        ParameterConverter converter = new ParameterConverter(NestedVO.class);
        Object result = converter.converter(params);

        assertNotNull(result);
        assertTrue(result instanceof NestedVO);

        NestedVO vo = (NestedVO) result;
        assertEquals("123", vo.getId());
        assertNotNull(vo.getInner());
        assertEquals("nested value", vo.getInner().getValue());
    }

    @Test
    void testConvertWithDelimiter() throws NexosException {
        Map<String, String[]> params = new HashMap<>();
        params.put("name", new String[]{"Alice", "Bob"});

        ParameterConverter converter = new ParameterConverter(SimpleVO.class);
        Object result = converter.converter(params, "|");

        assertNotNull(result);
        SimpleVO vo = (SimpleVO) result;
        assertEquals("Alice|Bob", vo.getName());
    }

    @Test
    void testInvalidClassConversionThrowsNexosException() {
        ParameterConverter converter = new ParameterConverter(Void.class);
        Map<String, String[]> params = new HashMap<>();

        NexosException exception = assertThrows(NexosException.class, () -> converter.converter(params));
        assertEquals(500, exception.getCode());
    }
}