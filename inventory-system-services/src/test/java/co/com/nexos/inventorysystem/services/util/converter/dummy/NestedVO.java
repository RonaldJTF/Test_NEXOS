package co.com.nexos.inventorysystem.services.util.converter.dummy;

import lombok.Data;

@Data
public class NestedVO {
    private String id;
    private Inner inner;

    @Data
    public static class Inner {
        private String value;
    }
}