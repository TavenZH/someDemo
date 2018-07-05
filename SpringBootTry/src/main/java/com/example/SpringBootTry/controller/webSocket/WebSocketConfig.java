package com.example.SpringBootTry.controller.webSocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

/**
 * 双工通信websocket基础配置类
 * @author wwl
 *
 */
@Configuration
public class WebSocketConfig {
	@Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }

}
