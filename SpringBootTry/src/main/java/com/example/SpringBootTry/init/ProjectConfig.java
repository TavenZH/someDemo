package com.example.SpringBootTry.init;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

/**
 * 基础配置类
 * @author wwl
 *
 */
@Configuration
public class ProjectConfig {
	
	/**
	 * 双工通信配置
	 * @return
	 */
	@Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
