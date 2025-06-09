package co.com.nexos.inventorysystem.services.config.security.register;

import co.com.nexos.inventorysystem.services.model.dto.RegisterDTO;

public class RegisterContext {

    private static final ThreadLocal<RegisterDTO> REGISTER = new ThreadLocal<>();

    public static RegisterDTO getRegisterDTO() {
        return REGISTER.get();
    }

    public static void setRegistradorDTO(RegisterDTO registerDTO) {
        REGISTER.set(registerDTO);
    }
}