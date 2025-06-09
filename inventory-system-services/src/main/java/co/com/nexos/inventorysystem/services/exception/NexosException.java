package co.com.nexos.inventorysystem.services.exception;

public class NexosException extends Exception{
    private Integer code = 500;

    public NexosException(String message) {
        super(message);
    }

    public NexosException(String message, Integer code) {
        super(message);
        this.code = code;
    }

    public Integer getCode() {
        return this.code;
    }
}
