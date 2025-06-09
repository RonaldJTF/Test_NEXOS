package co.com.nexos.inventorysystem.services.model.dto;

import java.util.Date;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class RegisterDTO {
    private String userId;
    private Date date;
    private String ip;

    public String getJsonAsString(){
        Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
        date = new Date();
        return (gson.toJson(this));
    }
}
